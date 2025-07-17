// File: src/app/api/issue-book/route.ts
export const runtime = 'nodejs';

import { db } from '@/lib/db/db';
import { books, bookIssues, students } from '@/lib/db/schema';
import { NextResponse } from 'next/server';
import { eq,and } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import Twilio from 'twilio';

const twilioClient = Twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

const WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM!; // Already includes "whatsapp:"
console.log("FROM ENV:", process.env.TWILIO_WHATSAPP_FROM);


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentId, bookId, issueDate, returnDate } = body;

    const issue = new Date(issueDate);
    const ret = new Date(returnDate);
    const todayStripped = new Date(new Date().toDateString());

    if (!studentId || !bookId || !issueDate || !returnDate) {
      return new NextResponse(' Missing required fields', { status: 400 });
    }
    if (issue < todayStripped) {
      return new NextResponse(' Issue date cannot be in the past', { status: 400 });
    }
    if (ret <= issue) {
      return new NextResponse(' Return date must be after the issue date', { status: 400 });
    }

    await db.insert(bookIssues).values({
      studentId,
      bookId,
      issueDate: issue.toISOString(),
      returnDate: ret.toISOString(),
      returned: false,
    });

    await db.update(books)
      .set({ availableCopies: sql`${books.availableCopies} - 1` })
      .where(eq(books.id, bookId));

    // ─── WhatsApp Notification ───
    try {
      const [student] = await db.select().from(students).where(eq(students.studentId, studentId));
      const [book] = await db.select().from(books).where(eq(books.id, bookId));

      if (student?.phoneNumber) {
        const cleaned = student.phoneNumber.trim().replace(/\s+/g, '');

        if (!cleaned.startsWith('+')) {
          console.warn(' Invalid phone format for WhatsApp:', cleaned);
        } else {
          const to = 'whatsapp:' + cleaned;
          console.log(" Sending WhatsApp to:", to);

          await twilioClient.messages.create({
            from: WHATSAPP_FROM,
            to,
            body: ` Hi ${student.name}! Your book “${book.title}” has been issued.\nReturn by: ${ret.toLocaleDateString()}\nHappy reading! 📚`
          });
        }
      }
    } catch (twilioErr) {
      console.error('[TWILIO_ERROR]', twilioErr);
    }

    return NextResponse.json({ message: ' Book issued successfully' });
  } catch (err: unknown) {
    console.error('[ISSUE_BOOK_ERROR]', err);
    return new NextResponse(' Failed to issue book', { status: 500 });
  }
}
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
      return new NextResponse("Missing studentId", { status: 400 });
    }

    const booksIssued = await db
      .select({
        id: books.id,
        title: books.title,
      })
      .from(bookIssues)
      .innerJoin(books, eq(bookIssues.bookId, books.id))
      .where(
        and(
          eq(bookIssues.studentId, studentId),
          eq(bookIssues.returned, false)
        )
      );

    return NextResponse.json({ books: booksIssued });
  } catch (err) {
    console.error("[GET_ISSUE_BOOK_ERROR]", err);
    return new NextResponse("Failed to fetch issued books", { status: 500 });
  }
}