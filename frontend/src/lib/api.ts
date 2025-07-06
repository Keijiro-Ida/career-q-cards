// API client for Career Q-Cards backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Question {
  id: number;
  content: string;
  category: string;
}

export interface Answer {
  id: number;
  content: string;
  gpt_feedback?: string;
  answered_date: string;
  question?: Question;
}

export interface TodayQuestionResponse {
  question: Question;
  has_answered: boolean;
  user_answer?: Answer;
}

export interface AnswerHistoryResponse {
  answers: Answer[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
}

export interface UserStats {
  total_answers: number;
  streak_days: number;
  answered_today: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

// APIクライアントクラス
class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    // 既存のヘッダーをマージ
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // 今日の質問を取得
  async getTodaysQuestion(): Promise<TodayQuestionResponse> {
    return this.request<TodayQuestionResponse>('/api/v1/questions/today');
  }

  // 回答を投稿
  async submitAnswer(questionId: number, content: string): Promise<{ message: string; answer: Answer }> {
    return this.request('/api/v1/answers', {
      method: 'POST',
      body: JSON.stringify({
        question_id: questionId,
        content,
      }),
    });
  }

  // 回答履歴を取得
  async getAnswerHistory(page: number = 1): Promise<AnswerHistoryResponse> {
    return this.request<AnswerHistoryResponse>(`/api/v1/answers?page=${page}`);
  }

  // ユーザー統計を取得
  async getUserStats(): Promise<{ stats: UserStats }> {
    return this.request<{ stats: UserStats }>('/api/v1/answers/stats');
  }

  // 質問一覧を取得（開発用）
  async getQuestions(category?: string): Promise<{ data: Question[] }> {
    const params = category ? `?category=${encodeURIComponent(category)}` : '';
    return this.request<{ data: Question[] }>(`/api/v1/questions${params}`);
  }

  // 認証関連メソッド
  async register(name: string, email: string, password: string, passwordConfirmation: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/v1/register', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      }),
    });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/v1/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
    });
  }

  async logout(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/v1/logout', {
      method: 'POST',
    });
  }

  async me(): Promise<{ user: User }> {
    return this.request<{ user: User }>('/api/v1/me');
  }
}

// シングルトンインスタンス
export const apiClient = new ApiClient(API_BASE_URL);

// エラーハンドリング用のユーティリティ
export function isApiError(error: unknown): error is Error {
  return error instanceof Error;
}

export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message;
  }
  return '予期しないエラーが発生しました';
}