'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient, type AnswerHistoryResponse, type UserStats, getErrorMessage } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function HistoryPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [answersData, setAnswersData] = useState<AnswerHistoryResponse | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 回答履歴と統計情報を並行取得（統計情報の失敗は無視）
      const [answersResponse, statsResponse] = await Promise.allSettled([
        apiClient.getAnswerHistory(currentPage),
        apiClient.getUserStats()
      ]);

      // 回答履歴の取得結果を処理
      if (answersResponse.status === 'fulfilled') {
        setAnswersData(answersResponse.value);
      } else {
        throw new Error(getErrorMessage(answersResponse.reason));
      }

      // 統計情報の取得結果を処理（失敗しても続行）
      if (statsResponse.status === 'fulfilled') {
        setStats(statsResponse.value.stats);
      } else {
        console.warn('統計情報の取得に失敗しました:', statsResponse.reason);
        setStats(null);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // 認証チェック
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated) {
      fetchData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, isAuthenticated, authLoading, router]);

  // 認証がまだ確認中の場合
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">認証情報を確認中...</p>
        </div>
      </div>
    );
  }

  // 認証されていない場合（リダイレクト処理中）
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">ログインページに移動中...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">履歴を読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">エラーが発生しました</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors mr-4"
          >
            再試行
          </button>
          <Link
            href="/"
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            ホームに戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            📊 回答履歴
          </h1>
          <p className="text-gray-600">
            これまでの振り返りを確認しましょう
          </p>
        </header>

        {/* 統計情報 */}
        {stats && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-2xl font-bold text-indigo-600">{stats.total_answers}</div>
                <div className="text-gray-600">総回答数</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.streak_days}</div>
                <div className="text-gray-600">連続日数</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-2xl">
                  {stats.answered_today ? '✅' : '⏰'}
                </div>
                <div className="text-gray-600">
                  {stats.answered_today ? '今日は回答済み' : '今日はまだ未回答'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 回答一覧 */}
        <div className="max-w-4xl mx-auto">
          {answersData && answersData.answers.length > 0 ? (
            <div className="space-y-6">
              {answersData.answers.map((answer) => (
                <div key={answer.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-block bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full">
                      {answer.question?.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(answer.answered_date).toLocaleDateString('ja-JP')}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    {answer.question?.content}
                  </h3>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-gray-700">{answer.content}</p>
                  </div>

                  {answer.gpt_feedback && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium text-blue-800 mb-2">💡 フィードバック</h4>
                      <p className="text-blue-700">{answer.gpt_feedback}</p>
                    </div>
                  )}
                </div>
              ))}

              {/* ページネーション */}
              {answersData.pagination.total_pages > 1 && (
                <div className="flex justify-center space-x-2 mt-8">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    前へ
                  </button>

                  <span className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
                    {currentPage} / {answersData.pagination.total_pages}
                  </span>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(answersData.pagination.total_pages, prev + 1))}
                    disabled={currentPage === answersData.pagination.total_pages}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    次へ
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-gray-400 text-4xl mb-4">📝</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                まだ回答がありません
              </h3>
              <p className="text-gray-600 mb-4">
                今日の質問から始めてみましょう！
              </p>
              <Link
                href="/"
                className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                今日の質問に答える
              </Link>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            ← ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
