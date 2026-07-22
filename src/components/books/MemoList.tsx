'use client';

import { useState } from 'react';
import { Star, Trash2, Plus, Pencil } from 'lucide-react';
import { Tag } from './TagManager';

export type Memo = {
  id: string;
  content: string;
  is_important: boolean;
  page_number: number | null;
  memo_tags: { tags: Tag }[];
};

type Props = {
  memos: Memo[];
  tags: Tag[];
  onAddMemo: (
    content: string,
    pageNumber: string,
    tagIds: string[],
    isImportant: boolean
  ) => Promise<void>;
  onDeleteMemo: (memoId: string) => void;
  onToggleImportant: (memo: Memo) => void;
  onEditMemo: (memoId: string, content: string, pageNumber: string) => void;
  onToggleTag: (memoId: string, tagId: string) => void;
};

export default function MemoList({
  memos,
  tags,
  onAddMemo,
  onDeleteMemo,
  onToggleImportant,
  onEditMemo,
  onToggleTag,
}: Props) {
  const [filterTagId, setFilterTagId] = useState<string | null>(null);
  const [newContent, setNewContent] = useState('');
  const [newPageNumber, setNewPageNumber] = useState('');
  const [newIsImportant, setNewIsImportant] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editPageNumber, setEditPageNumber] = useState('');

  const handleEditStart = (memo: Memo) => {
    setEditingId(memo.id);
    setEditContent(memo.content);
    setEditPageNumber(memo.page_number?.toString() ?? '');
  };

  const handleEditSave = (memoId: string) => {
    onEditMemo(memoId, editContent, editPageNumber);
    setEditingId(null);
  };

  const filteredMemos = memos.filter(
    (m) => !filterTagId || m.memo_tags.some((mt) => mt.tags.id === filterTagId)
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-700">メモ</h2>
      </div>

      {/* タグフィルター */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilterTagId(null)}
          className={`text-xs px-3 py-1 rounded-full border ${
            !filterTagId
              ? 'bg-gray-800 text-white border-gray-800'
              : 'bg-white text-gray-500 border-gray-300'
          }`}
        >
          すべて
        </button>
        {tags.map((tag) => (
          <button
            key={tag.id}
            onClick={() =>
              setFilterTagId(filterTagId === tag.id ? null : tag.id)
            }
            className={`text-xs px-3 py-1 rounded-full border text-white ${
              filterTagId === tag.id ? 'opacity-100' : 'opacity-60'
            }`}
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
            onClick={() => setNewIsImportant(!newIsImportant)}
            className={`px-3 py-2 rounded-md border ${
              newIsImportant
                ? 'text-yellow-500 border-yellow-300 bg-yellow-50'
                : 'text-gray-300 border-gray-300'
            }`}
          >
            <Star size={16} fill={newIsImportant ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={async () => {
              const tagIds = filterTagId ? [filterTagId] : [];
              await onAddMemo(
                newContent,
                newPageNumber,
                tagIds,
                newIsImportant
              );
              setNewContent('');
              setNewPageNumber('');
              setNewIsImportant(false);
            }}
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
                  <input
                    type="number"
                    value={editPageNumber}
                    onChange={(e) => setEditPageNumber(e.target.value)}
                    className="w-28 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ページ番号"
                    min={0}
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
                      {memo.page_number && (
                        <p className="text-xs text-gray-400 mt-1">
                          p.{memo.page_number}
                        </p>
                      )}
                    </div>
                    <div className="flex items-start gap-1 shrink-0">
                      <button
                        onClick={() => onToggleImportant(memo)}
                        className={
                          memo.is_important
                            ? 'text-yellow-500'
                            : 'text-gray-300'
                        }
                      >
                        <Star
                          size={16}
                          fill={memo.is_important ? 'currentColor' : 'none'}
                        />
                      </button>
                      <button
                        onClick={() => handleEditStart(memo)}
                        className="text-gray-300 hover:text-blue-500"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('このメモを削除しますか？')) {
                            onDeleteMemo(memo.id);
                          }
                        }}
                        className="text-gray-300 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {tags.map((tag) => {
                      const hasTag = memo.memo_tags.some(
                        (mt) => mt.tags.id === tag.id
                      );
                      return (
                        <button
                          key={tag.id}
                          onClick={() => onToggleTag(memo.id, tag.id)}
                          className={`text-xs px-2 py-0.5 rounded-full border transition-opacity ${
                            hasTag ? 'text-white' : 'opacity-30'
                          }`}
                          style={{
                            backgroundColor: hasTag ? tag.color : 'transparent',
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
  );
}
