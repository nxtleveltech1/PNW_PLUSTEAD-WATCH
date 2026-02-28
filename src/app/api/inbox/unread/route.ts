import { NextResponse } from "next/server";
import { getUnreadCount } from "@/lib/messaging";

export const dynamic = "force-dynamic";

export async function GET() {
  const count = await getUnreadCount();
  return NextResponse.json({ count });
}
