import { createClient } from '@/lib/supabase-server';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '未認証' }, { status: 401 });
  }

  const { memoId, tagId } = await request.json();

  await prisma.memo_tags.create({
    data: {
      memo_id: memoId,
      tag_id: tagId,
    },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '未認証' }, { status: 401 });
  }

  const { memoId, tagId } = await request.json();

  await prisma.memo_tags.delete({
    where: {
      memo_id_tag_id: {
        memo_id: memoId,
        tag_id: tagId,
      },
    },
  });

  return NextResponse.json({ success: true });
}
