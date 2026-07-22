import { Pencil, Trash2 } from 'lucide-react';
import IconButton from '@/components/ui/IconButton';

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

          {record.note && (
            <p className="text-xs text-gray-500">{record.note}</p>
          )}

          <p className="text-xs text-gray-400 mt-1">
            {new Date(record.created_at).toLocaleDateString('ja-JP')}
          </p>
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
