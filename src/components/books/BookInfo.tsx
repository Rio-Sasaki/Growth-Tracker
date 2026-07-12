import { Heart, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  title: string;
  author: string | null;
  thumbnailUrl: string | null;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

export default function BookInfo({
  title,
  author,
  thumbnailUrl,
  isFavorite,
  onToggleFavorite,
}: Props) {
  return (
    <div className="mb-6">
      <Link
        href="/books"
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-4"
      >
        <ChevronLeft size={16} />
        本棚に戻る
      </Link>
      <div className="flex gap-4">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={title}
            width={96}
            height={128}
            className="object-cover rounded shrink-0"
          />
        ) : (
          <div className="w-24 h-32 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400 shrink-0">
            No Image
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-800 mb-1">{title}</h1>
          <p className="text-sm text-gray-500 mb-3">{author ?? '著者不明'}</p>
          <button
            onClick={onToggleFavorite}
            className={`flex items-center gap-1 text-sm ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}
          >
            <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
            {isFavorite ? 'お気に入り済み' : 'お気に入りに追加'}
          </button>
        </div>
      </div>
    </div>
  );
}
