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
    const language = form.get("language");

    if (!(audio instanceof File) || audio.size === 0) {
      return NextResponse.json({ error: "audio file is required" }, { status: 400 });
    }

    // Whisper speaks ISO 639-1 — "tl" (Tagalog/Filipino) or "en".
    const lang = typeof language === "string" && ["tl", "en"].includes(language) ? language : undefined;

    const groqForm = new FormData();
    groqForm.append("file", audio, audio.name || "speech.webm");
    groqForm.append("model", "whisper-large-v3-turbo");
    if (lang) groqForm.append("language", lang);

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
    return NextResponse.json({ text });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}