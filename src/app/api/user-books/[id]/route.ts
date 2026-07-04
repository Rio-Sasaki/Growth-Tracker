import { createClient } from '@/lib/supabase-server';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '未認証' }, { status: 401 });
  }

  const userBook = await prisma.user_books.findUnique({
    where: { id },
    include: { books: true },
  });

  return NextResponse.json({ userBook });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '未認証' }, { status: 401 });
  }

  const { status, isFavorite, startedAt, finishedAt, progressPage } =
    await request.json();

  const userBook = await prisma.user_books.update({
    where: { id },
    data: {
      ...(status !== undefined && { status }),
      ...(isFavorite !== undefined && { is_favorite: isFavorite }),
      ...(startedAt !== undefined && {
        started_at: startedAt ? new Date(startedAt) : null,
      }),
      ...(finishedAt !== undefined && {
        finished_at: finishedAt ? new Date(finishedAt) : null,
      }),
      ...(progressPage !== undefined && {
        progress_page: progressPage ? Number(progressPage) : null,
      }),
    },
    include: { books: true },
  });

  return NextResponse.json({ userBook });
}
