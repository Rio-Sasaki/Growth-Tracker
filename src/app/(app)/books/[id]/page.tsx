'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import BookInfo from '@/components/books/BookInfo';
import ReadingStatus from '@/components/books/ReadingStatus';
import TagManager, { Tag } from '@/components/books/TagManager';
import MemoList, { Memo } from '@/components/books/MemoList';

type UserBook = {
  id: string;
  status: number;
  is_favorite: boolean;
  started_at: string | null;
  finished_at: string | null;
  progress_page: number | null;
  books: {
    title: string;
    author: string | null;
    thumbnail_url: string | null;
  };
};

export default function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [userBook, setUserBook] = useState<UserBook | null>(null);
  const [status, setStatus] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [startedAt, setStartedAt] = useState('');
  const [finishedAt, setFinishedAt] = useState('');
  const [progressPage, setProgressPage] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [tags, setTags] = useState<Tag[]>([]);
  const [memos, setMemos] = useState<Memo[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [ubRes, memoRes, tagRes] = await Promise.all([
        fetch(`/api/user-books/${id}`),
        fetch(`/api/user-books/${id}/memos`),
        fetch(`/api/user-books/${id}/tags`),
      ]);

      const ubData = await ubRes.json();
      const memoData = await memoRes.json();
      const tagData = await tagRes.json();

      if (ubData.userBook) {
        const ub = ubData.userBook;
        setUserBook(ub);
        setStatus(ub.status);
        setIsFavorite(ub.is_favorite);
        setStartedAt(ub.started_at ? ub.started_at.split('T')[0] : '');
        setFinishedAt(ub.finished_at ? ub.finished_at.split('T')[0] : '');
        setProgressPage(ub.progress_page?.toString() ?? '');
      }

      setMemos(memoData.memos ?? []);
      setTags(tagData.tags ?? []);
    };

    fetchData();
  }, [id]);

  const refreshMemos = async () => {
    const memoRes = await fetch(`/api/user-books/${id}/memos`);
    const memoData = await memoRes.json();
    setMemos(memoData.memos ?? []);
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');

    await fetch(`/api/user-books/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status,
        isFavorite,
        startedAt,
        finishedAt,
        progressPage,
      }),
    });

    setMessage('保存しました');
    setLoading(false);
  };

  const handleDelete = async () => {
    await fetch(`/api/user-books/${id}`, {
      method: 'DELETE',
    });
    router.push('/books');
  };

  const handleToggleFavorite = async () => {
    const newFavorite = !isFavorite;
    setIsFavorite(newFavorite);

    await fetch(`/api/user-books/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isFavorite: newFavorite }),
    });
  };

  const handleAddMemo = async (
    content: string,
    pageNumber: string,
    tagIds: string[]
  ) => {
    if (!content.trim()) return;

    const res = await fetch(`/api/user-books/${id}/memos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, pageNumber }),
    });

    const data = await res.json();
    if (data.memo) {
      await Promise.all(
        tagIds.map((tagId) =>
          fetch('/api/memo-tags', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ memoId: data.memo.id, tagId }),
          })
        )
      );
      await refreshMemos();
    }
  };

  const handleDeleteMemo = async (memoId: string) => {
    await fetch(`/api/user-books/${id}/memos`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memoId }),
    });
    await refreshMemos();
  };

  const handleToggleImportant = async (memo: Memo) => {
    await fetch(`/api/user-books/${id}/memos`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        memoId: memo.id,
        isImportant: !memo.is_important,
      }),
    });
    await refreshMemos();
  };

  const handleEditMemo = async (memoId: string, content: string) => {
    await fetch(`/api/user-books/${id}/memos`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memoId, content }),
    });
    await refreshMemos();
  };

  const handleToggleTag = async (memoId: string, tagId: string) => {
    const memo = memos.find((m) => m.id === memoId);
    if (!memo) return;

    const hasTag = memo.memo_tags.some((mt) => mt.tags.id === tagId);

    if (hasTag) {
      await fetch('/api/memo-tags', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memoId, tagId }),
      });
    } else {
      await fetch('/api/memo-tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memoId, tagId }),
      });
    }
    await refreshMemos();
  };

  const handleAddTag = async (name: string, color: string) => {
    const res = await fetch(`/api/user-books/${id}/tags`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, color }),
    });

    const data = await res.json();
    if (data.tag) {
      setTags([...tags, data.tag]);
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    await fetch(`/api/user-books/${id}/tags`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tagId }),
    });
    setTags(tags.filter((t) => t.id !== tagId));
    setMemos(
      memos.map((m) => ({
        ...m,
        memo_tags: m.memo_tags.filter((mt) => mt.tags.id !== tagId),
      }))
    );
  };

  if (!userBook) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <p className="text-gray-500 text-sm">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <BookInfo
        title={userBook.books.title}
        author={userBook.books.author}
        thumbnailUrl={userBook.books.thumbnail_url}
        isFavorite={isFavorite}
        onToggleFavorite={handleToggleFavorite}
      />

      <ReadingStatus
        status={status}
        startedAt={startedAt}
        finishedAt={finishedAt}
        progressPage={progressPage}
        loading={loading}
        message={message}
        onStatusChange={setStatus}
        onStartedAtChange={setStartedAt}
        onFinishedAtChange={setFinishedAt}
        onProgressPageChange={setProgressPage}
        onSave={handleSave}
        onDelete={handleDelete}
      />

      <TagManager
        tags={tags}
        onAddTag={handleAddTag}
        onDeleteTag={handleDeleteTag}
      />

      <MemoList
        memos={memos}
        tags={tags}
        onAddMemo={handleAddMemo}
        onDeleteMemo={handleDeleteMemo}
        onToggleImportant={handleToggleImportant}
        onEditMemo={handleEditMemo}
        onToggleTag={handleToggleTag}
      />
    </div>
  );
}
