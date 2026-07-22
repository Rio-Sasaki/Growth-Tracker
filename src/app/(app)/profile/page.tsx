'use client';

import { User, Pencil, X } from 'lucide-react';
import Image from 'next/image';
import Toast from '@/components/ui/Toast';
import { useProfile } from '@/hooks/useProfile';

export default function ProfilePage() {
  const {
    displayName,
    setDisplayName,
    accountName,
    setAccountName,
    bio,
    setBio,
    avatarUrl,
    loading,
    uploading,
    deleting,
    fetching,
    toast,
    setToast,
    error,
    accountNameError,
    isAccountNameAvailable,
    fileInputRef,
    handleSave,
    handleAvatarClick,
    handleFileChange,
    handleDeleteAvatar,
  } = useProfile();

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

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* アバター */}
      <div className="flex flex-col items-center gap-2 mb-8">
        <div className="relative group">
          <div
            className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden cursor-pointer"
            onClick={handleAvatarClick}
          >
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="アバター"
                width={80}
                height={80}
                className="object-cover w-full h-full"
                loading="eager"
              />
            ) : (
              <User size={36} className="text-gray-400" />
            )}
          </div>
          <div
            className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            onClick={handleAvatarClick}
          >
            <Pencil size={18} className="text-white" />
          </div>
          {avatarUrl && (
            <button
              onClick={handleDeleteAvatar}
              disabled={deleting}
              className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 disabled:opacity-50"
            >
              <X size={12} className="text-white" />
            </button>
          )}
        </div>
        {uploading && (
          <p className="text-xs text-gray-500">アップロード中...</p>
        )}
        {deleting && <p className="text-xs text-gray-500">削除中...</p>}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

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
            onChange={(e) => {
              setAccountName(e.target.value);
              setToast(null);
            }}
            className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
              accountNameError
                ? 'border-red-400 focus:ring-red-400'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="account_name"
          />
          {accountNameError && (
            <p className="text-red-500 text-xs mt-1">{accountNameError}</p>
          )}
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
          disabled={loading || !isAccountNameAvailable}
          className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '保存中...' : '保存する'}
        </button>
      </div>
    </div>
  );
}
