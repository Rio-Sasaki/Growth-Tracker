import { createClient } from '@/lib/supabase-server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getProfile } from '@/lib/getProfile';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '未認証' }, { status: 401 });
  }

  const { profile, error } = await getProfile(user.id);
  if (error) return error;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const yearAgo = new Date();
  yearAgo.setDate(yearAgo.getDate() - 365);
  yearAgo.setHours(0, 0, 0, 0);

  const [allStudies, booksThisMonth] = await Promise.all([
    prisma.studies.findMany({
      where: {
        profile_id: profile!.id,
        OR: [
          { started_at: { gte: yearAgo } },
          { created_at: { gte: yearAgo } },
        ],
      },
      include: { categories: true },
      orderBy: { created_at: 'asc' },
    }),
    prisma.user_books.count({
      where: {
        profile_id: profile!.id,
        status: 2,
        finished_at: { gte: startOfMonth },
      },
    }),
  ]);

  const getStudyDate = (s: (typeof allStudies)[0]) => {
    return s.started_at ? new Date(s.started_at) : new Date(s.created_at);
  };

  const studiesThisMonth = allStudies.filter((s) => {
    const d = getStudyDate(s);
    return d >= startOfMonth;
  });

  const totalMinutesThisMonth = studiesThisMonth.reduce(
    (sum, s) => sum + s.duration_minutes,
    0
  );

  const totalMinutesAll = allStudies.reduce(
    (sum, s) => sum + s.duration_minutes,
    0
  );

  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayStudies = allStudies.filter((s) => {
      const d = getStudyDate(s);
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

  const studyDateSet = new Set(
    allStudies.map((s) => {
      const d = getStudyDate(s);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    })
  );

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    if (studyDateSet.has(date.getTime())) {
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
