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

  const profile = await prisma.profiles.findUnique({
    where: { user_id: user.id },
  });

  return NextResponse.json({ profile });
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '未認証' }, { status: 401 });
  }

  const { accountName, displayName, bio } = await request.json();

  const profile = await prisma.profiles.upsert({
    where: { user_id: user.id },
    update: {
      account_name: accountName,
      display_name: displayName,
      bio,
    },
    create: {
      user_id: user.id,
      account_name: accountName,
      display_name: displayName,
      bio,
    },
  });

  return NextResponse.json({ profile });
}
