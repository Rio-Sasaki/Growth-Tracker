'use client';

import { useState } from 'react';
import { Heart, Star, Trash2, Plus, X } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 0, label: '未読' },
  { value: 1, label: '読書中' },
  { value: 2, label: '読了' },
];

type Tag = {
  id: string;
  name: string;
  color: string;
};

type Memo = {
  id: string;
  content: string;
  isImportant: boolean;
  pageNumber: string;
  tagIds: string[];
};

const TAG_COLORS = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#EC4899',
];

const dummyTags: Tag[] = [
  { id: '1', name: '重要', color: '#EF4444' },
  { id: '2', name: '復習', color: '#3B82F6' },
  { id: '3', name: '気づき', color: '#10B981' },
];

const dummyMemos: Memo[] = [
  {
    id: '1',
    content: '抽象化の重要性について',
    isImportant: true,
    pageNumber: '32',
    tagIds: ['1'],
  },
  {
    id: '2',
    content: '具体と抽象を行き来する思考法',
    isImportant: false,
    pageNumber: '56',
    tagIds: ['2', '3'],
  },
  {
    id: '3',
    content: 'ピラミッド構造で整理する',
    isImportant: true,
    pageNumber: '78',
    tagIds: [],
  },
];

export default function BookDetailPage() {
  const [status, setStatus] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [startedAt, setStartedAt] = useState('');
  const [finishedAt, setFinishedAt] = useState('');
  const [progressPage, setProgressPage] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [tags, setTags] = useState<Tag[]>(dummyTags);
  const [memos, setMemos] = useState<Memo[]>(dummyMemos);
  const [showImportantOnly, setShowImportantOnly] = useState(false);
  const [filterTagId, setFilterTagId] = useState<string | null>(null);
  const [newContent, setNewContent] = useState('');
  const [newPageNumber, setNewPageNumber] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0]);
  const [showTagForm, setShowTagForm] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    await new Promise((resolve) => setTimeout(resolve, 500));
    setMessage('保存しました');
    setLoading(false);
  };

  const handleAddMemo = () => {
    if (!newContent.trim()) return;
    const newMemo: Memo = {
      id: Date.now().toString(),
      content: newContent,
      isImportant: false,
      pageNumber: newPageNumber,
      tagIds: [],
    };
    setMemos([...memos, newMemo]);
    setNewContent('');
    setNewPageNumber('');
  };

  const handleDeleteMemo = (id: string) => {
    setMemos(memos.filter((m) => m.id !== id));
  };

  const handleToggleImportant = (id: string) => {
    setMemos(
      memos.map((m) =>
        m.id === id ? { ...m, isImportant: !m.isImportant } : m
      )
    );
  };

  const handleEditStart = (memo: Memo) => {
    setEditingId(memo.id);
    setEditContent(memo.content);
  };

  const handleEditSave = (id: string) => {
    setMemos(
      memos.map((m) => (m.id === id ? { ...m, content: editContent } : m))
    );
    setEditingId(null);
  };

  const handleToggleTag = (memoId: string, tagId: string) => {
    setMemos(
      memos.map((m) => {
        if (m.id !== memoId) return m;
        const hasTag = m.tagIds.includes(tagId);
        return {
          ...m,
          tagIds: hasTag
            ? m.tagIds.filter((t) => t !== tagId)
            : [...m.tagIds, tagId],
        };
      })
    );
  };

  const handleAddTag = () => {
    if (!newTagName.trim()) return;
    const newTag: Tag = {
      id: Date.now().toString(),
      name: newTagName,
      color: newTagColor,
    };
    setTags([...tags, newTag]);
    setNewTagName('');
    setShowTagForm(false);
  };

  const handleDeleteTag = (id: string) => {
    setTags(tags.filter((t) => t.id !== id));
    setMemos(
      memos.map((m) => ({ ...m, tagIds: m.tagIds.filter((t) => t !== id) }))
    );
  };

  const filteredMemos = memos
    .filter((m) => !showImportantOnly || m.isImportant)
    .filter((m) => !filterTagId || m.tagIds.includes(filterTagId));

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
            className={`flex items-center gap-1 text-sm ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}
          >
            <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
            {isFavorite ? 'お気に入り済み' : 'お気に入りに追加'}
          </button>
        </div>
      </div>

      {message && <p className="text-green-600 text-sm mb-4">{message}</p>}

      {/* 読書情報 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 mb-6">
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

      {/* タグ管理 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-700">タグ</h2>
          <button
            onClick={() => setShowTagForm(!showTagForm)}
            className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
          >
            <Plus size={12} />
            タグを追加
          </button>
        </div>

        {showTagForm && (
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="タグ名"
            />
            <div className="flex gap-1">
              {TAG_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setNewTagColor(color)}
                  className={`w-6 h-6 rounded-full border-2 ${newTagColor === color ? 'border-gray-800' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <button
              onClick={handleAddTag}
              className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-700"
            >
              追加
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center gap-1 px-2 py-1 rounded-full text-white text-xs"
              style={{ backgroundColor: tag.color }}
            >
              <span>{tag.name}</span>
              <button
                onClick={() => handleDeleteTag(tag.id)}
                className="hover:opacity-70"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* メモ */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-700">メモ</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowImportantOnly(!showImportantOnly)}
              className={`text-xs px-3 py-1 rounded-full border ${
                showImportantOnly
                  ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                  : 'bg-white text-gray-500 border-gray-300'
              }`}
            >
              重要のみ
            </button>
          </div>
        </div>

        {/* タグフィルター */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setFilterTagId(null)}
            className={`text-xs px-3 py-1 rounded-full border ${!filterTagId ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-500 border-gray-300'}`}
          >
            すべて
          </button>
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() =>
                setFilterTagId(filterTagId === tag.id ? null : tag.id)
              }
              className={`text-xs px-3 py-1 rounded-full border text-white ${filterTagId === tag.id ? 'opacity-100' : 'opacity-60'}`}
              style={{ backgroundColor: tag.color, borderColor: tag.color }}
            >
              {tag.name}
            </button>
          ))}
        </div>

        {/* メモ追加フォーム */}
        <div className="mb-4 space-y-2">
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            rows={2}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="メモを入力してください"
          />
          <div className="flex gap-2">
            <input
              type="number"
              value={newPageNumber}
              onChange={(e) => setNewPageNumber(e.target.value)}
              className="w-28 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ページ番号"
              min={0}
            />
            <button
              onClick={handleAddMemo}
              className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
            >
              <Plus size={14} />
              追加
            </button>
          </div>
        </div>

        {/* メモ一覧 */}
        <div className="space-y-3">
          {filteredMemos.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              メモがありません
            </p>
          ) : (
            filteredMemos.map((memo) => (
              <div
                key={memo.id}
                className="border border-gray-100 rounded-lg p-3 bg-gray-50"
              >
                {editingId === memo.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={2}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditSave(memo.id)}
                        className="text-xs bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                      >
                        保存
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-md hover:bg-gray-300"
                      >
                        キャンセル
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm text-gray-700 cursor-pointer hover:text-blue-600"
                          onClick={() => handleEditStart(memo)}
                        >
                          {memo.content}
                        </p>
                        {memo.pageNumber && (
                          <p className="text-xs text-gray-400 mt-1">
                            p.{memo.pageNumber}
                          </p>
                        )}
                      </div>
                      <div className="flex items-start gap-1 flex-shrink-0">
                        <button
                          onClick={() => handleToggleImportant(memo.id)}
                          className={
                            memo.isImportant
                              ? 'text-yellow-500'
                              : 'text-gray-300'
                          }
                        >
                          <Star
                            size={16}
                            fill={memo.isImportant ? 'currentColor' : 'none'}
                          />
                        </button>
                        <button
                          onClick={() => handleDeleteMemo(memo.id)}
                          className="text-gray-300 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    {/* タグ付け */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {tags.map((tag) => {
                        const hasTag = memo.tagIds.includes(tag.id);
                        return (
                          <button
                            key={tag.id}
                            onClick={() => handleToggleTag(memo.id, tag.id)}
                            className={`text-xs px-2 py-0.5 rounded-full border transition-opacity ${hasTag ? 'text-white' : 'opacity-30'}`}
                            style={{
                              backgroundColor: hasTag
                                ? tag.color
                                : 'transparent',
                              borderColor: tag.color,
                              color: hasTag ? 'white' : tag.color,
                            }}
                          >
                            {tag.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
