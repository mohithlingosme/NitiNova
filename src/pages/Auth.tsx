import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Loader2, Mail, Lock, AlertCircle, ArrowRight, Google } from "lucide-react";
import { cn } from "../../lib/utils";

enum AuthMode {
  LOGIN = "login",
  SIGNUP = "signup"
}

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState(AuthMode.LOGIN);
  const navigate = useNavigate();

  const handleAuth = async () => {
    setLoading(true);
    setError("");

    try {
      if (mode === AuthMode.LOGIN) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert("Check your email for confirmation link!");
        return; // Wait for email confirmation
      }
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    setLoading(false);
  };

  const toggleMode = () => {
    setMode(mode === AuthMode.LOGIN ? AuthMode.SIGNUP : AuthMode.LOGIN);
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
              NitiNova
            </h1>
            <p className="text-slate-500">
              {mode === AuthMode.LOGIN ? "Sign in to your account" : "Create your account"}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
              <p className="text-sm text-rose-800">{error}</p>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-2xl bg-slate-50/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="your@email.com"
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-2xl bg-slate-50/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="••••••••"
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* Primary Button */}
          <button
            onClick={handleAuth}
            disabled={loading || !email || !password}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all h-14"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {mode === AuthMode.LOGIN ? "Sign In" : "Create Account"}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-slate-200" />
            <span className="flex-shrink-0 px-4 text-xs text-slate-400 font-medium uppercase">or</span>
            <div className="flex-grow border-t border-slate-200" />
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 py-4 px-6 rounded-2xl font-semibold shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all h-14"
          >
            <Google className="w-5 h-5" />
            Continue with Google
          </button>

          {/* Toggle */}
          <p className="text-center text-sm text-slate-500">
            {mode === AuthMode.LOGIN ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={toggleMode}
              className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
              disabled={loading}
            >
              {mode === AuthMode.LOGIN ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
