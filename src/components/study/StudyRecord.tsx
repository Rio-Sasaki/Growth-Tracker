import { Pencil, Trash2 } from 'lucide-react';

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
          <button
            onClick={() => onEditStart(record)}
            className="text-gray-400 hover:text-blue-600"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(record.id)}
            className="text-gray-400 hover:text-red-500"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
