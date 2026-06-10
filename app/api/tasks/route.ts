import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Tasks API route" });
}

export async function POST() {
  return NextResponse.json({ message: "Tasks API route" });
}
