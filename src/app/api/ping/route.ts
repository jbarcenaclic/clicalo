// src/app/api/ping/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET() {
  const supabase = createSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ status: "unauthenticated" }, { status: 401 });
  }

  return NextResponse.json({
    status: "authenticated",
    user_id: user.id,
    email: user.email,
  });
}
