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

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // 今月の学習記録
  const studiesThisMonth = await prisma.studies.findMany({
    where: {
      profile_id: profile.id,
      created_at: { gte: startOfMonth },
    },
    include: { categories: true },
  });

  // 全学習記録
  const allStudies = await prisma.studies.findMany({
    where: { profile_id: profile.id },
    orderBy: { created_at: 'asc' },
  });

  // 今月の読書冊数（読了）
  const booksThisMonth = await prisma.user_books.count({
    where: {
      profile_id: profile.id,
      status: 2,
      updated_at: { gte: startOfMonth },
    },
  });

  // 今月の学習時間（分）
  const totalMinutesThisMonth = studiesThisMonth.reduce(
    (sum, s) => sum + s.duration_minutes,
    0
  );

  // 総学習時間（分）
  const totalMinutesAll = allStudies.reduce(
    (sum, s) => sum + s.duration_minutes,
    0
  );

  // 週別学習データ（直近7日）
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayStudies = allStudies.filter((s) => {
      const d = new Date(s.created_at);
      return (
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
      );
    });
    return {
      day: ['日', '月', '火', '水', '木', '金', '土'][date.getDay()],
      minutes: dayStudies.reduce((sum, s) => sum + s.duration_minutes, 0),
    };
  });

  // カテゴリ別学習データ
  const categoryMap = new Map<string, { category: string; minutes: number }>();
  studiesThisMonth.forEach((s) => {
    const name = s.categories?.name ?? 'その他';
    const existing = categoryMap.get(name);
    if (existing) {
      existing.minutes += s.duration_minutes;
    } else {
      categoryMap.set(name, { category: name, minutes: s.duration_minutes });
    }
  });
  const categoryData = Array.from(categoryMap.values());

  // 連続学習日数
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const hasStudy = allStudies.some((s) => {
      const d = new Date(s.created_at);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === date.getTime();
    });
    if (hasStudy) {
      streak++;
    } else {
      break;
    }
  }

  return NextResponse.json({
    totalMinutesThisMonth,
    totalMinutesAll,
    booksThisMonth,
    streak,
    weeklyData,
    categoryData,
  });
}
