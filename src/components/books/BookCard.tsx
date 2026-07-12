import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';

const STATUS_LABELS: Record<number, string> = {
  0: '未読',
  1: '読書中',
  2: '読了',
};

type Props = {
  id: string;
  title: string;
  author: string | null;
  thumbnailUrl: string | null;
  status: number;
  isFavorite: boolean;
};

export default function BookCard({
  id,
  title,
  author,
  thumbnailUrl,
  status,
  isFavorite,
}: Props) {
  return (
    <Link
      href={`/books/${id}`}
      className="bg-white border border-gray-200 rounded-lg p-4 flex gap-4 hover:bg-gray-50 transition-colors"
    >
      {thumbnailUrl ? (
        <Image
          src={thumbnailUrl}
          alt={title}
          width={64}
          height={80}
          className="object-cover rounded shrink-0"
        />
      ) : (
        <div className="w-16 h-20 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400 shrink-0">
          No Image
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-800 mb-1">{title}</h3>
        <p className="text-xs text-gray-500 mb-2">{author ?? '著者不明'}</p>
        <span
          className={`inline-block text-xs px-2 py-0.5 rounded-full ${
            status === 1
              ? 'bg-blue-100 text-blue-600'
              : status === 2
                ? 'bg-green-100 text-green-600'
                : 'bg-gray-100 text-gray-600'
          }`}
        >
          {STATUS_LABELS[status]}
        </span>
      </div>
      <div className="shrink-0 flex items-center">
        <Heart
          size={16}
          fill={isFavorite ? 'currentColor' : 'none'}
          className={isFavorite ? 'text-red-500' : 'text-gray-300'}
        />
      </div>
    </Link>
  );
}
