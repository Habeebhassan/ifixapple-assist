"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, Lock, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function UpdatePasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSessionValid, setIsSessionValid] = useState(true); // Neu: Steuert die Sichtbarkeit des Formulars

  useEffect(() => {
    // Überprüfen, ob eine aktive Recovery-Session existiert
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError("Invalid or expired password reset link. Please request a new link from the sign-in page.");
        setIsSessionValid(false);
      }
    };
    checkSession();
  }, []);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify and try again.");
      return;
    }

    setLoading(true);

  try {
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) throw error;

    setSuccess(true);
  } catch (err) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("An error occurred while updating your password.");
    }
  } finally {
    setLoading(false);
  }
};

  // HIER KORRIGIERT: Runde Klammer geöffnet und Layout-Wrapper hinzugefügt
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

        {/* Zurück zum Login Link */}
        <Link href="/login" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-apple-dark mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sign In
        </Link>

        {success ? (
          <div className="text-center py-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-apple-dark mb-3">Password Updated!</h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              Your password has been changed successfully. You can now log in to your account with your new credentials.
            </p>
            <Link
              href="/login"
              className="w-full bg-apple-dark text-white py-4 rounded-xl font-medium hover:bg-black transition-colors inline-flex items-center justify-center group"
            >
              Sign In Now
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-6 h-6 text-apple-blue" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-apple-dark mb-2">
                Set new password
              </h2>
              <p className="text-gray-500 text-sm">
                Please enter and confirm your new password below.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-start text-sm mb-6 border border-red-100">
                <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Formular wird nur gerendert, wenn die Session gültig ist */}
            {isSessionValid && (
              <form onSubmit={handlePasswordUpdate} className="space-y-5">
                <div className="relative">
                  <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New password (min. 6 chars)"
                    className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 rounded-xl pl-12 pr-12 py-3.5 text-sm text-apple-dark outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <div className="relative">
                  <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 rounded-xl pl-12 pr-4 py-3.5 text-sm text-apple-dark outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !password || !confirmPassword}
                  className="w-full bg-apple-dark text-white py-4 rounded-xl font-medium hover:bg-black transition-colors flex items-center justify-center group disabled:opacity-70 mt-6"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Update Password
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
