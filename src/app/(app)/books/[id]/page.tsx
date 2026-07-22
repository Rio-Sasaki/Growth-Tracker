'use client';

import { use } from 'react';
import BookInfo from '@/components/books/BookInfo';
import ReadingStatus from '@/components/books/ReadingStatus';
import TagManager from '@/components/books/TagManager';
import MemoList from '@/components/books/MemoList';
import Toast from '@/components/ui/Toast';
import { useBookDetail } from '@/hooks/useBookDetail';

export default function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const {
    userBook,
    status,
    setStatus,
    isFavorite,
    startedAt,
    setStartedAt,
    finishedAt,
    setFinishedAt,
    progressPage,
    setProgressPage,
    loading,
    toast,
    setToast,
    tags,
    memos,
    handleSave,
    handleDelete,
    handleToggleFavorite,
    handleAddMemo,
    handleDeleteMemo,
    handleToggleImportant,
    handleEditMemo,
    handleToggleTag,
    handleAddTag,
    handleDeleteTag,
  } = useBookDetail(id);

  if (!userBook) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <p className="text-gray-500 text-sm">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

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
