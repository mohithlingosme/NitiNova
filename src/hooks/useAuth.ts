import { useCallback, useEffect, useState } from "react";
import { login as apiLogin } from "../services/api";

type LoginFn = (email: string, password: string) => Promise<void>;

/**
 * Lightweight auth state tracker backed by localStorage JWT.
 * Keeps App logic simple while working with the existing FastAPI JWT endpoints.
 */
export function useAuth() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("jwt"));
  }, []);

  const login: LoginFn = useCallback(async (email, password) => {
    const data = await apiLogin(email, password);
    const accessToken = data?.access_token;

    if (accessToken) {
      localStorage.setItem("jwt", accessToken);
      setToken(accessToken);
    } else {
      throw new Error("Login response missing access_token");
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("jwt");
    setToken(null);
  }, []);

  return {
    token,
    isAuthenticated: Boolean(token),
    login,
    logout,
  };
}

export type UseAuthReturn = ReturnType<typeof useAuth>;
