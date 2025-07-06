# Career Q-Cards 📊

キャリア振り返りのための毎日の質問回答アプリケーション

## 概要

Career Q-Cardsは、毎日一つの質問に答えることで、キャリアの振り返りと自己成長を促進するWebアプリケーションです。ユーザーは日々の質問に回答し、これまでの回答履歴を確認して、自分のキャリアの軌跡を可視化できます。

### 主な機能

- 📝 **毎日の質問**: カテゴリ別の質問に毎日回答
- 🔐 **ユーザー認証**: 安全なユーザー登録・ログイン機能
- 📊 **回答履歴**: 過去の回答の確認とフィードバック
- 📈 **統計情報**: 総回答数、連続回答日数の表示
- 💡 **AIフィードバック**: 回答に対するGPTフィードバック（将来実装予定）

## 技術スタック

### フロントエンド
- **Next.js 15.3.4** - React ベースのフルスタックフレームワーク
- **React 19** - ユーザーインターフェース構築
- **TypeScript** - 型安全な開発
- **Tailwind CSS 4** - モダンなスタイリング
- **Turbopack** - 高速なバンドラー

### バックエンド
- **Laravel 12** - PHP Webアプリケーションフレームワーク
- **Laravel Sanctum** - API認証
- **PHP 8.2+** - サーバーサイドプログラミング

### データベース
- **MySQL 8.0** - リレーショナルデータベース
- **phpMyAdmin** - データベース管理ツール

### インフラ・ツール
- **Docker & Docker Compose** - コンテナ化とオーケストレーション
- **Vite** - フロントエンドビルドツール

## プロジェクト構造

```
career-q-cards/
├── frontend/                 # Next.js フロントエンド
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # Reactコンポーネント
│   │   ├── contexts/        # React Context
│   │   └── lib/            # ユーティリティとAPI client
│   ├── public/             # 静的ファイル
│   └── Dockerfile          # フロントエンドコンテナ設定
├── backend/                # Laravel バックエンド
│   ├── app/
│   │   ├── Http/Controllers/ # APIコントローラー
│   │   └── Models/         # Eloquentモデル
│   ├── database/
│   │   ├── migrations/     # データベースマイグレーション
│   │   └── seeders/        # シードデータ
│   ├── routes/             # APIルート定義
│   └── Dockerfile          # バックエンドコンテナ設定
├── database/               # MySQL初期化スクリプト
└── docker-compose.yml      # Docker Compose設定
```

## セットアップ手順

### 前提条件

- Docker Desktop
- Git

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd career-q-cards
```

### 2. 環境設定

バックエンドの環境変数ファイルを確認・調整：

```bash
# backend/.env ファイルが正しく設定されていることを確認
# 主要な設定項目：
# - DB_CONNECTION=mysql
# - DB_HOST=mysql
# - DB_DATABASE=career_q_cards
# - DB_USERNAME=career_q_user
# - DB_PASSWORD=password
```

### 3. Docker Composeでアプリケーションを起動

```bash
# すべてのサービスを起動
docker-compose up -d

# ログを確認（オプション）
docker-compose logs -f
```

### 4. データベースのセットアップ

```bash
# マイグレーションの実行
docker-compose exec backend php artisan migrate

# シードデータの投入
docker-compose exec backend php artisan db:seed --class=QuestionSeeder
```

### 5. アクセス確認

- **フロントエンド**: http://localhost:3000
- **バックエンドAPI**: http://localhost:8000
- **phpMyAdmin**: http://localhost:8080 (ユーザー: career_q_user, パスワード: password)

## 使用方法

### 1. ユーザー登録・ログイン

1. `http://localhost:3000` にアクセス
2. 「ユーザー登録」から新規アカウント作成
3. またはログインページから既存アカウントでログイン

### 2. 質問への回答

1. ホームページで今日の質問を確認
2. 100文字以内で回答を入力
3. 回答を送信して完了

### 3. 履歴の確認

1. 「📊 これまでの回答を見る」リンクをクリック
2. 統計情報（総回答数、連続日数）を確認
3. 過去の回答とカテゴリを閲覧

## API エンドポイント

### 認証なし
- `GET /api/v1/questions/today` - 今日の質問取得
- `GET /api/v1/questions` - 質問一覧取得
- `POST /api/v1/register` - ユーザー登録
- `POST /api/v1/login` - ログイン

### 認証あり（Bearer Token）
- `POST /api/v1/logout` - ログアウト
- `GET /api/v1/me` - ユーザー情報取得
- `POST /api/v1/answers` - 回答投稿
- `GET /api/v1/answers` - 回答履歴取得
- `GET /api/v1/answers/stats` - ユーザー統計取得
- `GET /api/v1/answers/{answer}` - 特定回答取得

## 開発

### フロントエンド開発

```bash
# フロントエンドコンテナに入る
docker-compose exec frontend bash

# 依存関係の追加
npm install <package-name>

# TypeScript型チェック
npm run type-check
```

### バックエンド開発

```bash
# バックエンドコンテナに入る
docker-compose exec backend bash

# Artisanコマンドの実行
php artisan <command>

# 新しいマイグレーション作成
php artisan make:migration <migration_name>

# 新しいコントローラー作成
php artisan make:controller <controller_name>
```

### データベース管理

```bash
# マイグレーションのリセット
docker-compose exec backend php artisan migrate:reset

# マイグレーションの再実行
docker-compose exec backend php artisan migrate:fresh --seed

# Tinkerでデータベース操作
docker-compose exec backend php artisan tinker
```

## トラブルシューティング

### ポートが使用されている場合

```bash
# 使用中のポートを確認
lsof -i :3000  # フロントエンド
lsof -i :8000  # バックエンド
lsof -i :3306  # MySQL
lsof -i :8080  # phpMyAdmin

# プロセスを終了
kill -9 <PID>
```

### データベース接続エラー

```bash
# MySQLコンテナのログ確認
docker-compose logs mysql

# バックエンドの.envファイル確認
cat backend/.env | grep DB_

# コンテナの再起動
docker-compose restart mysql backend
```

### キャッシュクリア

```bash
# Laravel設定キャッシュクリア
docker-compose exec backend php artisan config:clear
docker-compose exec backend php artisan cache:clear

# Next.jsキャッシュクリア
docker-compose exec frontend rm -rf .next
```

## 今後の機能予定

- [ ] GPTによるAIフィードバック機能
- [ ] 回答のエクスポート機能
- [ ] 質問カテゴリのカスタマイズ
- [ ] 回答の検索・フィルタリング機能
- [ ] 回答統計のグラフ表示
- [ ] ソーシャル機能（回答の共有）
