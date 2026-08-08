import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getProfile } from '@/lib/getProfile';
import { prisma } from '@/lib/prisma';

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

  const userBooks = await prisma.user_books.findMany({
    where: { profile_id: profile!.id },
    include: { books: true },
  });

  if (userBooks.length === 0) {
    return NextResponse.json(
      { error: '本棚に書籍がありません' },
      { status: 400 }
    );
  }

  const bookList = userBooks.slice(0, 10).map((ub) => ({
    title: ub.books.title,
    author: ub.books.author ?? '著者不明',
  }));

  const prompt = `
あなたは書籍レコメンドの専門家です。
以下はユーザーの本棚に登録されている書籍の一覧です。

${bookList.map((b, i) => `${i + 1}. 「${b.title}」（${b.author}）`).join('\n')}

これらの書籍の傾向を分析して、ユーザーが好みそうな書籍を3冊おすすめしてください。
ただし、上記の本棚に既に登録されている書籍はおすすめしないでください。

以下の形式で回答してください。

---
タイトル: 書籍タイトル
著者: 著者名
理由: おすすめ理由（2〜3文。1文は90文字以内。各文は句点「。」で終わり、文と文の間は改行してください）
---
タイトル: 書籍タイトル
著者: 著者名
理由: おすすめ理由（2〜3文。1文は90文字以内。各文は句点「。」で終わり、文と文の間は改行してください）
---
タイトル: 書籍タイトル
著者: 著者名
理由: おすすめ理由（2〜3文。1文は90文字以内。各文は句点「。」で終わり、文と文の間は改行してください）
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
