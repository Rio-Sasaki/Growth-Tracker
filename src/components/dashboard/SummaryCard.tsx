type Props = {
  label: string;
  value: string;
  color?: 'blue' | 'green';
};

export default function SummaryCard({ label, value, color = 'blue' }: Props) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p
        className={`text-2xl font-bold ${color === 'green' ? 'text-green-500' : 'text-blue-600'}`}
      >
        {value}
      </p>
    </div>
  );
}
