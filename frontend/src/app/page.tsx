'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, type TodayQuestionResponse, getErrorMessage } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import AnswerForm from '@/components/AnswerForm';
import QuestionCard from '@/components/QuestionCard';

export default function Home() {
  const [questionData, setQuestionData] = useState<TodayQuestionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchTodaysQuestion();
  }, []);

  const fetchTodaysQuestion = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getTodaysQuestion();
      setQuestionData(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async (content: string) => {
    if (!questionData) return;

    try {
      await apiClient.submitAnswer(questionData.question.id, content);
      // 回答後、今日の質問データを再取得
      await fetchTodaysQuestion();
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  };

  // 認証中の場合はローディング表示
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  // 未認証の場合はログインページへリダイレクト
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            📝 キャリア Q カード
          </h1>
          <p className="text-gray-600 mb-6">
            毎日1つの質問に答えて、自分のキャリアを見つめ直しましょう
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              ログイン
            </button>
            <button
              onClick={() => router.push('/register')}
              className="w-full bg-white text-indigo-600 py-2 px-4 rounded-lg border border-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              新規登録
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">今日の質問を読み込み中...</p>
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
            onClick={fetchTodaysQuestion}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            再試行
          </button>
        </div>
      </div>
    );
  }

  if (!questionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">質問が見つかりません</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="text-center flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                📝 キャリア Q カード
              </h1>
              <p className="text-gray-600">
                毎日1つの質問に答えて、自分のキャリアを見つめ直そう
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                こんにちは、{user?.name}さん
              </span>
              <button
                onClick={logout}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                ログアウト
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto">
          {questionData && (
            <>
              <QuestionCard
                question={questionData.question}
                hasAnswered={questionData.has_answered}
                userAnswer={questionData.user_answer}
              />

              {!questionData.has_answered ? (
                <div className="mt-6">
                  <AnswerForm
                    questionId={questionData.question.id}
                    onSubmit={handleAnswerSubmit}
                  />
                </div>
              ) : questionData.user_answer && (
                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    ✅ 今日の回答
                  </h3>
                  <p className="text-gray-700">{questionData.user_answer.content}</p>

                  {questionData.user_answer.gpt_feedback && (
                    <div className="mt-4 bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium text-blue-800 mb-2">💡 フィードバック</h4>
                      <p className="text-blue-700">{questionData.user_answer.gpt_feedback}</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          <div className="mt-8 text-center">
            <a
              href="/history"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              📊 これまでの回答を見る →
            </a>
          </div>
        </main>
      </div>
    </div>
  );
}
