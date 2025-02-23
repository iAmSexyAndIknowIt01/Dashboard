// app/login/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  // クライアントサイドでのマウント確認
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 状態の管理
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ログインボタンがクリックされたときの処理
  const handleLogin = (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    // 簡単なバリデーション
    if (email === "test@mail.com" && password === "1234") {
      setError("");
      router.push("/dashboard"); // 認証成功時に /dashboard に遷移
    } else {
      setError("メールアドレスまたはパスワードが正しくありません。");
    }
  };

  // クライアントサイドでのレンダリングが完了していない場合は、null を返してエラーを防ぐ
  if (!isMounted) {
    return null; // またはローディングスピナーを表示
  }

  return (
    <main className="flex min-h-screen flex-col p-6">      
      <div className="bg-grey-100 h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
          <h2 className="text-2xl font-semibold text-center mb-6">ログイン</h2>
          <form onSubmit={handleLogin}>
            {/* メールアドレス */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                メールアドレス
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="example@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* パスワード */}
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                パスワード
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* エラーメッセージ */}
            {error && (
              <div className="text-red-500 text-sm mb-4 text-center">
                {error}
              </div>
            )}

            {/* ログインボタン */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            >
              ログイン
            </button>

            {/* パスワードを忘れた場合 */}
            <div className="mt-4 text-center">
              <a
                href="#"
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                パスワードを忘れましたか？
              </a>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
