import { NextResponse, NextRequest } from 'next/server';
import { bookIssues, books } from '@/lib/db/schema';
import { db } from '@/lib/db/db';
import { eq, sql, and } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const { studentId } = await req.json();

    if (!studentId) {
      return NextResponse.json({ error: 'Missing studentId' }, { status: 400 });
    }

    // ✅ Get latest unreturned book for this student
    const [issue] = await db
      .select()
      .from(bookIssues)
      .where(
        and(
          eq(bookIssues.studentId, studentId),
          eq(bookIssues.returned, false)
        )
      )
      .orderBy(bookIssues.issueDate)
      .limit(1);

    if (!issue) {
      return NextResponse.json({ message: 'No unreturned books found' }, { status: 404 });
    }

    // ✅ Mark as returned
    await db.update(bookIssues)
      .set({ returned: true })
      .where(eq(bookIssues.id, issue.id));

    // ✅ Update availableCopies
    await db.update(books)
      .set({ availableCopies: sql`${books.availableCopies} + 1` })
      .where(eq(books.id, issue.bookId));

    // ✅ Get book title
    const [book] = await db
      .select({ title: books.title })
      .from(books)
      .where(eq(books.id, issue.bookId))
      .limit(1);

    return NextResponse.json({
      message: 'Book returned successfully',
      bookId: issue.bookId,
      bookTitle: book?.title ?? '', // ⚠️ fallback in case not found
    });

  } catch (err) {
    console.error('[RETURN_BOOK_ERROR]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
