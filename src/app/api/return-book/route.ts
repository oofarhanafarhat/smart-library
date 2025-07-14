import { NextResponse } from 'next/server';
import { bookIssues, books } from '@/lib/db/schema';
import { db } from '@/lib/db/db';
import { eq, sql, and } from 'drizzle-orm';

async function handleReturnBook(body: any) {
  const { studentId, bookId } = body;

  if (!studentId || !bookId) {
    return new NextResponse("Missing fields", { status: 400 });
  }

  // ✅ Mark book as returned
  await db.update(bookIssues)
    .set({ returned: true })
    .where(
      and(
        eq(bookIssues.studentId, studentId),
        eq(bookIssues.bookId, bookId),
        eq(bookIssues.returned, false)
      )
    );

  // ✅ Increase available copies
  await db.update(books)
    .set({ availableCopies: sql`${books.availableCopies} + 1` })
    .where(eq(books.id, bookId));

  return NextResponse.json({ message: "✅ Book returned successfully" });
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    return await handleReturnBook(body);
  } catch (error) {
    console.error('[RETURN_BOOK_ERROR]', error);
    return new NextResponse("Failed to return book", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return await handleReturnBook(body);
  } catch (error) {
    console.error('[RETURN_BOOK_ERROR]', error);
    return new NextResponse("Failed to return book", { status: 500 });
  }
}