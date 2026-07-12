import { createClient } from '@/lib/supabase-server';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '未認証' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const accountName = searchParams.get('name');

  if (!accountName) {
    return NextResponse.json({ available: true });
  }

  const existing = await prisma.profiles.findFirst({
    where: {
      account_name: accountName,
      NOT: { user_id: user.id },
    },
  });

  return NextResponse.json({ available: !existing });
}
