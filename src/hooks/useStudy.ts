import { useState, useEffect, useRef } from 'react';

type Category = {
  id: string;
  name: string;
};

export type StudyRecord = {
  id: string;
  category_id: string | null;
  categories: Category | null;
  duration_minutes: number;
  note: string | null;
  created_at: string;
};

export function useStudy() {
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
  const [filterCategoryId, setFilterCategoryId] = useState<string | null>(null);

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

  const filteredRecords = filterCategoryId
    ? records.filter((r) => r.category_id === filterCategoryId)
    : records;

  return {
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
    records,
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
  };
}
