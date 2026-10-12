import { api, setAuthToken, clearAuthToken } from "./api";

export type AuthUser = {
  id: number | string;
  name: string;
  email: string;
  exp?: number;
  coins?: number;
  level?: number;
  created_at?: string;
};

export type AuthResponse = {
  user: AuthUser;
  token: string;
};

export const authService = {
  async register(
    name: string,
    email: string,
    password: string,
  ): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register", {
      name,
      email,
      password,
    });
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    return response.data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    return response.data;
  },

  async getProfile(): Promise<AuthUser> {
    const response = await api.get<AuthUser>("/auth/me");
    return response.data;
  },

  async updateProfile(
    updates: Partial<Pick<AuthUser, "name" | "exp" | "coins" | "level">>,
  ): Promise<AuthUser> {
    const response = await api.patch<AuthUser>("/auth/profile", updates);
    return response.data;
  },

  async changePassword(
    currentPassword: string,
    password: string,
    passwordConfirmation: string,
  ): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>("/auth/password", {
      current_password: currentPassword,
      password,
      password_confirmation: passwordConfirmation,
    });
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout");
    } catch {
      // Ignore network errors on logout
    } finally {
      clearAuthToken();
    }
  },
};
