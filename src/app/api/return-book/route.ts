import { NextResponse,NextRequest} from 'next/server';
import { bookIssues, books } from '@/lib/db/schema';
import { db } from '@/lib/db/db';
import { eq, sql, and } from 'drizzle-orm';

async function handleReturnBook(body: { studentId: string; bookId: string }) {
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


  await db.update(books)
    .set({ availableCopies: sql`${books.availableCopies} + 1` })
    .where(eq(books.id, bookId));

  return NextResponse.json({ message: " Book returned successfully" });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    return await handleReturnBook(body);
  } catch (err: unknown) {
    console.error(err);
  
    return NextResponse.json({ err: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return await handleReturnBook(body);
  }catch (err: unknown) {
      console.error(err);  
  return NextResponse.json({ err: "Something went wrong" }, { status: 500 });
}
}