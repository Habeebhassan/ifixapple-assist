"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, Lock, Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  
  // This single state handles switching between Login and Signup modes
  const [isLogin, setIsLogin] = useState(true);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // If the user is already logged in, redirect them away from the login page
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push("/dashboard");
      }
    });
  }, [router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isLogin) {
        // Handle Sign In
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/dashboard");
      } else {
        // Handle Sign Up
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage("Success! Please check your email for a confirmation link. You can now log in.");
        setIsLogin(true); // Switch back to login view after successful signup
        setPassword(""); // Clear password field for security
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex-grow flex flex-col items-center justify-center p-4 py-16 animate-in fade-in duration-300">
      <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-gray-200 w-full max-w-md">
        <h1 className="text-2xl font-bold text-apple-dark text-center mb-2">
          {isLogin ? "Welcome back" : "Create your account"}
        </h1>
        <p className="text-gray-500 text-center mb-8 text-sm">
          {isLogin ? "Enter your details to access your dashboard." : "Sign up to track repairs, trade-ins, and devices."}
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl flex items-center text-sm mb-6 border border-red-100">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-50 text-green-700 p-3 rounded-xl text-sm mb-6 border border-green-100">
            {message}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="relative">
            <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 rounded-xl pl-11 pr-4 py-3 text-sm text-apple-dark outline-none transition-all"
            />
          </div>
          
          <div className="relative">
            <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 rounded-xl pl-11 pr-4 py-3 text-sm text-apple-dark outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full bg-apple-dark text-white py-3.5 rounded-xl font-medium hover:bg-black transition-colors flex items-center justify-center group disabled:opacity-70 mt-6"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {isLogin ? "Sign In" : "Sign Up"}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
              setMessage(null);
            }}
            className="text-sm text-apple-blue font-medium hover:underline outline-none"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}