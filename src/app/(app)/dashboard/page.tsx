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

const studyData = [
  { day: '月', minutes: 60 },
  { day: '火', minutes: 90 },
  { day: '水', minutes: 45 },
  { day: '木', minutes: 120 },
  { day: '金', minutes: 30 },
  { day: '土', minutes: 150 },
  { day: '日', minutes: 80 },
];

const categoryData = [
  { category: 'プログラミング', minutes: 300 },
  { category: '読書', minutes: 180 },
  { category: '資格', minutes: 120 },
  { category: 'その他', minutes: 60 },
];

export default function DashboardPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">ホーム</h1>

      {/* サマリーカード */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">今月の学習時間</p>
          <p className="text-2xl font-bold text-blue-600">11h</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">今月の読書冊数</p>
          <p className="text-2xl font-bold text-blue-600">3冊</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">連続学習日数</p>
          <p className="text-2xl font-bold text-green-500">7日🔥</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">総学習時間</p>
          <p className="text-2xl font-bold text-blue-600">48h</p>
        </div>
      </div>

      {/* 日別学習時間グラフ */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="text-base font-semibold text-gray-700 mb-4">
          今週の学習時間
        </h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={studyData} tabIndex={-1}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} unit="分" />
            <Tooltip formatter={(value) => [`${value}分`, '学習時間']} />
            <Bar dataKey="minutes" fill="#3B82F6" radius={[4, 4, 0, 0]}>
              <LabelList dataKey="minutes" position="top" fontSize={11} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* カテゴリ別学習時間グラフ */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h2 className="text-base font-semibold text-gray-700 mb-4">
          カテゴリ別学習時間
        </h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={categoryData} layout="vertical" tabIndex={-1}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" tick={{ fontSize: 12 }} unit="分" />
            <YAxis
              type="category"
              dataKey="category"
              tick={{ fontSize: 12 }}
              width={80}
            />
            <Tooltip formatter={(value) => [`${value}分`, '学習時間']} />
            <Bar dataKey="minutes" fill="#10B981" radius={[0, 4, 4, 0]}>
              <LabelList dataKey="minutes" position="right" fontSize={11} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
