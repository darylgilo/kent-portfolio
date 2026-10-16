import { NextResponse } from "next/server";

// Cap characters per reply so the free ElevenLabs quota (10k credits/month)
// isn't burned by long bot answers.
const MAX_CHARS = 600;

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = process.env.ELEVENLABS_VOICE_ID;
    if (!apiKey || !voiceId) {
      return NextResponse.json({ error: "ElevenLabs is not configured" }, { status: 503 });
    }

    const clean = text
      .replace(/^>\s?/gm, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, MAX_CHARS);
    if (!clean) {
      return NextResponse.json({ error: "empty text" }, { status: 400 });
    }

    const elRes = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: clean,
          // Flash model costs ~0.5 credits/char (vs ~1 for multilingual v2),
          // roughly doubling how far the free monthly credits go.
          model_id: "eleven_flash_v2_5",
        }),
      }
    );

    if (!elRes.ok) {
      const err = await elRes.text();
      console.error("ElevenLabs error:", elRes.status, err);
      return NextResponse.json({ error: "Voice generation failed" }, { status: 502 });
    }

    const audio = await elRes.arrayBuffer();
    return new NextResponse(audio, {
      headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
