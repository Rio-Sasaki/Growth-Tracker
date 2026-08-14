'use client';

import Link from 'next/link';
import { useState } from 'react';
import SearchInput from '@/components/ui/SearchInput';

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

type Props = {
  memos: ImportantMemo[];
};

const PIN_COLORS: { dome: string; base: string }[] = [
  { dome: '#ef4444', base: '#fca5a5' },
  { dome: '#f97316', base: '#fdba74' },
  { dome: '#eab308', base: '#fde047' },
  { dome: '#22c55e', base: '#86efac' },
  { dome: '#3b82f6', base: '#93c5fd' },
  { dome: '#a855f7', base: '#d8b4fe' },
];

export default function ImportantMemoList({ memos }: Props) {
  const [filterInput, setFilterInput] = useState('');
  const [filter, setFilter] = useState('');
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const allTags = Array.from(
    new Map(
      memos
        .flatMap((m) => m.memo_tags.map((mt) => mt.tags))
        .map((t) => [t.id, t])
    ).values()
  );

  const handleSearch = async () => {
    setLoading(true);
    setFilter(filterInput);
    setLoading(false);
  };

  const filteredMemos = memos.filter((memo) => {
    const keyword = filter.toLowerCase();
    const matchesKeyword =
      !keyword ||
      memo.content.toLowerCase().includes(keyword) ||
      memo.user_books.books.title.toLowerCase().includes(keyword);
    const matchesTag =
      !tagFilter || memo.memo_tags.some((mt) => mt.tags.id === tagFilter);
    return matchesKeyword && matchesTag;
  });

  return (
    <div>
      {/* フィルター */}
      <div className="space-y-2 mb-4">
        <SearchInput
          value={filterInput}
          onChange={setFilterInput}
          onSearch={handleSearch}
          loading={loading}
          placeholder="書籍名・メモの内容で絞り込み"
        />
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setTagFilter(null)}
              className={`text-xs px-3 py-1 rounded-full border ${
                !tagFilter
                  ? 'bg-gray-800 text-white border-gray-800'
                  : 'bg-white text-gray-500 border-gray-300'
              }`}
            >
              すべて
            </button>
            {allTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() =>
                  setTagFilter(tagFilter === tag.id ? null : tag.id)
                }
                className={`text-xs px-3 py-1 rounded-full border text-white ${
                  tagFilter === tag.id ? 'opacity-100' : 'opacity-60'
                }`}
                style={{ backgroundColor: tag.color, borderColor: tag.color }}
              >
                {tag.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* メモ一覧 */}
      {filteredMemos.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">
          該当する重要メモがありません
        </p>
      ) : (
        <div className="p-4">
          <div className="grid grid-cols-2 gap-8">
            {filteredMemos.map((memo, index) => {
              const pin = PIN_COLORS[index % PIN_COLORS.length];
              return (
                <Link
                  key={memo.id}
                  href={`/books/${memo.user_books.id}`}
                  prefetch={false}
                  className="relative block mt-8"
                >
                  {/* プッシュピン */}
                  <div className="absolute -top-9 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
                    {/* 頭部（正円） */}
                    <div
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        backgroundColor: pin.dome,
                        position: 'relative',
                        zIndex: 2,
                        boxShadow:
                          '0 3px 6px rgba(0,0,0,0.25), inset -3px -3px 5px rgba(0,0,0,0.15)',
                      }}
                    >
                      {/* ハイライト */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '5px',
                          left: '6px',
                          width: '10px',
                          height: '7px',
                          borderRadius: '50%',
                          background:
                            'radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 70%)',
                        }}
                      />
                    </div>

                    {/* 台座（頭部の後ろに少し覗く丸） */}
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        backgroundColor: pin.base,
                        marginTop: '-14px',
                        zIndex: 1,
                        boxShadow: 'inset 0 -3px 4px rgba(0,0,0,0.15)',
                      }}
                    />

                    {/* 針 */}
                    <div
                      style={{
                        width: '3px',
                        height: '10px',
                        marginTop: '-2px',
                        background:
                          'linear-gradient(to bottom, #ddd 0%, #aaa 50%, #666 100%)',
                        borderRadius: '0 0 2px 2px',
                        boxShadow: '1px 0 1px rgba(0,0,0,0.2)',
                      }}
                    />
                  </div>

                  {/* メモカード */}
                  <div
                    className="bg-yellow-50 rounded-sm p-4 pt-5 min-h-32 hover:brightness-95 transition-all"
                    style={{
                      transform: `rotate(${((index % 5) - 2) * 1.2}deg)`,
                      boxShadow:
                        '2px 4px 10px rgba(0,0,0,0.2), 0 1px 3px rgba(0,0,0,0.1)',
                    }}
                  >
                    <p className="text-xs text-gray-700 mb-2 whitespace-pre-line leading-relaxed line-clamp-5">
                      {memo.content}
                    </p>
                    {memo.page_number && (
                      <p className="text-xs text-gray-400 mb-1">
                        p.{memo.page_number}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 font-medium truncate border-t border-yellow-200 pt-1 mt-2">
                      {memo.user_books.books.title}
                    </p>
                    {memo.memo_tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {memo.memo_tags.map((mt) => (
                          <span
                            key={mt.tags.id}
                            className="text-xs px-1.5 py-0.5 rounded-full text-white"
                            style={{ backgroundColor: mt.tags.color }}
                          >
                            {mt.tags.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
