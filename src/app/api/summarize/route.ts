import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "No URL provided." }, { status: 400 });

    const articleRes = await fetch(`https://r.jina.ai/${url}`);
    const articleText = await articleRes.text();
    if (!articleText.trim()) return NextResponse.json({ error: "Article text is empty." }, { status: 400 });

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: articleText,
    });
    const summary = response.text;

    return NextResponse.json({ summary });
  } catch (err) {
    console.error("Gemini Summarization Error:", err);
    return NextResponse.json({ error: "Failed to summarize" }, { status: 500 });
  }
}
