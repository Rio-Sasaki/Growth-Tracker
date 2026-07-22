import { useState, useEffect } from 'react';

type WeeklyData = {
  day: string;
  minutes: number;
};

type CategoryData = {
  category: string;
  minutes: number;
};

export type DashboardData = {
  totalMinutesThisMonth: number;
  totalMinutesAll: number;
  booksThisMonth: number;
  streak: number;
  weeklyData: WeeklyData[];
  categoryData: CategoryData[];
};

export function useDashboard() {
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

  return { data, formatHours };
}
