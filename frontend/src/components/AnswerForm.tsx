'use client';

import { useState } from 'react';

interface AnswerFormProps {
  onSubmit: (content: string) => Promise<void>;
  questionId: number;
}

export default function AnswerForm({ onSubmit }: AnswerFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (content.trim().length === 0) {
      setError('回答を入力してください');
      return;
    }

    if (content.length > 100) {
      setError('回答は100文字以内で入力してください');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit(content.trim());
      setContent('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '投稿に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const characterCount = content.length;
  const isOverLimit = characterCount > 100;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        💭 あなたの回答
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="今日の質問について、思うことを100文字以内で書いてみましょう..."
            className={`w-full p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 transition-colors ${
              isOverLimit 
                ? 'border-red-300 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-indigo-500'
            }`}
            rows={4}
            disabled={isSubmitting}
          />
          
          <div className="flex justify-between items-center mt-2">
            <div className="text-sm text-gray-500">
              思ったことを素直に書いてみましょう
            </div>
            <div className={`text-sm ${
              isOverLimit ? 'text-red-500' : 'text-gray-500'
            }`}>
              {characterCount}/100文字
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || content.trim().length === 0 || isOverLimit}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            isSubmitting || content.trim().length === 0 || isOverLimit
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              投稿中...
            </span>
          ) : (
            '回答を投稿'
          )}
        </button>
      </form>
    </div>
  );
}