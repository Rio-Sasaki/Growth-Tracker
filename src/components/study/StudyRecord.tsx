import { Pencil, Trash2 } from 'lucide-react';
import IconButton from '@/components/ui/IconButton';
import { StudyRecord } from '@/hooks/useStudy';

type Props = {
  record: StudyRecord;
  onEditStart: (record: StudyRecord) => void;
  onDelete: (id: string) => void;
};

export default function StudyRecordCard({
  record,
  onEditStart,
  onDelete,
}: Props) {
  const startedAt = record.started_at ? new Date(record.started_at) : null;
  const endedAt = record.ended_at ? new Date(record.ended_at) : null;

  return (
    <div className="border border-gray-100 rounded-lg p-3 bg-gray-50">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
              {record.categories?.name ?? 'カテゴリなし'}
            </span>
            <span className="text-sm font-medium text-gray-800">
              {record.duration_minutes}分
            </span>
          </div>
          {startedAt && (
            <p className="text-xs text-gray-500">
              {startedAt.toLocaleDateString('ja-JP')}{' '}
              {startedAt.toLocaleTimeString('ja-JP', {
                hour: '2-digit',
                minute: '2-digit',
              })}
              {endedAt &&
                ` 〜 ${endedAt.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}`}
            </p>
          )}
          {record.note && (
            <p className="text-xs text-gray-500 mt-1">{record.note}</p>
          )}
          {!startedAt && (
            <p className="text-xs text-gray-400 mt-1">
              {new Date(record.created_at).toLocaleDateString('ja-JP')}
            </p>
          )}
        </div>
        <div className="flex gap-1 shrink-0">
          <IconButton
            icon={Pencil}
            onClick={() => onEditStart(record)}
            variant="primary"
            size={14}
          />
          <IconButton
            icon={Trash2}
            onClick={() => {
              if (confirm('この学習記録を削除しますか？')) {
                onDelete(record.id);
              }
            }}
            variant="danger"
            size={14}
          />
        </div>
      </div>
    </div>
  );
}
