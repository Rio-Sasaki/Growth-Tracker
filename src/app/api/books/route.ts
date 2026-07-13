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

  const profile = await prisma.profiles.upsert({
    where: { user_id: user.id },
    update: {},
    create: { user_id: user.id },
  });

  const {
    googleBooksId,
    title,
    author,
    thumbnailUrl,
    isbn,
    pageCount,
    description,
  } = await request.json();

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

  // 既に登録済みか確認
  const existing = await prisma.user_books.findFirst({
    where: {
      profile_id: profile.id,
      book_id: book.id,
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: 'この書籍はすでに本棚に登録されています' },
      { status: 409 }
    );
  }

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
