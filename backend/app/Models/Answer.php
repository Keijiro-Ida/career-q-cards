<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Answer extends Model
{
    protected $fillable = [
        'user_id',
        'question_id',
        'content',
        'gpt_feedback',
        'answered_date',
    ];

    protected $casts = [
        'answered_date' => 'date',
    ];

    /**
     * この回答を投稿したユーザー
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * この回答の質問
     */
    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }

    /**
     * 特定のユーザーの回答のみを取得するスコープ
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * 特定の日付の回答のみを取得するスコープ
     */
    public function scopeForDate($query, $date)
    {
        return $query->where('answered_date', $date);
    }

    /**
     * GPTフィードバックがある回答のみを取得するスコープ
     */
    public function scopeWithFeedback($query)
    {
        return $query->whereNotNull('gpt_feedback');
    }

    /**
     * 日付の降順で取得するスコープ
     */
    public function scopeLatest($query)
    {
        return $query->orderBy('answered_date', 'desc');
    }

    /**
     * ユーザーが今日その質問に既に回答しているかチェック
     */
    public static function hasAnsweredToday($userId, $questionId, $date = null)
    {
        $date = $date ?? now()->format('Y-m-d');
        
        return static::where('user_id', $userId)
            ->where('question_id', $questionId)
            ->where('answered_date', $date)
            ->exists();
    }
}
