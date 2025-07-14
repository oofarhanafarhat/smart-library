import { db } from '@/lib/db/db';
import { students } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server'; // ✅ typed Request

// --------------------------------------------------
// POST /api/students/[id]/approve
// --------------------------------------------------
export async function POST(
  _req: NextRequest,              // ← `_` prefix kyunki hum body use nahī̃ kar rahe
  { params }: { params: { id: string } },
) {
  const { id } = params;          // ✅ direct destructure, await ki zaroorat nahī̃

  try {
    await db
      .update(students)
      .set({ isApproved: true })
      .where(eq(students.id, id));

    return NextResponse.json({
      message: '✅ Student approved successfully',
    });
  } catch (err: unknown) {        // ✅ `unknown`, implicit/explicit `any` se bach gaye
    console.error('Approval failed:', err);
    return NextResponse.json(
      { error: 'Approval failed' },
      { status: 500 },
    );
  }
}


