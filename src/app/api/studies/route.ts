import { createClient } from '@/lib/supabase-server';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

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

  const studies = await prisma.studies.findMany({
    where: { profile_id: profile.id },
    include: { categories: true },
    orderBy: { created_at: 'desc' },
  });

  return NextResponse.json({ studies });
}

export async function POST(request: NextRequest) {
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

  const { categoryId, durationMinutes, note } = await request.json();

  const study = await prisma.studies.create({
    data: {
      profile_id: profile.id,
      category_id: categoryId,
      duration_minutes: durationMinutes,
      note,
    },
    include: { categories: true },
  });

  return NextResponse.json({ study });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '未認証' }, { status: 401 });
  }

  const { id } = await request.json();

  await prisma.studies.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
