'use client';

import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';

export default function ProfilePage() {
  const [displayName, setDisplayName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const res = await fetch('/api/profile');
      const data = await res.json();

      if (data.profile) {
        setAccountName(data.profile.account_name ?? '');
        setDisplayName(data.profile.display_name ?? '');
        setBio(data.profile.bio ?? '');
      }
      setFetching(false);
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountName, displayName, bio }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? '保存に失敗しました');
      setLoading(false);
      return;
    }

    setMessage('プロフィールを保存しました');
    setLoading(false);
  };

  if (fetching) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <p className="text-gray-500 text-sm">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">プロフィール</h1>

      {/* アバター */}
      <div className="flex flex-col items-center gap-2 mb-8">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
          <User size={36} className="text-gray-400" />
        </div>
        <button className="text-sm text-blue-600 hover:underline">
          画像を変更
        </button>
      </div>

      {message && <p className="text-green-600 text-sm mb-4">{message}</p>}
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {/* フォーム */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            アカウント名
          </label>
          <input
            type="text"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="account_name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            表示名
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="表示名"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            自己紹介
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="自己紹介を入力してください"
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
