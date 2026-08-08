import { createClient } from '@/lib/supabase-server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getProfile } from '@/lib/getProfile';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

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

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const studies = await prisma.studies.findMany({
    where: {
      profile_id: profile!.id,
      created_at: { gte: thirtyDaysAgo },
    },
    include: { categories: true },
    orderBy: { created_at: 'asc' },
  });

  if (studies.length === 0) {
    return NextResponse.json(
      { error: '学習記録がありません' },
      { status: 400 }
    );
  }

  const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
  const dayMap = new Map<string, number>();
  dayNames.forEach((d) => dayMap.set(d, 0));
  const categoryMap = new Map<string, number>();

  studies.forEach((s) => {
    const date = s.started_at ? new Date(s.started_at) : new Date(s.created_at);
    const day = dayNames[date.getDay()];
    dayMap.set(day, (dayMap.get(day) ?? 0) + s.duration_minutes);
    const category = s.categories?.name ?? 'その他';
    categoryMap.set(
      category,
      (categoryMap.get(category) ?? 0) + s.duration_minutes
    );
  });

  const dayData = Array.from(dayMap.entries()).map(([day, minutes]) => ({
    day,
    minutes,
  }));
  const categoryData = Array.from(categoryMap.entries()).map(
    ([category, minutes]) => ({ category, minutes })
  );
  const totalMinutes = studies.reduce((sum, s) => sum + s.duration_minutes, 0);

  const prompt = `
あなたは学習コーチです。
以下はユーザーの直近30日間の学習データです。

【総学習時間】
${totalMinutes}分（${Math.floor(totalMinutes / 60)}時間${totalMinutes % 60}分）

【曜日別学習時間】
${dayData.map((d) => `${d.day}曜日: ${d.minutes}分`).join('\n')}

【カテゴリ別学習時間】
${categoryData.map((c) => `${c.category}: ${c.minutes}分`).join('\n')}

このデータをもとに、以下の観点からアドバイスを3つ提供してください。
・学習時間の偏りや傾向
・改善できる点
・モチベーションを上げるための提案

以下の形式で回答してください。

---
タイトル: アドバイスのタイトル（10文字以内）
アドバイス: 具体的なアドバイス（2〜3文。1文は90文字以内。各文は句点「。」で終わり、文と文の間は改行してください）
---
タイトル: アドバイスのタイトル（10文字以内）
アドバイス: 具体的なアドバイス（2〜3文。1文は90文字以内。各文は句点「。」で終わり、文と文の間は改行してください）
---
タイトル: アドバイスのタイトル（10文字以内）
アドバイス: 具体的なアドバイス（2〜3文。1文は90文字以内。各文は句点「。」で終わり、文と文の間は改行してください）
---
`;

  const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const result = await model.generateContentStream(prompt);
        for await (const chunk of result.stream) {
          const text = chunk.text();
          controller.enqueue(new TextEncoder().encode(text));
        }
        controller.close();
      } catch (e) {
        controller.error(e);
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  });
}
