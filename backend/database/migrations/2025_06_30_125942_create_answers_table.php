<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('question_id')->constrained()->onDelete('cascade');
            $table->string('content', 100);
            $table->text('gpt_feedback')->nullable();
            $table->date('answered_date');
            $table->timestamps();

            // インデックス
            $table->index(['user_id', 'answered_date']);
            
            // 同じ質問に同じ日は1回のみ回答可能
            $table->unique(['user_id', 'question_id', 'answered_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('answers');
    }
};
