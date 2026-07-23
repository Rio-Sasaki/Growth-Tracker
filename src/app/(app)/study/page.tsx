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
    tab,
    setTab,
    manualDate,
    setManualDate,
    manualStartTime,
    setManualStartTime,
    manualEndTime,
    setManualEndTime,
    manualDuration,
    editingRecord,
    setEditingRecord,
    loading,
    filterCategoryId,
    setFilterCategoryId,
    filterDateFrom,
    setFilterDateFrom,
    filterDateTo,
    setFilterDateTo,
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
        {(['timer', 'manual', 'records'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              tab === t
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'timer'
              ? 'タイマー'
              : t === 'manual'
                ? '手動入力'
                : '学習記録'}
          </button>
        ))}
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
                value={categoryId || categories[0]?.id || ''}
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
                value={categoryId || categories[0]?.id || ''}
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
                日付
              </label>
              <input
                type="date"
                value={manualDate}
                onChange={(e) => setManualDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  開始時刻
                </label>
                <input
                  type="time"
                  value={manualStartTime}
                  onChange={(e) => setManualStartTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  終了時刻
                </label>
                <input
                  type="time"
                  value={manualEndTime}
                  onChange={(e) => setManualEndTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {manualDuration !== null && (
              <p className="text-sm text-blue-600 font-medium">
                学習時間：{manualDuration}分
              </p>
            )}
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
              disabled={!manualDuration || manualDuration <= 0 || loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              <Plus size={16} />
              記録する
            </button>
          </div>
        </div>
      )}

      {/* 学習記録タブ */}
      {tab === 'records' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {/* カテゴリフィルター */}
          <div className="flex flex-wrap gap-2 mb-3">
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

          {/* 日付範囲フィルター */}
          <div className="flex gap-2 mb-4">
            <div className="flex-1">
              <input
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="開始日"
              />
            </div>
            <span className="flex items-center text-gray-400 text-sm">〜</span>
            <div className="flex-1">
              <input
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="終了日"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredRecords.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">
                学習記録がありません
              </p>
            ) : (
              filteredRecords.map((record) =>
                editingRecord?.id === record.id ? (
                  <div
                    key={record.id}
                    className="border border-gray-100 rounded-lg p-3 bg-gray-50 space-y-2"
                  >
                    <select
                      value={editingRecord.categoryId}
                      onChange={(e) =>
                        setEditingRecord({
                          ...editingRecord,
                          categoryId: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="date"
                      value={editingRecord.date}
                      onChange={(e) =>
                        setEditingRecord({
                          ...editingRecord,
                          date: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex gap-2">
                      <input
                        type="time"
                        value={editingRecord.startTime}
                        onChange={(e) =>
                          setEditingRecord({
                            ...editingRecord,
                            startTime: e.target.value,
                          })
                        }
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="time"
                        value={editingRecord.endTime}
                        onChange={(e) =>
                          setEditingRecord({
                            ...editingRecord,
                            endTime: e.target.value,
                          })
                        }
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <input
                      type="text"
                      value={editingRecord.note}
                      onChange={(e) =>
                        setEditingRecord({
                          ...editingRecord,
                          note: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="メモ"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleEditSave}
                        disabled={loading}
                        className="text-xs bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        保存
                      </button>
                      <button
                        onClick={() => setEditingRecord(null)}
                        className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-md hover:bg-gray-300"
                      >
                        キャンセル
                      </button>
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
      )}
    </div>
  );
}
