#!/bin/bash

echo "🚀 キャリアQカードアプリの開発環境をセットアップします..."

# プロジェクトディレクトリ構造を作成
echo "📁 ディレクトリ構造を作成中..."
mkdir -p frontend backend database/init

# Next.jsプロジェクトを作成
echo "⚛️  Next.jsプロジェクトを作成中..."
if [ ! -d "frontend/node_modules" ]; then
    cd frontend
    npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
    cd ..
fi

# Laravelプロジェクトを作成
echo "🐘 Laravelプロジェクトを作成中..."
if [ ! -f "backend/artisan" ]; then
    cd backend
    composer create-project laravel/laravel .
    cd ..
fi

# .envファイルを設定
echo "⚙️  環境設定ファイルを作成中..."
if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    # データベース設定を更新
    sed -i 's/DB_HOST=127.0.0.1/DB_HOST=mysql/' backend/.env
    sed -i 's/DB_DATABASE=laravel/DB_DATABASE=career_q_cards/' backend/.env
    sed -i 's/DB_USERNAME=root/DB_USERNAME=career_q_user/' backend/.env
    sed -i 's/DB_PASSWORD=/DB_PASSWORD=password/' backend/.env
fi

# Dockerコンテナを起動
echo "🐳 Dockerコンテナを起動中..."
docker-compose up -d --build

# Laravel の初期設定
echo "🔑 Laravelの初期設定中..."
sleep 10  # コンテナの起動を待つ
docker-compose exec backend php artisan key:generate
docker-compose exec backend php artisan migrate
docker-compose exec backend php artisan db:seed

echo "✅ セットアップ完了！"
echo ""
echo "🌐 アクセス情報:"
echo "   フロントエンド: http://localhost:3000"
echo "   バックエンドAPI: http://localhost:8000"
echo "   phpMyAdmin: http://localhost:8080"
echo ""
echo "🛠️  開発用コマンド:"
echo "   docker-compose up -d    # コンテナ起動"
echo "   docker-compose down     # コンテナ停止"
echo "   docker-compose logs -f  # ログ確認"
