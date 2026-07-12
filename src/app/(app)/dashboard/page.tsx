'use client';

import { useState, useEffect } from 'react';
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

type WeeklyData = {
  day: string;
  minutes: number;
};

type CategoryData = {
  category: string;
  minutes: number;
};

type DashboardData = {
  totalMinutesThisMonth: number;
  totalMinutesAll: number;
  booksThisMonth: number;
  streak: number;
  weeklyData: WeeklyData[];
  categoryData: CategoryData[];
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/dashboard');
      const json = await res.json();
      setData(json);
    };
    fetchData();
  }, []);

  const formatHours = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m}分`;
    if (m === 0) return `${h}h`;
    return `${h}h${m}分`;
  };

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
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">今月の学習時間</p>
          <p className="text-2xl font-bold text-blue-600">
            {formatHours(data.totalMinutesThisMonth)}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">今月の読書冊数</p>
          <p className="text-2xl font-bold text-blue-600">
            {data.booksThisMonth}冊
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">連続学習日数</p>
          <p className="text-2xl font-bold text-green-500">
            {data.streak}日{data.streak > 0 ? '🔥' : ''}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">総学習時間</p>
          <p className="text-2xl font-bold text-blue-600">
            {formatHours(data.totalMinutesAll)}
          </p>
        </div>
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
