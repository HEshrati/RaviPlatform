export interface User {
  id: number;
  email: string;
  role: 'user' | 'admin' | 'instructor';
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface Event {
  id: number;
  title: string;
  description?: string;
  price: number;
  date: string;       // تاریخ برگزاری
  location?: string;
  capacity: number;
  image?: string;     // اگر در بک‌اند فیلد عکس دارید
}
