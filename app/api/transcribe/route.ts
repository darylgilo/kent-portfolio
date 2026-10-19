import { NextResponse } from "next/server";

// Whisper cost scales with clip length; the client's VAD already stops the
// recorder after ~1.8s of silence and caps at 30s, so no extra trimming here.

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GROQ_API_KEY is not configured" }, { status: 500 });
    }

    const form = await req.formData();
    const audio = form.get("audio");

    if (!(audio instanceof File) || audio.size === 0) {
      return NextResponse.json({ error: "audio file is required" }, { status: 400 });
    }

    const groqForm = new FormData();
    groqForm.append("file", audio, audio.name || "speech.webm");
    groqForm.append("model", "whisper-large-v3-turbo");
    // No language hint: Whisper auto-detects per clip, so Tagalog, English
    // and Taglish all transcribe correctly without a manual toggle.
    // verbose_json also reports WHICH language it heard, which the client
    // uses to adapt its prompts and fallback TTS voice automatically.
    groqForm.append("response_format", "verbose_json");

    const groqRes = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: groqForm,
    });

    if (!groqRes.ok) {
      const err = await groqRes.text();
      console.error("Groq transcription error:", groqRes.status, err);
      return NextResponse.json({ error: "Transcription failed" }, { status: 502 });
    }

    const data = await groqRes.json();
    const text = typeof data?.text === "string" ? data.text.trim() : "";
    // Groq reports the detected language as a full name ("English",
    // "Tagalog"); normalize to the ISO 639-1 code the client expects.
    const rawLang = typeof data?.language === "string" ? data.language.trim().toLowerCase() : "";
    const language =
      rawLang === "tl" || rawLang.startsWith("tagalog") || rawLang.startsWith("filipino")
        ? "tl"
        : "en";
    return NextResponse.json({ text, language });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}