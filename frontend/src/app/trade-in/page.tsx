// "use client";

// import { useState, useEffect } from "react";
// import { supabase } from "@/lib/supabase";
// import { useRouter } from "next/navigation";
// import { ArrowLeft, Loader2, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
// import Link from "next/link";

// export default function TradeInPage() {
//   const router = useRouter();
//   const [userId, setUserId] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Form State
//   const [deviceModel, setDeviceModel] = useState("");
//   const [storage, setStorage] = useState("");
//   const [condition, setCondition] = useState("");
//   const [estimatedValue, setEstimatedValue] = useState<number | null>(null);

//   // Dynamic Region & Currency State (Localized for Nigeria)
//   const [locale, setLocale] = useState("en-NG");
//   const [currencyCode, setCurrencyCode] = useState("NGN");

//   useEffect(() => {
//     // Authenticate User
//     const checkAuth = async () => {
//       const { data: { session } } = await supabase.auth.getSession();
//       if (!session) {
//         router.push("/login");
//       } else {
//         setUserId(session.user.id);
//         setLoading(false);
//       }
//     };
//     checkAuth();

//     // Defaulting to NGN for the Lagos strategy
//     setLocale("en-NG");
//     setCurrencyCode("NGN");
//   }, [router]);

//   // Formats the pure number into localized currency
//   const formatCurrency = (value: number) => {
//     try {
//       return new Intl.NumberFormat(locale, { 
//         style: 'currency', 
//         currency: currencyCode, 
//         maximumFractionDigits: 0 
//       }).format(value);
//     } catch (e) {
//       return `₦${value}`; // Fallback
//     }
//   };

//   // Localized Nigerian Pricing Logic based on selections
//   useEffect(() => {
//     if (deviceModel && condition) {
//       let basePrice = 0;
//       if (deviceModel.includes("15")) basePrice = 850000;
//       else if (deviceModel.includes("14")) basePrice = 600000;
//       else if (deviceModel.includes("13")) basePrice = 400000;
//       else if (deviceModel.includes("MacBook")) basePrice = 950000;
//       else if (deviceModel.includes("iPad")) basePrice = 300000;
//       else basePrice = 150000;

//       // Adjusted to match the letter grades
//       if (condition === "A") basePrice *= 1.2; // Flawless
//       if (condition === "C") basePrice *= 0.5; // Cracked/Damaged

//       setEstimatedValue(Math.round(basePrice));
//     }
//   }, [deviceModel, condition]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!userId || !deviceModel || !condition || estimatedValue === null) return;

//     setSubmitting(true);
//     setError(null);

//     try {
//       const { error: dbError } = await supabase
//         .from("trade_in_offers")
//         .insert([
//           {
//             user_id: userId,
//             device_details: { model: deviceModel, storage: storage },
//             grade: condition,
//             offered_price: estimatedValue,
//             status: "Pending Review"
//           }
//         ]);

//       if (dbError) throw dbError;
      
//       setSuccess(true);
//     } catch (err: any) {
//       console.error(err);
//       setError("Database Error: " + (err.message || "Unknown error"));
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-apple-gray">
//         <Loader2 className="w-8 h-8 animate-spin text-apple-blue" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-[calc(100vh-64px)] bg-apple-gray flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
//       <div className="w-full max-w-2xl">
//         <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-apple-dark mb-8 transition-colors">
//           <ArrowLeft className="w-4 h-4 mr-2" />
//           Back to Home
//         </Link>

//         {success ? (
//           <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 animate-in fade-in zoom-in duration-300">
//             <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
//               <CheckCircle2 className="w-10 h-10 text-green-500" />
//             </div>
//             <h2 className="text-3xl font-bold text-apple-dark mb-4">Swap Offer Submitted!</h2>
//             <p className="text-gray-500 mb-8">
//               We've locked in your estimated swap value of <strong>{formatCurrency(estimatedValue || 0)}</strong> toward your UK Used upgrade. You will receive an email shortly with dispatch instructions.
//             </p>
//             <Link 
//               href="/dashboard"
//               className="bg-apple-dark text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-black transition-colors inline-block"
//             >
//               Go to Dashboard
//             </Link>
//           </div>
//         ) : (
//           <>
//             <div className="text-center mb-10">
//               <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
//                 <RefreshCw className="w-8 h-8 text-purple-600" />
//               </div>
//               <h1 className="text-4xl font-bold tracking-tight text-apple-dark mb-4">
//                 Swap & Upgrade
//               </h1>
//               <p className="text-lg text-gray-500">
//                 Get an instant valuation to swap your current device for a UK Used upgrade.
//               </p>
//             </div>

//             <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
//               {error && (
//                 <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-start mb-6 border border-red-100">
//                   <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
//                   <span className="text-sm">{error}</span>
//                 </div>
//               )}

//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-semibold text-apple-dark mb-2">Current Device Model</label>
//                   <select
//                     required
//                     value={deviceModel}
//                     onChange={(e) => setDeviceModel(e.target.value)}
//                     className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-xl px-4 py-3 text-apple-dark outline-none transition-all appearance-none"
//                   >
//                     <option value="" disabled>Select your device...</option>
//                     <option value="iPhone 15 Pro">iPhone 15 Pro</option>
//                     <option value="iPhone 14">iPhone 14</option>
//                     <option value="iPhone 13">iPhone 13</option>
//                     <option value="MacBook Air M2">MacBook Air M2</option>
//                     <option value="iPad Pro 11-inch">iPad Pro 11-inch</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-apple-dark mb-2">Storage Capacity</label>
//                   <select
//                     required
//                     value={storage}
//                     onChange={(e) => setStorage(e.target.value)}
//                     className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-xl px-4 py-3 text-apple-dark outline-none transition-all appearance-none"
//                   >
//                     <option value="" disabled>Select storage...</option>
//                     <option value="128GB">128GB</option>
//                     <option value="256GB">256GB</option>
//                     <option value="512GB">512GB</option>
//                     <option value="1TB">1TB</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-apple-dark mb-2">Condition</label>
//                   <select
//                     required
//                     value={condition}
//                     onChange={(e) => setCondition(e.target.value)}
//                     className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-xl px-4 py-3 text-apple-dark outline-none transition-all appearance-none"
//                   >
//                     <option value="" disabled>Select condition...</option>
//                     <option value="A">Flawless (Looks brand new)</option>
//                     <option value="B">Good (Normal wear and tear)</option>
//                     <option value="C">Cracked or Damaged</option>
//                   </select>
//                 </div>

//                 {estimatedValue !== null && (
//                   <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 text-center mt-6 animate-in fade-in">
//                     <p className="text-sm font-semibold text-purple-800 mb-1">Estimated Swap Value</p>
//                     <p className="text-4xl font-bold text-purple-900">{formatCurrency(estimatedValue)}</p>
//                     <p className="text-xs text-purple-600 mt-2">Value to be deducted from your new UK Used device.</p>
//                   </div>
//                 )}

//                 <button
//                   type="submit"
//                   disabled={submitting || estimatedValue === null}
//                   className="w-full bg-apple-dark text-white py-4 rounded-xl font-medium hover:bg-black transition-colors flex items-center justify-center disabled:opacity-70 mt-4"
//                 >
//                   {submitting ? (
//                     <Loader2 className="w-5 h-5 animate-spin" />
//                   ) : (
//                     "Accept Swap Offer & Continue"
//                   )}
//                 </button>
//               </form>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Search,
  Smartphone,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { apiService } from "@/services/api";

// A comprehensive fallback catalog. In Phase 2, we will fetch this directly from Supabase!
const APPLE_CATALOG = [
  "iPhone 16 Pro Max",
  "iPhone 16 Pro",
  "iPhone 16 Plus",
  "iPhone 16",
  "iPhone 15 Pro Max",
  "iPhone 15 Pro",
  "iPhone 15 Plus",
  "iPhone 15",
  "iPhone 14 Pro Max",
  "iPhone 14 Pro",
  "iPhone 14 Plus",
  "iPhone 14",
  "iPhone 13 Pro Max",
  "iPhone 13 Pro",
  "iPhone 13",
  "iPhone 13 mini",
  "iPhone 12 Pro Max",
  "iPhone 12 Pro",
  "iPhone 12",
  "iPhone 12 mini",
  "iPhone 11 Pro Max",
  "iPhone 11 Pro",
  "iPhone 11",
  "MacBook Pro (M3 Max)",
  "MacBook Pro (M3 Pro)",
  "MacBook Pro (M3)",
  "MacBook Pro (M2)",
  "MacBook Air (M2)",
  "MacBook Air (M1)",
  "iPad Pro 12.9-inch (M2)",
  "iPad Pro 11-inch (M2)",
  "iPad Air (5th Gen)",
];

const STORAGE_MULTIPLIERS: Record<string, number> = {
  "64GB": 0.92,
  "128GB": 1.0,
  "256GB": 1.08,
  "512GB": 1.18,
  "1TB": 1.28,
  "2TB": 1.38,
};

export default function TradeInPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // IMEI/Serial Lookup State
  const [serialNumber, setSerialNumber] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifySuccess, setVerifySuccess] = useState<string | null>(null);

  // Form State
  const [deviceModel, setDeviceModel] = useState("");
  const [storage, setStorage] = useState("");
  const [condition, setCondition] = useState("");
  const [estimatedValue, setEstimatedValue] = useState<number | null>(null);

  // Smart Autocomplete State
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Dynamic Region & Currency State
  const [locale, setLocale] = useState("en-NG");
  const [currencyCode, setCurrencyCode] = useState("NGN");

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        setUserId(session.user.id);
        setLoading(false);
      }
    };
    checkAuth();
    setLocale("en-NG");
    setCurrencyCode("NGN");

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [router]);

  const formatCurrency = (value: number) => {
    try {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currencyCode,
        maximumFractionDigits: 0,
      }).format(value);
    } catch {
      return "\u20A6" + value.toLocaleString();
    }
  };

  // Smart Autocomplete Handler
  const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDeviceModel(val);

    if (val.trim().length > 0) {
      const filtered = APPLE_CATALOG.filter((device) =>
        device.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setDeviceModel(suggestion);
    setShowSuggestions(false);
  };

  // Dynamic Pricing Logic based on model, storage, and condition
  useEffect(() => {
    if (deviceModel.trim() && condition) {
      const model = deviceModel.toLowerCase();
      let basePrice = 150000; // Default base for older/unknown models

      if (model.includes("17")) basePrice = 1200000;
      else if (model.includes("16")) basePrice = 1050000;
      else if (model.includes("15")) basePrice = 850000;
      else if (model.includes("14")) basePrice = 600000;
      else if (model.includes("13")) basePrice = 400000;
      else if (model.includes("12")) basePrice = 250000;
      else if (model.includes("11")) basePrice = 180000;
      else if (
        model.includes("macbook") &&
        (model.includes("m2") || model.includes("m3"))
      )
        basePrice = 1100000;
      else if (model.includes("macbook") && model.includes("m1"))
        basePrice = 700000;
      else if (model.includes("macbook")) basePrice = 400000;
      else if (model.includes("ipad pro")) basePrice = 500000;
      else if (model.includes("ipad")) basePrice = 250000;

      if (model.includes("pro max")) basePrice *= 1.3;
      else if (model.includes("pro")) basePrice *= 1.15;

      if (storage && STORAGE_MULTIPLIERS[storage]) {
        basePrice *= STORAGE_MULTIPLIERS[storage];
      }

      if (condition === "A") basePrice *= 1.2;
      if (condition === "C") basePrice *= 0.5;

      setEstimatedValue(Math.round(basePrice));
    } else {
      setEstimatedValue(null);
    }
  }, [deviceModel, storage, condition]);

  const handleSerialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 15);
    setSerialNumber(cleaned);
  };

  const handleVerifyImei = async () => {
    const trimmed = serialNumber.trim();
    if (trimmed.length < 10) {
      setError("Please enter a valid 15-digit IMEI or 10-12 character Serial.");
      return;
    }

    setIsVerifying(true);
    setError(null);
    setVerifySuccess(null);

    try {
      const data = await apiService.checkImei(trimmed);
      if (data?.model) {
        setDeviceModel(data.model);
        setShowSuggestions(false);
        setVerifySuccess("Device securely identified as: " + data.model);
      } else {
        setError(
          "Could not automatically detect model. Please enter it manually."
        );
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Could not find device details. Please enter model manually.";
      setError(message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !deviceModel.trim() || !storage || !condition || estimatedValue === null) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const { error: dbError } = await supabase.from("trade_in_offers").insert([
        {
          user_id: userId,
          device_details: {
            model: deviceModel.trim(),
            storage: storage,
            imei: serialNumber.trim() || null,
          },
          grade: condition,
          offered_price: estimatedValue,
          status: "Pending Review",
        },
      ]);
      if (dbError) throw dbError;
      setSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError("Database Error: " + message);
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
    <div className="min-h-[calc(100vh-64px)] bg-apple-gray flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-apple-dark mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>

        {success ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-apple-dark mb-4">
              Swap Offer Submitted!
            </h2>
            <p className="text-gray-500 mb-8">
              We&apos;ve locked in your estimated swap value of{" "}
              <strong>{formatCurrency(estimatedValue || 0)}</strong> toward your
              UK Used upgrade. You will receive an email shortly with dispatch
              instructions.
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
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <RefreshCw className="w-8 h-8 text-purple-600" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-apple-dark mb-4">
                Swap &amp; Upgrade
              </h1>
              <p className="text-lg text-gray-500">
                Get an instant valuation to swap your current device for a UK
                Used upgrade.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-gray-100">
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-start mb-6 border border-red-100">
                  <AlertCircle className="w-5 h-5 mr-2 mt-0.5 shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* IMEI Auto-Detect Section */}
              <div className="mb-8 p-6 bg-purple-50/50 rounded-2xl border border-purple-100">
                <label
                  htmlFor="tradein-serial-input"
                  className="block text-sm font-semibold text-apple-dark mb-2"
                >
                  Auto-detect via IMEI/Serial (Recommended)
                </label>
                <p className="text-xs text-gray-500 mb-4">
                  Get the absolute most accurate quote by letting our system
                  scan your device specs.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    id="tradein-serial-input"
                    type="text"
                    maxLength={15}
                    value={serialNumber}
                    onChange={handleSerialChange}
                    placeholder="Enter 15-digit IMEI or Serial..."
                    className="flex-1 bg-white border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-xl px-4 py-3 text-apple-dark outline-none transition-all uppercase font-mono tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyImei}
                    disabled={isVerifying || serialNumber.trim().length < 10}
                    className="bg-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors disabled:opacity-70 flex items-center justify-center whitespace-nowrap shadow-sm"
                  >
                    {isVerifying ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" /> Scan Device
                      </>
                    )}
                  </button>
                </div>
                {verifySuccess && (
                  <div className="mt-3 bg-green-50 p-3 rounded-xl border border-green-100 flex items-center animate-in fade-in">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-green-500 shrink-0" />
                    <span className="text-sm text-green-700 font-bold">
                      {verifySuccess}
                    </span>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Custom Smart Text Input */}
                <div className="relative" ref={dropdownRef}>
                  <label
                    htmlFor="tradein-device-model"
                    className="block text-sm font-semibold text-apple-dark mb-2"
                  >
                    Current Device Model
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <input
                      id="tradein-device-model"
                      type="text"
                      required
                      value={deviceModel}
                      onChange={handleModelChange}
                      onFocus={() => {
                        if (deviceModel.trim().length > 0) {
                          setShowSuggestions(true);
                        }
                      }}
                      placeholder="e.g. iPhone 14 Pro Max, MacBook M3"
                      className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-xl pl-11 pr-4 py-3 text-apple-dark outline-none transition-all"
                      autoComplete="off"
                    />
                  </div>

                  {/* Custom Autocomplete Dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                      <ul
                        role="listbox"
                        className="max-h-60 overflow-y-auto custom-scrollbar"
                      >
                        {suggestions.map((suggestion) => (
                          <li key={suggestion} role="option" aria-selected={deviceModel === suggestion}>
                            <button
                              type="button"
                              onClick={() => selectSuggestion(suggestion)}
                              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 cursor-pointer border-b border-gray-50 last:border-0 transition-colors"
                            >
                              {suggestion}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="tradein-storage"
                    className="block text-sm font-semibold text-apple-dark mb-2"
                  >
                    Storage Capacity
                  </label>
                  <div className="relative">
                    <select
                      id="tradein-storage"
                      required
                      value={storage}
                      onChange={(e) => setStorage(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-xl px-4 py-3 pr-10 text-apple-dark outline-none transition-all appearance-none"
                    >
                      <option value="" disabled>
                        Select storage...
                      </option>
                      <option value="64GB">64GB</option>
                      <option value="128GB">128GB</option>
                      <option value="256GB">256GB</option>
                      <option value="512GB">512GB</option>
                      <option value="1TB">1TB</option>
                      <option value="2TB">2TB</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="tradein-condition"
                    className="block text-sm font-semibold text-apple-dark mb-2"
                  >
                    Condition
                  </label>
                  <div className="relative">
                    <select
                      id="tradein-condition"
                      required
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-xl px-4 py-3 pr-10 text-apple-dark outline-none transition-all appearance-none"
                    >
                      <option value="" disabled>
                        Select condition...
                      </option>
                      <option value="A">
                        Flawless (Looks brand new, no scratches)
                      </option>
                      <option value="B">Good (Normal wear and tear)</option>
                      <option value="C">Cracked or Damaged</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {estimatedValue !== null && (
                  <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 text-center mt-6 animate-in fade-in">
                    <p className="text-sm font-semibold text-purple-800 mb-1">
                      Estimated Swap Value
                    </p>
                    <p className="text-4xl font-bold text-purple-900">
                      {formatCurrency(estimatedValue)}
                    </p>
                    <p className="text-xs text-purple-600 mt-2">
                      Value to be deducted from your new UK Used device.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting || estimatedValue === null}
                  className="w-full bg-apple-dark text-white py-4 rounded-xl font-medium hover:bg-black transition-colors flex items-center justify-center disabled:opacity-70 mt-4 shadow-sm"
                >
                  {submitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Accept Swap Offer & Continue"
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