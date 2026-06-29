'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Square, RotateCcw, Plus, Pencil, Trash2 } from 'lucide-react';

type StudyRecord = {
  id: string;
  category: string;
  duration_minutes: number;
  note: string;
  created_at: string;
};

const CATEGORIES = ['プログラミング', '読書', '資格', 'その他'];

const dummyRecords: StudyRecord[] = [
  {
    id: '1',
    category: 'プログラミング',
    duration_minutes: 90,
    note: 'Next.jsの学習',
    created_at: '2026-06-20',
  },
  {
    id: '2',
    category: '読書',
    duration_minutes: 45,
    note: '具体と抽象を読んだ',
    created_at: '2026-06-19',
  },
  {
    id: '3',
    category: '資格',
    duration_minutes: 60,
    note: '過去問を解いた',
    created_at: '2026-06-18',
  },
];

export default function StudyPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [category, setCategory] = useState(CATEGORIES[0]);
  const [note, setNote] = useState('');
  const [manualMinutes, setManualMinutes] = useState('');
  const [tab, setTab] = useState<'timer' | 'manual'>('timer');

  const [records, setRecords] = useState<StudyRecord[]>(dummyRecords);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNote, setEditNote] = useState('');

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleStart = () => setIsRunning(true);
  const handleStop = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setElapsed(0);
  };

  const handleSaveTimer = () => {
    if (elapsed === 0) return;
    const minutes = Math.ceil(elapsed / 60);
    const newRecord: StudyRecord = {
      id: Date.now().toString(),
      category,
      duration_minutes: minutes,
      note,
      created_at: new Date().toISOString().split('T')[0],
    };
    setRecords([newRecord, ...records]);
    setNote('');
    handleReset();
  };

  const handleSaveManual = () => {
    if (!manualMinutes || Number(manualMinutes) <= 0) return;
    const newRecord: StudyRecord = {
      id: Date.now().toString(),
      category,
      duration_minutes: Number(manualMinutes),
      note,
      created_at: new Date().toISOString().split('T')[0],
    };
    setRecords([newRecord, ...records]);
    setNote('');
    setManualMinutes('');
  };

  const handleDelete = (id: string) => {
    setRecords(records.filter((r) => r.id !== id));
  };

  const handleEditStart = (record: StudyRecord) => {
    setEditingId(record.id);
    setEditNote(record.note);
  };

  const handleEditSave = (id: string) => {
    setRecords(
      records.map((r) => (r.id === id ? { ...r, note: editNote } : r))
    );
    setEditingId(null);
  };

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
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
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
              disabled={elapsed === 0}
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
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
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
              disabled={!manualMinutes || Number(manualMinutes) <= 0}
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
        <h2 className="text-base font-semibold text-gray-700 mb-4">学習記録</h2>
        <div className="space-y-3">
          {records.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              学習記録がありません
            </p>
          ) : (
            records.map((record) => (
              <div
                key={record.id}
                className="border border-gray-100 rounded-lg p-3 bg-gray-50"
              >
                {editingId === record.id ? (
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
                ) : (
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                          {record.category}
                        </span>
                        <span className="text-sm font-medium text-gray-800">
                          {record.duration_minutes}分
                        </span>
                      </div>
                      {record.note && (
                        <p className="text-xs text-gray-500">{record.note}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {record.created_at}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => handleEditStart(record)}
                        className="text-gray-400 hover:text-blue-600"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={14} />
                      </button>
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
