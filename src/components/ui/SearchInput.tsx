import { Search } from 'lucide-react';

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  loading?: boolean;
  placeholder?: string;
};

export default function SearchInput({
  value,
  onChange,
  onSearch,
  loading = false,
  placeholder = '検索',
}: Props) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onSearch();
  };

  return (
    <div className="flex gap-2">
      <div className="flex-1 relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full border border-gray-300 rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder}
        />
      </div>
      <button
        onClick={onSearch}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? '検索中...' : '検索'}
      </button>
    </div>
  );
}
