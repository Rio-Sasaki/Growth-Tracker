'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';

const validatePassword = (password: string): string => {
  if (password.length < 8) return 'パスワードは8文字以上で入力してください';
  if (!/[a-z]/.test(password))
    return 'パスワードに小文字を1文字以上含めてください';
  if (!/[A-Z]/.test(password))
    return 'パスワードに大文字を1文字以上含めてください';
  if (!/[0-9]/.test(password))
    return 'パスワードに数字を1文字以上含めてください';
  return '';
};

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  const handleSignUp = async () => {
    const pwError = validatePassword(password);
    if (pwError) {
      setPasswordError(pwError);
      return;
    }

    setLoading(true);
    setError('');

    const supabase = createClient();

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(
        '登録は完了しましたが、ログインに失敗しました。ログイン画面からログインしてください。'
      );
      setLoading(false);
      return;
    }

    router.push('/dashboard');
  };

  const isValid = !passwordError && password.length > 0 && email.length > 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">新規登録</h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            メールアドレス
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="example@email.com"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            パスワード
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
              passwordError
                ? 'border-red-400 focus:ring-red-400'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="8文字以上・大文字・小文字・数字を含む"
          />
          {passwordError && (
            <p className="text-red-500 text-xs mt-1">{passwordError}</p>
          )}
          {!passwordError && password.length > 0 && (
            <p className="text-green-500 text-xs mt-1">
              ✓ パスワードの条件を満たしています
            </p>
          )}
        </div>

        <button
          onClick={handleSignUp}
          disabled={loading || !isValid}
          className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '登録中...' : '新規登録'}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          すでにアカウントをお持ちの方は
          <a href="/login" className="text-blue-600 hover:underline ml-1">
            ログイン
          </a>
        </p>
      </div>
    </div>
  );
}
