import { createClient } from '@/lib/supabase-server';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
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

  const profile = await prisma.profiles.findUnique({
    where: { user_id: user.id },
  });

  if (!profile) {
    return NextResponse.json({ tags: [] });
  }

  const tags = await prisma.tags.findMany({
    where: { profile_id: profile.id },
    orderBy: { created_at: 'asc' },
  });

  return NextResponse.json({ tags });
}

export async function POST(
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

  const profile = await prisma.profiles.findUnique({
    where: { user_id: user.id },
  });

  if (!profile) {
    return NextResponse.json(
      { error: 'プロフィールが見つかりません' },
      { status: 404 }
    );
  }

  const { name, color } = await request.json();

  const tag = await prisma.tags.create({
    data: {
      profile_id: profile.id,
      name,
      color,
    },
  });

  return NextResponse.json({ tag });
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

  const { tagId } = await request.json();

  await prisma.tags.delete({
    where: { id: tagId },
  });

  return NextResponse.json({ success: true });
}
