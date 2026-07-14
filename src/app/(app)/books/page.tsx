'use client';

import { useState, useEffect } from 'react';
import { Search, Star } from 'lucide-react';
import { searchBooks, GoogleBook } from '@/lib/google-books';
import Image from 'next/image';
import BookCard from '@/components/books/BookCard';
import ImportantMemoList from '@/components/books/ImportantMemoList';

type Tab = 'search' | 'list' | 'important';
type StatusFilter = 'all' | 0 | 1 | 2;

type UserBook = {
  id: string;
  status: number;
  is_favorite: boolean;
  books: {
    id: string;
    title: string;
    author: string | null;
    thumbnail_url: string | null;
    google_books_id: string | null;
  };
};

type ImportantMemo = {
  id: string;
  content: string;
  page_number: number | null;
  memo_tags: { tags: { id: string; name: string; color: string } }[];
  user_books: {
    id: string;
    books: {
      title: string;
      thumbnail_url: string | null;
    };
  };
};

export default function BooksPage() {
  const [tab, setTab] = useState<Tab>('list');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GoogleBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [userBooks, setUserBooks] = useState<UserBook[]>([]);
  const [importantMemos, setImportantMemos] = useState<ImportantMemo[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const res = await fetch('/api/books');
      const data = await res.json();
      setUserBooks(data.userBooks ?? []);
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    if (tab === 'important') {
      const fetchImportantMemos = async () => {
        const res = await fetch('/api/important-memos');
        const data = await res.json();
        setImportantMemos(data.memos ?? []);
      };
      fetchImportantMemos();
    }
  }, [tab]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const books = await searchBooks(query);
    setResults(books);
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleRegister = async (book: GoogleBook) => {
    const info = book.volumeInfo;
    const isbn = info.industryIdentifiers?.find(
      (i) => i.type === 'ISBN_13'
    )?.identifier;

    const res = await fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        googleBooksId: book.id,
        title: info.title,
        author: info.authors?.join(', '),
        thumbnailUrl: info.imageLinks?.thumbnail,
        isbn,
        pageCount: info.pageCount,
        description: info.description,
      }),
    });

    const data = await res.json();

    if (res.status === 409) {
      alert('この書籍はすでに本棚に登録されています');
      return;
    }

    if (!res.ok) {
      alert('登録に失敗しました');
      return;
    }

    setUserBooks((prev) => [data.userBook, ...prev]);
    alert(`「${info.title}」を登録しました`);
  };

  const isRegistered = (book: GoogleBook) => {
    return userBooks.some((ub) => ub.books.google_books_id === book.id);
  };

  const filteredBooks = userBooks
    .filter((ub) => statusFilter === 'all' || ub.status === statusFilter)
    .filter(
      (ub) =>
        ub.books.title.includes(searchKeyword) ||
        (ub.books.author ?? '').includes(searchKeyword)
    );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">読書</h1>

      {/* タブ */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setTab('list')}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            tab === 'list'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          本棚
        </button>
        <button
          onClick={() => setTab('search')}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            tab === 'search'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          書籍を探す
        </button>
        <button
          onClick={() => setTab('important')}
          className={`px-4 py-2 text-sm font-medium border-b-2 flex items-center gap-1 ${
            tab === 'important'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Star size={14} />
          重要メモ
        </button>
      </div>

      {/* 本棚タブ */}
      {tab === 'list' && (
        <div>
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="タイトル・著者名で絞り込み"
            />
            <select
              value={statusFilter}
              onChange={(e) => {
                const val = e.target.value;
                setStatusFilter(
                  val === 'all' ? 'all' : (Number(val) as 0 | 1 | 2)
                );
              }}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">すべて</option>
              <option value={0}>未読</option>
              <option value={1}>読書中</option>
              <option value={2}>読了</option>
            </select>
          </div>

          <div className="space-y-3">
            {filteredBooks.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                該当する書籍がありません
              </p>
            ) : (
              filteredBooks.map((ub) => (
                <BookCard
                  key={ub.id}
                  id={ub.id}
                  title={ub.books.title}
                  author={ub.books.author}
                  thumbnailUrl={ub.books.thumbnail_url}
                  status={ub.status}
                  isFavorite={ub.is_favorite}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* 書籍を探すタブ */}
      {tab === 'search' && (
        <div>
          <div className="flex gap-2 mb-6">
            <div className="flex-1 relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full border border-gray-300 rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="書籍名・著者名で検索"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '検索中...' : '検索'}
            </button>
          </div>

          <div className="space-y-3">
            {results.map((book) => {
              const info = book.volumeInfo;
              const thumbnail = info.imageLinks?.thumbnail;
              const author = info.authors?.join(', ') ?? '著者不明';
              const registered = isRegistered(book);

              return (
                <div
                  key={book.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 flex gap-4"
                >
                  {thumbnail ? (
                    <Image
                      src={thumbnail}
                      alt={info.title}
                      width={64}
                      height={80}
                      className="object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-20 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
                      No Image
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2">
                      {info.title}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">{author}</p>
                    {info.description && (
                      <p className="text-xs text-gray-400 line-clamp-2">
                        {info.description}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0">
                    {registered ? (
                      <button
                        disabled
                        className="bg-gray-200 text-gray-500 px-3 py-1.5 rounded text-xs font-medium cursor-not-allowed"
                      >
                        登録済み
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRegister(book)}
                        className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-blue-700"
                      >
                        登録
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 重要メモタブ */}
      {tab === 'important' && <ImportantMemoList memos={importantMemos} />}
    </div>
  );
}
