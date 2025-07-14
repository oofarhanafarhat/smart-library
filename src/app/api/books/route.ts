// app/api/books/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db/db';
import { books } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    const availableBooks = await db
      .select()
      .from(books)
      .where(sql`${books.availableCopies} > 0`);

    return NextResponse.json({ books: availableBooks });
  } catch (error) {
    console.error('[GET_BOOKS_ERROR]', error);
    return new NextResponse('Failed to fetch books', { status: 500 });
  }
}
