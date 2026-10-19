import { NextResponse } from "next/server";

// Cap characters per reply so the free ElevenLabs quota (10k credits/month)
// isn't burned by long bot answers. Also keeps the Fish Audio fallback cheap.
const MAX_CHARS = 600;

type ProviderResult = { res: Response; provider: string };

/**
 * Primary voice: ElevenLabs.
 *
 * Returns the upstream Response as soon as its HEADERS arrive — the audio
 * body is streamed through untouched so the browser can start playing the
 * first chunk while the rest is still being generated. Returns null on any
 * failure (not configured, quota used up, network issue) so the caller can
 * fall through to the Fish Audio backup.
 */
async function tryElevenLabs(text: string): Promise<ProviderResult | null> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID;
  if (!apiKey || !voiceId) return null;

  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          // Flash model costs ~0.5 credits/char (vs ~1 for multilingual v2),
          // roughly doubling how far the free monthly credits go.
          model_id: "eleven_flash_v2_5",
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("ElevenLabs error:", res.status, err);
      return null;
    }

    return { res, provider: "elevenlabs" };
  } catch (e) {
    console.error("ElevenLabs request failed:", e);
    return null;
  }
}

/**
 * Backup voice: Fish Audio. Used automatically when ElevenLabs fails or
 * runs out of quota, so SCORPI keeps an AI voice instead of dropping to
 * the free browser TTS.
 *
 * Model defaults to the free developer tier; set FISH_AUDIO_MODEL=s2.1-pro
 * on a paid plan. On a 402 (payment required) we retry once on s2.1-pro in
 * case the key is a paid key pointed at the free model.
 *
 * latency defaults to "low" (fastest time-to-first-byte, small quality
 * tradeoff — fine for chat replies). Set FISH_AUDIO_LATENCY=normal to
 * prefer quality over speed.
 */
async function tryFishAudio(text: string): Promise<ProviderResult | null> {
  const apiKey = process.env.FISH_AUDIO_API_KEY;
  const voiceId = process.env.FISH_AUDIO_VOICE_ID;
  if (!apiKey || !voiceId) return null;

  const configuredModel = process.env.FISH_AUDIO_MODEL || "s2.1-pro-free";
  const latency = process.env.FISH_AUDIO_LATENCY === "normal" ? "normal" : "low";
  const body = JSON.stringify({
    text,
    reference_id: voiceId,
    format: "mp3",
    sample_rate: 44100,
    mp3_bitrate: 128,
    normalize: true,
    latency,
  });

  const call = (model: string) =>
    fetch("https://api.fish.audio/v1/tts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        model,
      },
      body,
    });

  try {
    let res = await call(configuredModel);
    if (res.status === 402 && configuredModel !== "s2.1-pro") {
      console.warn("Fish Audio rejected the free model (402), retrying with s2.1-pro");
      res = await call("s2.1-pro");
    }

    if (!res.ok) {
      const err = await res.text();
      console.error("Fish Audio error:", res.status, err);
      return null;
    }

    return { res, provider: "fish-audio" };
  } catch (e) {
    console.error("Fish Audio request failed:", e);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    const clean = text
      .replace(/^>\s?/gm, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, MAX_CHARS);
    if (!clean) {
      return NextResponse.json({ error: "empty text" }, { status: 400 });
    }

    const elevenConfigured = !!(
      process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_VOICE_ID
    );
    const fishConfigured = !!(
      process.env.FISH_AUDIO_API_KEY && process.env.FISH_AUDIO_VOICE_ID
    );
    if (!elevenConfigured && !fishConfigured) {
      return NextResponse.json({ error: "Voice service is not configured" }, { status: 503 });
    }

    // Provider chain: ElevenLabs first, Fish Audio as the second voice
    // whenever ElevenLabs fails (quota exhausted, outage, bad key).
    const result = (await tryElevenLabs(clean)) ?? (await tryFishAudio(clean));

    if (!result) {
      return NextResponse.json({ error: "Voice generation failed" }, { status: 502 });
    }

    // Stream the upstream body straight through instead of buffering the
    // whole clip first — the browser starts playing after the first chunk,
    // which cuts seconds off time-to-audio on longer replies.
    return new NextResponse(result.res.body, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
        "X-Voice-Provider": result.provider,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
