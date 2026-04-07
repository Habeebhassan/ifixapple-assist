"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { apiService } from "@/services/api";
import { ArrowLeft, Loader2, Wrench, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function BookRepairPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [deviceModel, setDeviceModel] = useState("");
  const [issueType, setIssueType] = useState("");

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Redirect to login if not authenticated
        router.push("/login");
      } else {
        setUserId(session.user.id);
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !deviceModel || !issueType) return;

    setSubmitting(true);
    setError(null);

    try {
      await apiService.createTicket({
        user_id: userId,
        device_model: deviceModel,
        issue_type: issueType,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to book repair. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-apple-gray">
        <Loader2 className="w-8 h-8 animate-spin text-apple-blue" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-apple-gray flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-apple-dark mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {success ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-apple-dark mb-4">Repair Booked!</h2>
            <p className="text-gray-500 mb-8">
              Your ticket has been successfully submitted. You can track the progress of your repair in your dashboard.
            </p>
            <Link 
              href="/dashboard"
              className="bg-apple-dark text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-black transition-colors inline-block"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Wrench className="w-8 h-8 text-apple-blue" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-apple-dark mb-4">
                Book a Repair
              </h1>
              <p className="text-lg text-gray-500">
                Tell us what device you have and what needs fixing.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center mb-6 border border-red-100">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-apple-dark mb-2">Device Model</label>
                  <select
                    required
                    value={deviceModel}
                    onChange={(e) => setDeviceModel(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 rounded-xl px-4 py-3 text-apple-dark outline-none transition-all appearance-none"
                  >
                    <option value="" disabled>Select your device...</option>
                    <option value="iPhone 15 Pro Max">iPhone 15 Pro Max</option>
                    <option value="iPhone 14 Pro">iPhone 14 Pro</option>
                    <option value="iPhone 13">iPhone 13</option>
                    <option value="MacBook Pro M2">MacBook Pro M2</option>
                    <option value="iPad Air">iPad Air</option>
                    <option value="Other">Other / Not Sure</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-apple-dark mb-2">Primary Issue</label>
                  <select
                    required
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 rounded-xl px-4 py-3 text-apple-dark outline-none transition-all appearance-none"
                  >
                    <option value="" disabled>Select the issue...</option>
                    <option value="Cracked Screen">Cracked Screen</option>
                    <option value="Battery Draining Fast">Battery Draining Fast</option>
                    <option value="Water Damage">Water Damage</option>
                    <option value="Not Charging">Not Charging</option>
                    <option value="Camera Broken">Camera Broken</option>
                    <option value="Other / Unsure">Other / Unsure</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-apple-blue text-white py-4 rounded-xl font-medium hover:bg-blue-600 transition-colors flex items-center justify-center disabled:opacity-70 mt-4"
                >
                  {submitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Submit Repair Ticket"
                  )}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
