export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthSession {
  userId: string;
  loginAt: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
}
