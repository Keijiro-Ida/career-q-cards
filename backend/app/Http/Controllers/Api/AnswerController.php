<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Answer;
use App\Models\Question;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AnswerController extends Controller
{
    /**
     * 回答を投稿
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'message' => 'ログインが必要です'
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'question_id' => 'required|exists:questions,id',
            'content' => 'required|string|max:100',
        ], [
            'question_id.required' => '質問IDは必須です',
            'question_id.exists' => '指定された質問が存在しません',
            'content.required' => '回答内容は必須です',
            'content.max' => '回答は100文字以内で入力してください',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'バリデーションエラー',
                'errors' => $validator->errors()
            ], 422);
        }

        $questionId = $request->question_id;
        $content = $request->content;
        $today = now()->format('Y-m-d');

        // 質問が有効かチェック
        $question = Question::where('id', $questionId)->where('is_active', true)->first();
        if (!$question) {
            return response()->json([
                'message' => 'この質問は現在利用できません'
            ], 404);
        }

        // 既に今日回答済みかチェック
        if (Answer::hasAnsweredToday($user->id, $questionId, $today)) {
            return response()->json([
                'message' => '今日はすでにこの質問に回答済みです'
            ], 409);
        }

        // 回答を保存
        $answer = Answer::create([
            'user_id' => $user->id,
            'question_id' => $questionId,
            'content' => $content,
            'answered_date' => $today,
        ]);

        // TODO: GPTフィードバックを非同期で生成
        // $this->generateGptFeedback($answer);

        return response()->json([
            'message' => '回答を投稿しました',
            'answer' => [
                'id' => $answer->id,
                'content' => $answer->content,
                'answered_date' => $answer->answered_date->format('Y-m-d'),
                'gpt_feedback' => $answer->gpt_feedback,
            ]
        ], 201);
    }

    /**
     * ユーザーの回答履歴を取得
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'message' => 'ログインが必要です'
            ], 401);
        }

        $answers = Answer::where('user_id', $user->id)
            ->with('question:id,content,category')
            ->orderBy('answered_date', 'desc')
            ->paginate(20);

        return response()->json([
            'answers' => $answers->items(),
            'pagination' => [
                'current_page' => $answers->currentPage(),
                'total_pages' => $answers->lastPage(),
                'total_count' => $answers->total(),
                'per_page' => $answers->perPage(),
            ]
        ]);
    }

    /**
     * 特定の回答を取得
     */
    public function show(Request $request, Answer $answer): JsonResponse
    {
        $user = $request->user();
        
        if (!$user || $answer->user_id !== $user->id) {
            return response()->json([
                'message' => 'この回答にアクセスする権限がありません'
            ], 403);
        }

        $answer->load('question:id,content,category');

        return response()->json([
            'answer' => [
                'id' => $answer->id,
                'content' => $answer->content,
                'gpt_feedback' => $answer->gpt_feedback,
                'answered_date' => $answer->answered_date->format('Y-m-d'),
                'question' => [
                    'id' => $answer->question->id,
                    'content' => $answer->question->content,
                    'category' => $answer->question->category,
                ]
            ]
        ]);
    }

    /**
     * ユーザーの統計情報を取得
     */
    public function stats(Request $request): JsonResponse
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'message' => 'ログインが必要です'
            ], 401);
        }

        $totalAnswers = Answer::where('user_id', $user->id)->count();
        $streakDays = $user->getStreakDays();
        $todaysAnswer = $user->todaysAnswer();

        return response()->json([
            'stats' => [
                'total_answers' => $totalAnswers,
                'streak_days' => $streakDays,
                'answered_today' => $todaysAnswer !== null,
            ]
        ]);
    }

    /**
     * GPTフィードバックを生成（将来実装）
     */
    private function generateGptFeedback(Answer $answer): void
    {
        // TODO: OpenAI APIを使ってフィードバックを生成
        // Job::dispatch(new GenerateGptFeedbackJob($answer));
    }
}
