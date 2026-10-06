"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function NewReqForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setBusy(true);
    setError("");
    const res = await fetch("/api/reqs", { method: "POST", body: new FormData(form) });
    setBusy(false);
    if (!res.ok) {
      setError((await res.json().catch(() => null))?.error ?? "Upload failed. Try again.");
      return;
    }
    form.reset();
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="grid2">
        <label htmlFor="title">Job title *<input id="title" name="title" required /></label>
        <label htmlFor="client">Client / hiring team<input id="client" name="client" /></label>
        <label htmlFor="location">Location<input id="location" name="location" /></label>
        <label htmlFor="recruiter">Your name *<input id="recruiter" name="recruiter" required /></label>
      </div>
      <label htmlFor="file">Job description (PDF, DOC, DOCX, TXT, MD, RTF, max 4 MB) *
        <input id="file" name="file" type="file" required accept=".pdf,.doc,.docx,.txt,.md,.rtf" />
      </label>
      {error && <p className="error" role="alert">{error}</p>}
      <button type="submit" disabled={busy}>{busy ? "Uploading…" : "Submit req"}</button>
    </form>
  );
}
