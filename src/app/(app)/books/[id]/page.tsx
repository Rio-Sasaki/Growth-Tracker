'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 0, label: '未読' },
  { value: 1, label: '読書中' },
  { value: 2, label: '読了' },
];

export default function BookDetailPage() {
  const [status, setStatus] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [startedAt, setStartedAt] = useState('');
  const [finishedAt, setFinishedAt] = useState('');
  const [progressPage, setProgressPage] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setLoading(true);
    setMessage('');

    // TODO: Prismaで読書情報を更新する処理を実装
    await new Promise((resolve) => setTimeout(resolve, 500));

    setMessage('保存しました');
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* 書籍情報（仮） */}
      <div className="flex gap-4 mb-6">
        <div className="w-24 h-32 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
          No Image
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-800 mb-1">書籍タイトル</h1>
          <p className="text-sm text-gray-500 mb-3">著者名</p>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`flex items-center gap-1 text-sm ${
              isFavorite ? 'text-red-500' : 'text-gray-400'
            }`}
          >
            <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
            {isFavorite ? 'お気に入り済み' : 'お気に入りに追加'}
          </button>
        </div>
      </div>

      {message && <p className="text-green-600 text-sm mb-4">{message}</p>}

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        {/* ステータス */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            読書ステータス
          </label>
          <div className="flex gap-2">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setStatus(option.value)}
                className={`flex-1 py-2 rounded-md text-sm font-medium border ${
                  status === option.value
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 読書開始日 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            読書開始日
          </label>
          <input
            type="date"
            value={startedAt}
            onChange={(e) => setStartedAt(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 読書終了日 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            読書終了日
          </label>
          <input
            type="date"
            value={finishedAt}
            onChange={(e) => setFinishedAt(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 現在ページ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            現在ページ
          </label>
          <input
            type="number"
            value={progressPage}
            onChange={(e) => setProgressPage(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="例：100"
            min={0}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? '保存中...' : '保存する'}
        </button>
      </div>
    </div>
  );
}
