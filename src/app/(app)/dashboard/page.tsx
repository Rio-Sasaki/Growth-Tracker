'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import SummaryCard from '@/components/dashboard/SummaryCard';
import { useDashboard } from '@/hooks/useDashboard';

export default function DashboardPage() {
  const { data, formatHours } = useDashboard();

  if (!data) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <p className="text-gray-500 text-sm">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">ホーム</h1>

      {/* サマリーカード */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <SummaryCard
          label="今月の学習時間"
          value={formatHours(data.totalMinutesThisMonth)}
        />
        <SummaryCard
          label="今月の読書冊数"
          value={`${data.booksThisMonth}冊`}
        />
        <SummaryCard
          label="連続学習日数"
          value={`${data.streak}日${data.streak > 0 ? '🔥' : ''}`}
          color="green"
        />
        <SummaryCard
          label="総学習時間"
          value={formatHours(data.totalMinutesAll)}
        />
      </div>

      {/* 日別学習時間グラフ */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="text-base font-semibold text-gray-700 mb-4">
          今週の学習時間
        </h2>
        {data.weeklyData.every((d) => d.minutes === 0) ? (
          <p className="text-sm text-gray-400 text-center py-8">
            学習記録がありません
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={data.weeklyData}
              tabIndex={-1}
              margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} unit="分" />
              <Tooltip formatter={(value) => [`${value}分`, '学習時間']} />
              <Bar
                dataKey="minutes"
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
                stroke="#3B82F6"
                strokeWidth={1}
                style={{ outline: 'none' }}
              >
                <LabelList dataKey="minutes" position="top" fontSize={11} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* カテゴリ別学習時間グラフ */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h2 className="text-base font-semibold text-gray-700 mb-4">
          今月のカテゴリ別学習時間
        </h2>
        {data.categoryData.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">
            学習記録がありません
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={data.categoryData}
              layout="vertical"
              tabIndex={-1}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} unit="分" />
              <YAxis
                type="category"
                dataKey="category"
                tick={{ fontSize: 12 }}
                width={100}
              />
              <Tooltip formatter={(value) => [`${value}分`, '学習時間']} />
              <Bar
                dataKey="minutes"
                fill="#10B981"
                radius={[0, 4, 4, 0]}
                stroke="#10B981"
                strokeWidth={1}
                style={{ outline: 'none' }}
              >
                <LabelList dataKey="minutes" position="right" fontSize={11} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
