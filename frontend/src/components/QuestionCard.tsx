import { type Question, type Answer } from '@/lib/api';

interface QuestionCardProps {
  question: Question;
  hasAnswered: boolean;
  userAnswer?: Answer;
}

export default function QuestionCard({ question, hasAnswered }: QuestionCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="inline-block bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full">
          {question.category}
        </span>
        <span className="text-sm text-gray-500">
          {new Date().toLocaleDateString('ja-JP', { 
            month: 'long', 
            day: 'numeric' 
          })}の質問
        </span>
      </div>
      
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {question.content}
      </h2>
      
      {hasAnswered ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-green-600 text-lg mr-2">✅</span>
            <span className="text-green-800 font-medium">回答済み</span>
          </div>
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-blue-600 text-lg mr-2">💭</span>
            <span className="text-blue-800">100文字以内で答えてみましょう</span>
          </div>
        </div>
      )}
    </div>
  );
}