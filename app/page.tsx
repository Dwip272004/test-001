import Link from "next/link";
import { listReqs } from "@/lib/store";
import { NewReqForm } from "./new-req-form";

export const dynamic = "force-dynamic";

export default async function Home() {
  const reqs = await listReqs();
  return (
    <>
      <section className="panel">
        <h1>Submit a req</h1>
        <NewReqForm />
      </section>
      <section className="panel">
        <h2>Open reqs ({reqs.length})</h2>
        {reqs.length === 0 ? (
          <p className="empty">No reqs yet. Submit the first one above.</p>
        ) : (
          <ul className="list">
            {reqs.map((r) => (
              <li key={r.id}>
                <Link className="title" href={`/reqs/${r.id}`}>{r.title}</Link>
                <span className="meta">
                  {[r.client, r.location].filter(Boolean).join(" · ") || "No client or location"}
                  {" — "}{r.recruiter}, {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
