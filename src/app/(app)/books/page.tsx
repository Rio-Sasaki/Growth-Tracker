'use client';

import { useState } from 'react';
import { Search, Heart } from 'lucide-react';
import { searchBooks, GoogleBook } from '@/lib/google-books';
import Image from 'next/image';
import Link from 'next/link';

type Tab = 'search' | 'list';

type StatusFilter = 'all' | 0 | 1 | 2;

const STATUS_LABELS: Record<number, string> = {
  0: '未読',
  1: '読書中',
  2: '読了',
};

// ダミーデータ
const dummyBooks = [
  {
    id: '1',
    title: '具体と抽象',
    author: '細谷功',
    thumbnail: null,
    status: 1,
    isFavorite: true,
  },
  {
    id: '2',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    thumbnail: null,
    status: 0,
    isFavorite: false,
  },
  {
    id: '3',
    title: '人を動かす',
    author: 'D・カーネギー',
    thumbnail: null,
    status: 2,
    isFavorite: true,
  },
];

export default function BooksPage() {
  const [tab, setTab] = useState<Tab>('list');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GoogleBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchKeyword, setSearchKeyword] = useState('');

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
    // TODO: Prismaで書籍を登録する処理を実装
    alert(`「${book.volumeInfo.title}」を登録しました`);
  };

  const filteredBooks = dummyBooks
    .filter((book) => statusFilter === 'all' || book.status === statusFilter)
    .filter(
      (book) =>
        book.title.includes(searchKeyword) ||
        book.author.includes(searchKeyword)
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
      </div>

      {/* 本棚タブ */}
      {tab === 'list' && (
        <div>
          {/* フィルター・検索 */}
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

          {/* 書籍一覧 */}
          <div className="space-y-3">
            {filteredBooks.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                該当する書籍がありません
              </p>
            ) : (
              filteredBooks.map((book) => (
                <Link
                  key={book.id}
                  href={`/books/${book.id}`}
                  className="bg-white border border-gray-200 rounded-lg p-4 flex gap-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-16 h-20 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400 flex-shrink-0">
                    No Image
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-800 mb-1">
                      {book.title}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">{book.author}</p>
                    <span
                      className={`inline-block text-xs px-2 py-0.5 rounded-full ${
                        book.status === 1
                          ? 'bg-blue-100 text-blue-600'
                          : book.status === 2
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {STATUS_LABELS[book.status]}
                    </span>
                  </div>
                  <div className="flex-shrink-0 flex items-center">
                    <Heart
                      size={16}
                      fill={book.isFavorite ? 'currentColor' : 'none'}
                      className={
                        book.isFavorite ? 'text-red-500' : 'text-gray-300'
                      }
                    />
                  </div>
                </Link>
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
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handleRegister(book)}
                      className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-blue-700"
                    >
                      登録
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
