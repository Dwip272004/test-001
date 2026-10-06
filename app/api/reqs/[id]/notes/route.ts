import { NextRequest, NextResponse } from "next/server";
import { addNote, getReq } from "@/lib/store";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { author, body } = (await req.json()) as { author?: string; body?: string };
  if (!author?.trim() || !body?.trim()) {
    return NextResponse.json({ error: "Name and note are required." }, { status: 400 });
  }
  if (!(await getReq(id))) {
    return NextResponse.json({ error: "Req not found." }, { status: 404 });
  }
  const note = await addNote(id, author.trim(), body.trim());
  return NextResponse.json(note, { status: 201 });
}
