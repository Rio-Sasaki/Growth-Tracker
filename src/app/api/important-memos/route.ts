import { createClient } from '@/lib/supabase-server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '未認証' }, { status: 401 });
  }

  const profile = await prisma.profiles.upsert({
    where: { user_id: user.id },
    update: {},
    create: { user_id: user.id },
  });

  const memos = await prisma.memos.findMany({
    where: {
      is_important: true,
      user_books: {
        profile_id: profile.id,
      },
    },
    include: {
      user_books: {
        include: { books: true },
      },
      memo_tags: {
        include: { tags: true },
      },
    },
    orderBy: { created_at: 'desc' },
  });

  return NextResponse.json({ memos });
}
