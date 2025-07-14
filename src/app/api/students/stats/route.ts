import { db } from "@/lib/db/db";
import { students } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const all = await db.select().from(students);
    const approved = await db.select().from(students).where(eq(students.isApproved, true));
    const pending = await db.select().from(students).where(eq(students.isApproved, false));

    return NextResponse.json({
      stats: {
        totalStudents: all.length,
        approvedStudents: approved.length,
        pendingStudents: pending.length,
      },
    });
  } catch (error) {
    console.error("[GET_STATS_ERROR]", error);
    return new NextResponse("Failed to fetch stats", { status: 500 });
  }
}
