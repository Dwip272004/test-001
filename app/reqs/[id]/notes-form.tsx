"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function NotesForm({ reqId }: { reqId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setBusy(true);
    setError("");
    const res = await fetch(`/api/reqs/${reqId}/notes`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ author: data.get("author"), body: data.get("body") }),
    });
    setBusy(false);
    if (!res.ok) {
      setError((await res.json().catch(() => null))?.error ?? "Could not save the note.");
      return;
    }
    form.reset();
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="author">Your name<input id="author" name="author" required /></label>
      <label htmlFor="body">Note<textarea id="body" name="body" required /></label>
      {error && <p className="error" role="alert">{error}</p>}
      <button type="submit" disabled={busy}>{busy ? "Saving…" : "Add note"}</button>
    </form>
  );
}
