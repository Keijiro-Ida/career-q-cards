<?php

namespace Database\Seeders;

use App\Models\Question;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class QuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $questions = [
            // 仕事のやりがい・楽しさ
            [
                'content' => '最近の仕事で「これは楽しかった」と感じた瞬間は？',
                'category' => 'やりがい',
            ],
            [
                'content' => 'やりがいを感じるのはどういう時？',
                'category' => 'やりがい',
            ],
            [
                'content' => '今の仕事で時間を忘れて没頭できる作業は何？',
                'category' => 'やりがい',
            ],
            [
                'content' => '誰かに「ありがとう」と言われて嬉しかった仕事は？',
                'category' => 'やりがい',
            ],
            [
                'content' => '自分が成長したと実感できた最近の出来事は？',
                'category' => 'やりがい',
            ],

            // キャリアの悩み・モヤモヤ
            [
                'content' => '今のキャリアで一番モヤモヤしていることは？',
                'category' => '悩み',
            ],
            [
                'content' => '「このままでいいのかな」と不安に思う瞬間は？',
                'category' => '悩み',
            ],
            [
                'content' => '今の職場で「もっとこうだったらいいのに」と思うことは？',
                'category' => '悩み',
            ],
            [
                'content' => '転職を考えたことある？その理由は？',
                'category' => '悩み',
            ],
            [
                'content' => '仕事でストレスを感じる一番の原因は？',
                'category' => '悩み',
            ],

            // 将来への不安・希望
            [
                'content' => '3年後の自分が今の延長線上にいることについてどう思う？',
                'category' => '将来',
            ],
            [
                'content' => '理想のキャリアと現実のギャップで一番大きいのは？',
                'category' => '将来',
            ],
            [
                'content' => '年齢を重ねることで仕事面で不安に思うことはある？',
                'category' => '将来',
            ],
            [
                'content' => '「いつかやりたい」と思ってるけど踏み出せないことは？',
                'category' => '将来',
            ],
            [
                'content' => '今のスキルセットで10年後も通用すると思う？',
                'category' => '将来',
            ],

            // 現状の課題・改善点
            [
                'content' => '今の仕事で「もっと上手くできたらいいのに」と思うことは？',
                'category' => '課題',
            ],
            [
                'content' => '同僚と比べて劣ってると感じる部分はある？',
                'category' => '課題',
            ],
            [
                'content' => '仕事の効率が悪いと感じる瞬間は？',
                'category' => '課題',
            ],
            [
                'content' => '上司や同僚とのコミュニケーションで困ってることは？',
                'category' => '課題',
            ],
            [
                'content' => '今の働き方で改善したい一番のポイントは？',
                'category' => '課題',
            ],

            // 価値観の見直し
            [
                'content' => '仕事とプライベートのバランスについて今どう感じてる？',
                'category' => '価値観',
            ],
            [
                'content' => '給与・やりがい・時間の自由さ、どれを一番重視したい？',
                'category' => '価値観',
            ],
            [
                'content' => '「働く意味」について最近考えることある？',
                'category' => '価値観',
            ],
            [
                'content' => '今の会社にいる理由を3つ挙げるとしたら？',
                'category' => '価値観',
            ],
            [
                'content' => '仕事で一番大切にしたい価値観は？',
                'category' => '価値観',
            ],
        ];

        foreach ($questions as $question) {
            Question::create($question);
        }
    }
}
