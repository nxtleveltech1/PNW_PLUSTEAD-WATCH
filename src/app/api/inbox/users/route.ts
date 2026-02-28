import { NextResponse, type NextRequest } from "next/server";
import { searchUsers } from "@/lib/messaging";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const results = await searchUsers(q);
  return NextResponse.json(results);
}
