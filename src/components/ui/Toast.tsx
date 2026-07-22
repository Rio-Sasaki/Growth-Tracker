'use client';

import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

type ToastType = 'success' | 'error';

type Props = {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
};

export default function Toast({
  message,
  type = 'success',
  onClose,
  duration = 3000,
}: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50">
      <div
        className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium ${
          type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}
      >
        {type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 hover:opacity-70">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
