"use client";

import { useState } from "react";
import { Loader2, Clipboard, ClipboardCheck } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSummarize = async () => {
    setLoading(true);
    setCopied(false);
    setSummary("");
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      setSummary(data.summary);
    } catch (err) {
      console.error("Failed to summarize:", err);
      setSummary("❌ Failed to summarize. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 md:px-24 py-10 bg-black text-white">
      <h1 className="text-4xl font-bold mb-4 text-center">AI Article Summarizer</h1>
      <p className="text-center mb-6 max-w-xl text-neutral-400">
        Paste a link to an article, and we’ll fetch and summarize it using AI. Built with ❤️ for the Nostr hackathon.
      </p>
      <div className="w-full max-w-2xl space-y-4">
        <Input
          placeholder="Enter article URL (e.g. https://en.wikipedia.org/wiki/Nostr)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full"
        />
        <Button onClick={handleSummarize} className="w-full" disabled={loading || !url}>
          {loading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Summarizing...</>
          ) : (
            <>Summarize Article</>
          )}
        </Button>
        {summary && (
          <div className="bg-neutral-900 p-4 rounded-lg border border-neutral-700 relative">
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 text-neutral-400 hover:text-white"
              aria-label="Copy summary"
            >
              {copied ? <ClipboardCheck className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
            </button>
            <pre className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-200">
              {summary}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
