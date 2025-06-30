<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * このユーザーの回答一覧
     */
    public function answers(): HasMany
    {
        return $this->hasMany(Answer::class);
    }

    /**
     * このユーザーの最新の回答を取得
     */
    public function latestAnswers($limit = 10)
    {
        return $this->answers()
            ->with('question')
            ->orderBy('answered_date', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * 今日の回答を取得
     */
    public function todaysAnswer()
    {
        return $this->answers()
            ->with('question')
            ->where('answered_date', now()->format('Y-m-d'))
            ->first();
    }

    /**
     * 連続回答日数を取得
     */
    public function getStreakDays()
    {
        $answers = $this->answers()
            ->orderBy('answered_date', 'desc')
            ->pluck('answered_date')
            ->map(fn($date) => $date->format('Y-m-d'))
            ->unique()
            ->values();

        if ($answers->isEmpty()) {
            return 0;
        }

        $streak = 0;
        $currentDate = now()->format('Y-m-d');

        foreach ($answers as $answerDate) {
            if ($answerDate === $currentDate) {
                $streak++;
                $currentDate = now()->subDays($streak)->format('Y-m-d');
            } else {
                break;
            }
        }

        return $streak;
    }
}
