import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type User = any; // Supabase User type

type LoginFn = (email: string, password: string) => Promise<void>;
type SignupFn = (email: string, password: string) => Promise<void>;

/**
 * Production-grade Supabase auth hook.
 * Handles session state, login/signup/logout, real-time auth changes.
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial session load
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    // Real-time auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login: LoginFn = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  }, []);

  const signup: SignupFn = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw new Error(error.message);
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
  };
}

export type UseAuthReturn = ReturnType<typeof useAuth>;
