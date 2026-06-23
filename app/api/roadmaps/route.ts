import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role to bypass RLS for internal fetches
  );

  const { data, error } = await supabase
    .from("roadmaps")
    .select("*, skill_nodes(*)") // Important: This fetches the nodes with the roadmap
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return new NextResponse(error.message, { status: 500 });

  return NextResponse.json({ roadmaps: data });
}