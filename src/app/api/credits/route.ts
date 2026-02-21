import { NextResponse } from "next/server";

export async function GET() {
  // In production: query user's credit balance from database
  return NextResponse.json({
    credits: 100,
    plan: "pro",
    usedThisMonth: 0,
  });
}
