'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Square, RotateCcw, Plus } from 'lucide-react';
import StudyRecordCard, { StudyRecord } from '@/components/study/StudyRecord';

type Category = {
  id: string;
  name: string;
};

export default function StudyPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [note, setNote] = useState('');
  const [manualMinutes, setManualMinutes] = useState('');
  const [tab, setTab] = useState<'timer' | 'manual'>('timer');

  const [records, setRecords] = useState<StudyRecord[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNote, setEditNote] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [catRes, studyRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/studies'),
      ]);
      const catData = await catRes.json();
      const studyData = await studyRes.json();

      setCategories(catData.categories ?? []);
      setCategoryId(catData.categories?.[0]?.id ?? '');
      setRecords(studyData.studies ?? []);
    };
    fetchData();
  }, []);

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

  const saveStudy = async (durationMinutes: number) => {
    setLoading(true);
    const res = await fetch('/api/studies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoryId, durationMinutes, note }),
    });
    const data = await res.json();
    if (data.study) {
      setRecords([data.study, ...records]);
    }
    setNote('');
    setLoading(false);
  };

  const handleSaveTimer = async () => {
    if (elapsed === 0) return;
    const minutes = Math.ceil(elapsed / 60);
    await saveStudy(minutes);
    handleReset();
  };

  const handleSaveManual = async () => {
    if (!manualMinutes || Number(manualMinutes) <= 0) return;
    await saveStudy(Number(manualMinutes));
    setManualMinutes('');
  };

  const handleDelete = async (id: string) => {
    await fetch('/api/studies', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setRecords(records.filter((r) => r.id !== id));
  };

  const handleEditStart = (record: StudyRecord) => {
    setEditingId(record.id);
    setEditNote(record.note ?? '');
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
        <h2 className="text-base font-semibold text-gray-700 mb-4">学習記録</h2>
        <div className="space-y-3">
          {records.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              学習記録がありません
            </p>
          ) : (
            records.map((record) =>
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
