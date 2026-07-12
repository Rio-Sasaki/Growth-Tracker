const STATUS_OPTIONS = [
  { value: 0, label: '未読' },
  { value: 1, label: '読書中' },
  { value: 2, label: '読了' },
];

type Props = {
  status: number;
  startedAt: string;
  finishedAt: string;
  progressPage: string;
  loading: boolean;
  message: string;
  onStatusChange: (value: number) => void;
  onStartedAtChange: (value: string) => void;
  onFinishedAtChange: (value: string) => void;
  onProgressPageChange: (value: string) => void;
  onSave: () => void;
};

export default function ReadingStatus({
  status,
  startedAt,
  finishedAt,
  progressPage,
  loading,
  message,
  onStatusChange,
  onStartedAtChange,
  onFinishedAtChange,
  onProgressPageChange,
  onSave,
}: Props) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 mb-6">
      {message && <p className="text-green-600 text-sm">{message}</p>}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          読書ステータス
        </label>
        <div className="flex gap-2">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onStatusChange(option.value)}
              className={`flex-1 py-2 rounded-md text-sm font-medium border ${
                status === option.value
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          読書開始日
        </label>
        <input
          type="date"
          value={startedAt}
          onChange={(e) => onStartedAtChange(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          読書終了日
        </label>
        <input
          type="date"
          value={finishedAt}
          onChange={(e) => onFinishedAtChange(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          現在ページ
        </label>
        <input
          type="number"
          value={progressPage}
          onChange={(e) => onProgressPageChange(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="例：100"
          min={0}
        />
      </div>

      <button
        onClick={onSave}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? '保存中...' : '保存する'}
      </button>
    </div>
  );
}
