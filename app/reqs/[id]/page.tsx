import Link from "next/link";
import { notFound } from "next/navigation";
import { getReq, listNotes } from "@/lib/store";
import { NotesForm } from "./notes-form";

export const dynamic = "force-dynamic";

export default async function ReqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const req = await getReq(id);
  if (!req) notFound();
  const notes = await listNotes(id);

  return (
    <>
      <p style={{ margin: 0 }}><Link href="/">← All reqs</Link></p>
      <section className="panel">
        <h1>{req.title}</h1>
        <p className="meta">
          {[req.client, req.location].filter(Boolean).join(" · ") || "No client or location"}
          {" — submitted by "}{req.recruiter} on {new Date(req.createdAt).toLocaleDateString()}
        </p>
        <p>
          <a href={`/api/reqs/${req.id}/file`} target="_blank" rel="noopener noreferrer">
            Open JD: {req.file.name}
          </a>
          <span className="meta"> ({(req.file.size / 1024).toFixed(0)} KB)</span>
        </p>
      </section>
      <section className="panel">
        <h2>Add a note</h2>
        <NotesForm reqId={id} />
      </section>
      <section className="panel">
        <h2>Notes ({notes.length})</h2>
        {notes.length === 0 ? (
          <p className="empty">No notes yet.</p>
        ) : (
          <ul className="list">
            {notes.map((n) => (
              <li key={n.id}>
                <span className="meta">{n.author}, {new Date(n.createdAt).toLocaleString()}</span>
                <span className="note-body">{n.body}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
