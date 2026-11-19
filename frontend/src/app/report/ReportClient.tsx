"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  AlertCircle,
  Loader2,
  CheckCircle2,
  CreditCard,
  ArrowLeft,
  Code,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { apiService } from "@/services/api";
import { usePaystackPayment } from "react-paystack";

interface ImeiReportData {
  model?: string;
  storage?: string;
  type?: string;
  blacklist_status?: string;
  find_my_iphone?: string;
  sim_lock?: string;
  carrier?: string;
  warranty_status?: string;
}

interface PaystackReference {
  reference: string;
  status?: string;
  trans?: string;
  transaction?: string;
  message?: string;
}

function ReportContent() {
  const searchParams = useSearchParams();
  const imei = (searchParams.get("imei") || "").trim();

  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [reportData, setReportData] = useState<ImeiReportData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentRef, setPaymentRef] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [referenceId] = useState(() => "IFX_" + Date.now().toString());

  useEffect(() => {
    if (!imei) {
      setError("No IMEI or Serial Number provided.");
      setLoading(false);
      return;
    }

    const isNumericImei = /^\d{15}$/.test(imei);
    const isAppleSerial = /^[A-Za-z0-9]{10,12}$/.test(imei);

    if (isNumericImei || isAppleSerial) {
      setIsValid(true);
      setReportData({
        model: "Apple Device (Detected)",
        type: isNumericImei ? "IMEI" : "Serial Number",
      });
    } else {
      setError("Invalid format. Enter a 15-digit IMEI or 10-12 character Apple Serial Number.");
    }
    setLoading(false);
  }, [imei]);

  const paystackPublicKey =
    process.env.NEXT_PUBLIC_PAYSTACK_KEY || "pk_test_YOUR_PAYSTACK_KEY";
  const isDevBypass =
    !process.env.NEXT_PUBLIC_PAYSTACK_KEY ||
    paystackPublicKey === "pk_test_YOUR_PAYSTACK_KEY";

  const config = {
    reference: referenceId,
    email: email.trim() || "guest@ifixapple.com.ng",
    amount: 2000 * 100,
    currency: "NGN",
    publicKey: paystackPublicKey,
  };

  const initializePayment = usePaystackPayment(config);

  const fetchFullReport = async (refString: string) => {
    setLoading(true);
    setError(null);
    setPaymentRef(refString);
    try {
      const data = await apiService.checkImei(imei);
      setReportData(data);
      setIsPaid(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to fetch full report after payment.";
      setError(message);
      setIsPaid(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (reference: PaystackReference) => {
    await fetchFullReport(reference?.reference || referenceId);
  };

  const handlePaymentClose = () => {
    setError("Payment window was closed before completion.");
  };

  const triggerPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedEmail = email.trim();
    if (!cleanedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanedEmail)) {
      setError("Please enter a valid email address to receive your receipt and report.");
      return;
    }
    setError(null);

    if (isDevBypass) {
      handlePaymentSuccess({ reference: "dev_bypass_" + Date.now() });
    } else {
      initializePayment({
        onSuccess: handlePaymentSuccess,
        onClose: handlePaymentClose,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-apple-gray">
        <Loader2 className="w-8 h-8 animate-spin text-apple-blue" />
      </div>
    );
  }

  if (error && !isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-apple-gray p-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm max-w-md w-full text-center border border-gray-100">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-apple-dark mb-2">Audit Failed</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-block bg-apple-dark text-white px-6 py-3 rounded-full font-medium hover:bg-black transition-colors"
          >
            Try Another IMEI
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-apple-gray py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-apple-dark mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Link>

        {/* Header */}
        <div className="bg-apple-dark text-white rounded-t-3xl p-8 flex flex-wrap gap-4 items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center">
              <ShieldCheck className="w-8 h-8 text-blue-400 mr-3 shrink-0" />
              IMEI Security Report
            </h1>
            <p className="text-gray-400 font-mono tracking-wider break-all">{imei}</p>
          </div>
          {isPaid && !error && (
            <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-bold flex items-center border border-green-500/30">
              <CheckCircle2 className="w-4 h-4 mr-2" /> Verified
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-b-3xl shadow-sm border border-gray-200 p-8 sm:p-12 relative overflow-hidden">
          {error && !isPaid && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center text-sm mb-6 border border-red-100">
              <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {error && isPaid && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm mb-6 border border-red-100">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
                <span>{error}</span>
              </div>
              {paymentRef && (
                <button
                  type="button"
                  onClick={() => fetchFullReport(paymentRef)}
                  className="inline-flex items-center justify-center bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors shrink-0"
                >
                  <RefreshCw className="w-4 h-4 mr-2" /> Retry Fetch
                </button>
              )}
            </div>
          )}

          {!isPaid ? (
            /* --- THE PAYWALL --- */
            <div className="relative min-h-[380px] flex items-center justify-center">
              <div className="w-full filter blur-md opacity-40 select-none pointer-events-none">
                <div className="space-y-6">
                  <div className="h-16 bg-gray-100 rounded-xl w-full"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 bg-gray-100 rounded-xl"></div>
                    <div className="h-24 bg-gray-100 rounded-xl"></div>
                    <div className="h-24 bg-gray-100 rounded-xl"></div>
                    <div className="h-24 bg-gray-100 rounded-xl"></div>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
                <div className="bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-gray-100 max-w-md w-full">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-apple-blue" />
                  </div>
                  <h2 className="text-2xl font-bold text-apple-dark mb-2">
                    Unlock Full Report
                  </h2>
                  <p className="text-gray-500 mb-6 text-sm">
                    We found matching data for this {reportData?.type || "device"}. Pay a one-time fee of{" "}
                    <strong>&#8358;2,000</strong> to instantly reveal Blacklist, iCloud, and Carrier status.
                  </p>

                  <form onSubmit={triggerPayment} className="space-y-4">
                    <input
                      type="email"
                      required
                      aria-label="Email address for receipt"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email for receipt"
                      className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 rounded-xl px-4 py-3 text-apple-dark outline-none transition-all text-sm"
                    />
                    <button
                      type="submit"
                      className={"w-full text-white px-6 py-4 rounded-xl font-bold transition-colors flex items-center justify-center shadow-md " + (isDevBypass ? "bg-purple-600 hover:bg-purple-700" : "bg-apple-blue hover:bg-blue-600")}
                    >
                      {isDevBypass ? (
                        <>
                          <Code className="w-5 h-5 mr-2" /> Test API (Bypass Payment)
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5 mr-2" /> Pay &#8358;2,000 with Paystack
                        </>
                      )}
                    </button>
                  </form>

                  {isDevBypass && (
                    <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-purple-500 font-medium">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>Dev Mode Active: Set NEXT_PUBLIC_PAYSTACK_KEY to enable live payments.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* --- THE REVEALED REPORT --- */
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="text-center pb-8 border-b border-gray-100">
                <h2 className="text-3xl font-bold text-apple-dark mb-2">
                  {reportData?.model || "Apple Device"}
                </h2>
                <p className="text-gray-500">
                  {reportData?.storage || "Unknown Storage"} &bull; {reportData?.type || "IMEI"}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {/* Blacklist Status */}
                <div
                  className={"p-6 rounded-2xl border " + (reportData?.blacklist_status === "CLEAN" ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100")}
                >
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    Blacklist Status
                  </p>
                  <p
                    className={"text-2xl font-bold " + (reportData?.blacklist_status === "CLEAN" ? "text-green-700" : "text-red-700")}
                  >
                    {reportData?.blacklist_status || "UNKNOWN"}
                  </p>
                </div>

                {/* Find My iPhone */}
                <div
                  className={"p-6 rounded-2xl border " + (reportData?.find_my_iphone === "OFF" ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100")}
                >
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    iCloud Activation Lock
                  </p>
                  <p
                    className={"text-2xl font-bold " + (reportData?.find_my_iphone === "OFF" ? "text-green-700" : "text-red-700")}
                  >
                    {reportData?.find_my_iphone === "OFF" ? "OFF (Safe)" : "ON (Locked)"}
                  </p>
                </div>

                {/* SIM Lock */}
                <div className="p-6 rounded-2xl border bg-gray-50 border-gray-100">
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    Carrier Lock Status
                  </p>
                  <p className="text-xl font-bold text-apple-dark">
                    {reportData?.sim_lock || "Unknown"}
                  </p>
                  {reportData?.carrier && (
                    <p className="text-sm text-gray-500 mt-1">{reportData.carrier}</p>
                  )}
                </div>

                {/* Warranty */}
                <div className="p-6 rounded-2xl border bg-gray-50 border-gray-100">
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    Warranty Status
                  </p>
                  <p className="text-xl font-bold text-apple-dark">
                    {reportData?.warranty_status || "Expired"}
                  </p>
                </div>
              </div>

              <div className="pt-6 text-center">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="text-apple-blue font-semibold hover:underline"
                >
                  Download / Print PDF Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-apple-gray">
          <Loader2 className="w-8 h-8 animate-spin text-apple-blue" />
        </div>
      }
    >
      <ReportContent />
    </Suspense>
  );
}