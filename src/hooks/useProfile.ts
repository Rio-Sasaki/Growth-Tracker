import { useState, useEffect, useRef } from 'react';

type ToastState = {
  message: string;
  type: 'success' | 'error';
} | null;

export function useProfile() {
  const [displayName, setDisplayName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const [error, setError] = useState('');
  const [accountNameError, setAccountNameError] = useState('');
  const [isAccountNameAvailable, setIsAccountNameAvailable] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch('/api/profile');
      const data = await res.json();
      if (data.profile) {
        setAccountName(data.profile.account_name ?? '');
        setDisplayName(data.profile.display_name ?? '');
        setBio(data.profile.bio ?? '');
        setAvatarUrl(data.profile.avatar_url ?? null);
      }
      setFetching(false);
      setInitialized(true);
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!initialized) return;

    if (!accountName.trim()) {
      const timer = setTimeout(() => {
        setAccountNameError('アカウント名を入力してください');
        setIsAccountNameAvailable(false);
      }, 0);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(async () => {
      const res = await fetch(
        `/api/check-account-name?name=${encodeURIComponent(accountName)}`
      );
      const data = await res.json();
      if (!data.available) {
        setAccountNameError('このアカウント名はすでに使用されています');
        setIsAccountNameAvailable(false);
      } else {
        setAccountNameError('');
        setIsAccountNameAvailable(true);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [accountName, initialized]);

  const handleSave = async () => {
    if (!isAccountNameAvailable) return;

    setLoading(true);
    setError('');

    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountName, displayName, bio }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? '保存に失敗しました');
      setLoading(false);
      return;
    }

    setToast({ message: 'プロフィールを保存しました', type: 'success' });
    setTimeout(() => setToast(null), 3000);
    setLoading(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/avatar', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? '画像のアップロードに失敗しました');
      setUploading(false);
      return;
    }

    setAvatarUrl(data.avatarUrl);
    setUploading(false);
  };

  const handleDeleteAvatar = async () => {
    setDeleting(true);
    setError('');

    const res = await fetch('/api/avatar', { method: 'DELETE' });

    if (!res.ok) {
      setError('画像の削除に失敗しました');
      setDeleting(false);
      return;
    }

    setAvatarUrl(null);
    setDeleting(false);
  };

  return {
    displayName,
    setDisplayName,
    accountName,
    setAccountName,
    bio,
    setBio,
    avatarUrl,
    loading,
    uploading,
    deleting,
    fetching,
    toast,
    setToast,
    error,
    accountNameError,
    isAccountNameAvailable,
    fileInputRef,
    handleSave,
    handleAvatarClick,
    handleFileChange,
    handleDeleteAvatar,
  };
}
