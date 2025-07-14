import { db } from '@/lib/db/db';
import { students } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, studentId, qrCode,  phoneNumber,  } = body;

  await db.insert(students).values({ name, email, studentId, qrCode ,  phoneNumber, });

  return NextResponse.json({ message: "Student saved successfully" });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  try {
    let result;

    if (status === "pending") {
      result = await db.select().from(students).where(eq(students.isApproved, false));
    } else if (status === "approved") {
      result = await db.select().from(students).where(eq(students.isApproved, true));
    } else {
      // 👉 Agar koi status nahi ya "all", toh sab students do
      result = await db.select().from(students);
    }

    return NextResponse.json({ students: result });
  } catch (error: unknown) {
    console.error("[GET_STUDENTS_ERROR]", error);
    return new NextResponse("Failed to fetch students", { status: 500 });
  }
}

