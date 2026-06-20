'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { searchBooks, GoogleBook } from '@/lib/google-books';
import Image from 'next/image';

export default function BooksPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GoogleBook[]>([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">読書</h1>

      {/* 検索フォーム */}
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

      {/* 検索結果 */}
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
  );
}
