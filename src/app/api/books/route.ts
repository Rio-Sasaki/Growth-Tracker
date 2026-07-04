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

  if (!profile) {
    return NextResponse.json({ userBooks: [] });
  }

  const userBooks = await prisma.user_books.findMany({
    where: { profile_id: profile.id },
    include: { books: true },
    orderBy: { created_at: 'desc' },
  });

  return NextResponse.json({ userBooks });
}

export async function POST(request: NextRequest) {
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

  const {
    googleBooksId,
    title,
    author,
    thumbnailUrl,
    isbn,
    pageCount,
    description,
  } = await request.json();

  // 書籍をupsert（同じgoogle_books_idがあれば使い回す）
  const book = await prisma.books.upsert({
    where: { google_books_id: googleBooksId ?? '' },
    update: {},
    create: {
      google_books_id: googleBooksId,
      title,
      author,
      thumbnail_url: thumbnailUrl,
      isbn,
      page_count: pageCount,
      description,
    },
  });

  // user_booksに登録
  const userBook = await prisma.user_books.create({
    data: {
      profile_id: profile.id,
      book_id: book.id,
      status: 0,
    },
    include: { books: true },
  });

  return NextResponse.json({ userBook });
}
