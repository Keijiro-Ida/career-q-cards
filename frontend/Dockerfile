FROM node:20-alpine

WORKDIR /app

# パッケージファイルをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm ci

# アプリケーションファイルをコピー
COPY . .

# ポートを公開
EXPOSE 3000

# 開発サーバー起動
CMD ["npm", "run", "dev"]
