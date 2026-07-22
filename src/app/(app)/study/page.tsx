'use client';

import { Play, Square, RotateCcw, Plus } from 'lucide-react';
import StudyRecordCard from '@/components/study/StudyRecord';
import { useStudy } from '@/hooks/useStudy';

export default function StudyPage() {
  const {
    isRunning,
    elapsed,
    categories,
    categoryId,
    setCategoryId,
    note,
    setNote,
    manualMinutes,
    setManualMinutes,
    tab,
    setTab,
    // records, ← 削除
    editingId,
    setEditingId,
    editNote,
    setEditNote,
    loading,
    filterCategoryId,
    setFilterCategoryId,
    filteredRecords,
    formatTime,
    handleStart,
    handleStop,
    handleReset,
    handleSaveTimer,
    handleSaveManual,
    handleDelete,
    handleEditStart,
    handleEditSave,
  } = useStudy();

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">学習</h1>

      {/* タブ */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setTab('timer')}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            tab === 'timer'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          タイマー
        </button>
        <button
          onClick={() => setTab('manual')}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            tab === 'manual'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          手動入力
        </button>
      </div>

      {/* タイマータブ */}
      {tab === 'timer' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="text-center mb-6">
            <p className="text-6xl font-mono font-bold text-gray-800 mb-4">
              {formatTime(elapsed)}
            </p>
            <div className="flex justify-center gap-3">
              {!isRunning ? (
                <button
                  onClick={handleStart}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  <Play size={16} />
                  開始
                </button>
              ) : (
                <button
                  onClick={handleStop}
                  className="flex items-center gap-2 bg-red-500 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-red-600"
                >
                  <Square size={16} />
                  停止
                </button>
              )}
              <button
                onClick={handleReset}
                className="flex items-center gap-2 bg-gray-200 text-gray-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300"
              >
                <RotateCcw size={16} />
                リセット
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                カテゴリ
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                メモ（任意）
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="学習内容のメモ"
              />
            </div>
            <button
              onClick={handleSaveTimer}
              disabled={elapsed === 0 || loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              <Plus size={16} />
              記録する
            </button>
          </div>
        </div>
      )}

      {/* 手動入力タブ */}
      {tab === 'manual' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                カテゴリ
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                学習時間（分）
              </label>
              <input
                type="number"
                value={manualMinutes}
                onChange={(e) => setManualMinutes(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例：60"
                min={1}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                メモ（任意）
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="学習内容のメモ"
              />
            </div>
            <button
              onClick={handleSaveManual}
              disabled={!manualMinutes || Number(manualMinutes) <= 0 || loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              <Plus size={16} />
              記録する
            </button>
          </div>
        </div>
      )}

      {/* 学習記録一覧 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-700">学習記録</h2>
        </div>

        {/* カテゴリフィルター */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setFilterCategoryId(null)}
            className={`text-xs px-3 py-1 rounded-full border ${
              !filterCategoryId
                ? 'bg-gray-800 text-white border-gray-800'
                : 'bg-white text-gray-500 border-gray-300'
            }`}
          >
            すべて
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() =>
                setFilterCategoryId(filterCategoryId === c.id ? null : c.id)
              }
              className={`text-xs px-3 py-1 rounded-full border ${
                filterCategoryId === c.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-500 border-gray-300'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredRecords.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              学習記録がありません
            </p>
          ) : (
            filteredRecords.map((record) =>
              editingId === record.id ? (
                <div
                  key={record.id}
                  className="border border-gray-100 rounded-lg p-3 bg-gray-50"
                >
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditSave(record.id)}
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
                </div>
              ) : (
                <StudyRecordCard
                  key={record.id}
                  record={record}
                  onEditStart={handleEditStart}
                  onDelete={handleDelete}
                />
              )
            )
          )}
        </div>
      </div>
    </div>
  );
}
