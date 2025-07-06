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
        // ユニークな回答日を降順で取得
        $answerDates = $this->answers()
            ->orderBy('answered_date', 'desc')
            ->get()
            ->map(function ($answer) {
                return $answer->answered_date instanceof \Carbon\Carbon
                    ? $answer->answered_date->format('Y-m-d')
                    : $answer->answered_date;
            })
            ->unique()
            ->values()
            ->toArray();

        if (empty($answerDates)) {
            return 0;
        }

        $streak = 0;
        $today = now()->format('Y-m-d');
        $yesterday = now()->subDay()->format('Y-m-d');

        // 今日の回答があるかチェック
        $startDate = in_array($today, $answerDates) ? $today : $yesterday;

        // 開始日が今日でも昨日でもない場合、連続日数は0
        if (!in_array($startDate, $answerDates)) {
            return 0;
        }

        // 連続日数をカウント
        $currentDate = \Carbon\Carbon::parse($startDate);
        foreach ($answerDates as $answerDate) {
            if ($answerDate === $currentDate->format('Y-m-d')) {
                $streak++;
                $currentDate->subDay();
            } else if ($answerDate < $currentDate->format('Y-m-d')) {
                // 日付が飛んだら終了
                break;
            }
        }

        return $streak;
    }
}
