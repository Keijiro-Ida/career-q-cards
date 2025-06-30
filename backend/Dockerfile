FROM php:8.2-fpm

# システムの依存関係をインストール
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    nginx

# PHP拡張機能をインストール
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Composerをインストール
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 作業ディレクトリを設定
WORKDIR /var/www/html

# Laravelプロジェクトをコピー
COPY . .

# Composerで依存関係をインストール
RUN composer install --no-dev --optimize-autoloader

# ファイル権限を設定
RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 755 /var/www/html/storage

# Nginxの設定ファイルをコピー
COPY nginx.conf /etc/nginx/sites-available/default

# ポートを公開
EXPOSE 8000

# Nginx と PHP-FPM を起動
CMD service nginx start && php-fpm
