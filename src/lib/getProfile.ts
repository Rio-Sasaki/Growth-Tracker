import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function getProfile(userId: string) {
  const profile = await prisma.profiles.findUnique({
    where: { user_id: userId },
  });

  if (!profile) {
    return {
      profile: null,
      error: NextResponse.json(
        { error: 'プロフィールが見つかりません' },
        { status: 404 }
      ),
    };
  }

  return { profile, error: null };
}
