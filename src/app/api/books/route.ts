import { createClient } from '@/lib/supabase-server';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
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

  const userBooks = await prisma.user_books.findMany({
    where: { profile_id: profile!.id },
    include: { books: true },
    orderBy: { created_at: 'desc' },
    take: 200,
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

  const { profile, error } = await getProfile(user.id);
  if (error) return error;

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
    select: { id: true },
  });

  const existing = await prisma.user_books.findFirst({
    where: {
      profile_id: profile!.id,
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
      profile_id: profile!.id,
      book_id: book.id,
      status: 0,
    },
    include: { books: true },
  });

  return NextResponse.json({ userBook });
}
