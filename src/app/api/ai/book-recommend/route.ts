import { createClient } from '@/lib/supabase-server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

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

  // 本棚の書籍を取得
  const userBooks = await prisma.user_books.findMany({
    where: { profile_id: profile.id },
    include: { books: true },
  });

  if (userBooks.length === 0) {
    return NextResponse.json(
      { error: '本棚に書籍がありません' },
      { status: 400 }
    );
  }

  const bookList = userBooks.map((ub) => ({
    title: ub.books.title,
    author: ub.books.author ?? '著者不明',
  }));

  const prompt = `
あなたは書籍レコメンドの専門家です。
以下はユーザーの本棚に登録されている書籍の一覧です。

${bookList.map((b, i) => `${i + 1}. 「${b.title}」（${b.author}）`).join('\n')}

これらの書籍の傾向を分析して、ユーザーが好みそうな書籍を3冊おすすめしてください。
ただし、上記の本棚に既に登録されている書籍はおすすめしないでください。

以下のJSON形式で回答してください。他の文章は一切含めないでください。
[
  {
    "title": "書籍タイトル",
    "author": "著者名",
   "reason": "おすすめ理由（2〜3文。1文は90文字以内。各文は句点「。」で終わり、文と文の間は改行してください）"
  }
]
`;

  const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });
  const result = await model.generateContent(prompt);
  const text = result.response
    .text()
    .replace(/```json|```/g, '')
    .trim();

  try {
    const recommendations = JSON.parse(text);
    return NextResponse.json({ recommendations });
  } catch (e) {
    console.log('parse error:', e);
    console.log('raw text:', text);
    return NextResponse.json(
      { error: 'レコメンドの生成に失敗しました' },
      { status: 500 }
    );
  }
}
