import { Star } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

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

export default function ImportantMemoList({ memos }: Props) {
  const [filter, setFilter] = useState('');
  const [tagFilter, setTagFilter] = useState<string | null>(null);

  const allTags = Array.from(
    new Map(
      memos
        .flatMap((m) => m.memo_tags.map((mt) => mt.tags))
        .map((t) => [t.id, t])
    ).values()
  );

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
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      <div className="space-y-3">
        {filteredMemos.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">
            該当する重要メモがありません
          </p>
        ) : (
          filteredMemos.map((memo) => (
            <Link
              key={memo.id}
              href={`/books/${memo.user_books.id}`}
              className="block bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <Star
                  size={14}
                  className="text-yellow-500 shrink-0 mt-0.5"
                  fill="currentColor"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 mb-1">{memo.content}</p>
                  {memo.page_number && (
                    <p className="text-xs text-gray-400 mb-1">
                      p.{memo.page_number}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    {memo.user_books.books.title}
                  </p>
                  {memo.memo_tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {memo.memo_tags.map((mt) => (
                        <span
                          key={mt.tags.id}
                          className="text-xs px-2 py-0.5 rounded-full text-white"
                          style={{ backgroundColor: mt.tags.color }}
                        >
                          {mt.tags.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
