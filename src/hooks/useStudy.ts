import { useState, useEffect, useRef, useMemo } from 'react';

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
  started_at: string | null;
  ended_at: string | null;
};

export type EditingRecord = {
  id: string;
  categoryId: string;
  date: string;
  startTime: string;
  endTime: string;
  note: string;
};

type ToastState = {
  message: string;
  type: 'success' | 'error';
} | null;

export function useStudy() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [timerStartedAt, setTimerStartedAt] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [note, setNote] = useState('');
  const [tab, setTab] = useState<'timer' | 'manual' | 'records'>('timer');
  const [toast, setToast] = useState<ToastState>(null);

  const [manualDate, setManualDate] = useState(
    () => new Date().toISOString().split('T')[0]
  );
  const [manualStartTime, setManualStartTime] = useState('');
  const [manualEndTime, setManualEndTime] = useState('');

  const manualDuration = useMemo(() => {
    if (!manualStartTime || !manualEndTime) return null;
    const start = new Date(`${manualDate}T${manualStartTime}`);
    const end = new Date(`${manualDate}T${manualEndTime}`);
    const diffMs = end.getTime() - start.getTime();
    return diffMs > 0 ? Math.ceil(diffMs / 60000) : null;
  }, [manualDate, manualStartTime, manualEndTime]);

  const [records, setRecords] = useState<StudyRecord[]>([]);
  const [editingRecord, setEditingRecord] = useState<EditingRecord | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [filterCategoryId, setFilterCategoryId] = useState<string | null>(null);
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const [catRes, studyRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/studies'),
      ]);
      const catData = await catRes.json();
      const studyData = await studyRes.json();
      const cats = catData.categories ?? [];
      setCategories(cats);
      if (cats.length > 0) {
        setCategoryId(cats[0].id);
      }
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

  const handleStart = () => {
    setTimerStartedAt(new Date());
    setIsRunning(true);
  };

  const handleStop = () => setIsRunning(false);

  const handleReset = () => {
    setIsRunning(false);
    setElapsed(0);
    setTimerStartedAt(null);
  };

  const handleSaveTimer = async () => {
    if (elapsed === 0) return;
    setLoading(true);

    const endedAt = new Date();
    const startedAt =
      timerStartedAt ?? new Date(endedAt.getTime() - elapsed * 1000);
    const minutes = Math.ceil(elapsed / 60);

    const res = await fetch('/api/studies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        categoryId,
        durationMinutes: minutes,
        note,
        startedAt: startedAt.toISOString(),
        endedAt: endedAt.toISOString(),
      }),
    });
    const data = await res.json();
    if (data.study) {
      setRecords([data.study, ...records]);
    }
    setNote('');
    setToast({ message: '学習を記録しました', type: 'success' });
    setTimeout(() => setToast(null), 3000);
    setLoading(false);
    handleReset();
  };

  const handleSaveManual = async () => {
    if (!manualDuration || manualDuration <= 0) return;
    setLoading(true);

    const startedAt = new Date(`${manualDate}T${manualStartTime}`);
    const endedAt = new Date(`${manualDate}T${manualEndTime}`);

    const res = await fetch('/api/studies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        categoryId,
        durationMinutes: manualDuration,
        note,
        startedAt: startedAt.toISOString(),
        endedAt: endedAt.toISOString(),
      }),
    });
    const data = await res.json();
    if (data.study) {
      setRecords([data.study, ...records]);
    }
    setNote('');
    setManualStartTime('');
    setManualEndTime('');
    setToast({ message: '学習を記録しました', type: 'success' });
    setTimeout(() => setToast(null), 3000);
    setLoading(false);
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
    const startedAt = record.started_at ? new Date(record.started_at) : null;
    const endedAt = record.ended_at ? new Date(record.ended_at) : null;

    setEditingRecord({
      id: record.id,
      categoryId: record.category_id ?? categories[0]?.id ?? '',
      date: startedAt
        ? startedAt.toISOString().split('T')[0]
        : new Date(record.created_at).toISOString().split('T')[0],
      startTime: startedAt ? startedAt.toTimeString().slice(0, 5) : '',
      endTime: endedAt ? endedAt.toTimeString().slice(0, 5) : '',
      note: record.note ?? '',
    });
  };

  const handleEditSave = async () => {
    if (!editingRecord) return;
    setLoading(true);

    const startedAt = editingRecord.startTime
      ? new Date(`${editingRecord.date}T${editingRecord.startTime}`)
      : null;
    const endedAt = editingRecord.endTime
      ? new Date(`${editingRecord.date}T${editingRecord.endTime}`)
      : null;

    let durationMinutes = 0;
    if (startedAt && endedAt) {
      durationMinutes = Math.ceil(
        (endedAt.getTime() - startedAt.getTime()) / 60000
      );
    }

    const res = await fetch('/api/studies', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editingRecord.id,
        categoryId: editingRecord.categoryId,
        durationMinutes,
        note: editingRecord.note,
        startedAt: startedAt?.toISOString() ?? null,
        endedAt: endedAt?.toISOString() ?? null,
      }),
    });
    const data = await res.json();
    if (data.study) {
      setRecords(
        records.map((r) => (r.id === editingRecord.id ? data.study : r))
      );
    }
    setEditingRecord(null);
    setLoading(false);
  };

  const filteredRecords = records.filter((r) => {
    if (filterCategoryId && r.category_id !== filterCategoryId) return false;
    if (filterDateFrom) {
      const recordDate = r.started_at
        ? new Date(r.started_at).toISOString().split('T')[0]
        : new Date(r.created_at).toISOString().split('T')[0];
      if (recordDate < filterDateFrom) return false;
    }
    if (filterDateTo) {
      const recordDate = r.started_at
        ? new Date(r.started_at).toISOString().split('T')[0]
        : new Date(r.created_at).toISOString().split('T')[0];
      if (recordDate > filterDateTo) return false;
    }
    return true;
  });

  return {
    isRunning,
    elapsed,
    categories,
    categoryId,
    setCategoryId,
    note,
    setNote,
    tab,
    setTab,
    toast,
    setToast,
    manualDate,
    setManualDate,
    manualStartTime,
    setManualStartTime,
    manualEndTime,
    setManualEndTime,
    manualDuration,
    records,
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
  };
}
