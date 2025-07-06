<?php

use App\Http\Controllers\Api\AnswerController;
use App\Http\Controllers\Api\QuestionController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Career Q-Cards API
Route::prefix('v1')->group(function () {

    // 認証関連（認証不要）
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // 今日の質問（認証不要でも閲覧可能）
    Route::get('/questions/today', [QuestionController::class, 'today']);

    // 質問関連（認証不要）
    Route::get('/questions', [QuestionController::class, 'index']);
    Route::get('/questions/{question}', [QuestionController::class, 'show']);

    // 認証が必要なルート
    Route::middleware('auth:sanctum')->group(function () {

        // 認証関連
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);

        // 回答関連
        Route::get('/answers/stats', [AnswerController::class, 'stats']);
        Route::post('/answers', [AnswerController::class, 'store']);
        Route::get('/answers', [AnswerController::class, 'index']);
        Route::get('/answers/{answer}', [AnswerController::class, 'show']);

    });
});
