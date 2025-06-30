<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Answer;
use App\Models\Question;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    /**
     * 今日の質問を取得
     */
    public function today(Request $request): JsonResponse
    {
        $user = $request->user();
        $today = now()->format('Y-m-d');
        
        // 今日の質問を取得
        $question = Question::getTodaysQuestion($today);
        
        if (!$question) {
            return response()->json([
                'message' => '今日の質問が見つかりません'
            ], 404);
        }

        // ユーザーが今日この質問に既に回答しているかチェック
        $hasAnswered = false;
        $userAnswer = null;
        
        if ($user) {
            $hasAnswered = Answer::hasAnsweredToday($user->id, $question->id, $today);
            if ($hasAnswered) {
                $userAnswer = Answer::where('user_id', $user->id)
                    ->where('question_id', $question->id)
                    ->where('answered_date', $today)
                    ->first();
            }
        }

        return response()->json([
            'question' => [
                'id' => $question->id,
                'content' => $question->content,
                'category' => $question->category,
            ],
            'has_answered' => $hasAnswered,
            'user_answer' => $userAnswer ? [
                'id' => $userAnswer->id,
                'content' => $userAnswer->content,
                'gpt_feedback' => $userAnswer->gpt_feedback,
                'answered_date' => $userAnswer->answered_date->format('Y-m-d'),
            ] : null,
        ]);
    }

    /**
     * 質問一覧を取得（管理用・開発用）
     */
    public function index(Request $request): JsonResponse
    {
        $questions = Question::active()
            ->when($request->category, function ($query, $category) {
                return $query->byCategory($category);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($questions);
    }

    /**
     * 特定の質問を取得
     */
    public function show(Question $question): JsonResponse
    {
        if (!$question->is_active) {
            return response()->json([
                'message' => 'この質問は現在利用できません'
            ], 404);
        }

        return response()->json([
            'question' => [
                'id' => $question->id,
                'content' => $question->content,
                'category' => $question->category,
            ]
        ]);
    }
}
