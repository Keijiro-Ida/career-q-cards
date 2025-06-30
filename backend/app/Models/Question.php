<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Question extends Model
{
    protected $fillable = [
        'content',
        'category',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * この質問に対する回答一覧
     */
    public function answers(): HasMany
    {
        return $this->hasMany(Answer::class);
    }

    /**
     * アクティブな質問のみを取得するスコープ
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * カテゴリで絞り込むスコープ
     */
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * ランダムで1つの質問を取得（日付ベースのシード使用）
     */
    public static function getTodaysQuestion($date = null)
    {
        $date = $date ?? now()->format('Y-m-d');
        $seed = crc32($date); // 同じ日は同じ質問
        
        return static::active()
            ->inRandomOrder($seed)
            ->first();
    }
}
