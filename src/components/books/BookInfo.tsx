import { Heart } from 'lucide-react';
import Image from 'next/image';

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
    <div className="flex gap-4 mb-6">
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
  );
}
