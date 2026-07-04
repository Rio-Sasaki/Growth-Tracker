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

  const memos = await prisma.memos.findMany({
    where: { user_book_id: id },
    include: {
      memo_tags: {
        include: { tags: true },
      },
    },
    orderBy: { created_at: 'asc' },
  });

  return NextResponse.json({ memos });
}

export async function POST(
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

  const { content, pageNumber } = await request.json();

  const memo = await prisma.memos.create({
    data: {
      user_book_id: id,
      content,
      page_number: pageNumber ? Number(pageNumber) : null,
      is_important: false,
    },
    include: {
      memo_tags: {
        include: { tags: true },
      },
    },
  });

  return NextResponse.json({ memo });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '未認証' }, { status: 401 });
  }

  const { memoId, content, isImportant } = await request.json();

  const memo = await prisma.memos.update({
    where: { id: memoId },
    data: {
      ...(content !== undefined && { content }),
      ...(isImportant !== undefined && { is_important: isImportant }),
    },
    include: {
      memo_tags: {
        include: { tags: true },
      },
    },
  });

  return NextResponse.json({ memo });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '未認証' }, { status: 401 });
  }

  const { memoId } = await request.json();

  await prisma.memos.delete({
    where: { id: memoId },
  });

  return NextResponse.json({ success: true });
}
