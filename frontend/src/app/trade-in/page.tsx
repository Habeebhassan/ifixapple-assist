"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function TradeInPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [deviceModel, setDeviceModel] = useState("");
  const [storage, setStorage] = useState("");
  const [condition, setCondition] = useState("");
  const [estimatedValue, setEstimatedValue] = useState<number | null>(null);

  // Dynamic Region & Currency State (Localized for Nigeria)
  const [locale, setLocale] = useState("en-NG");
  const [currencyCode, setCurrencyCode] = useState("NGN");

  useEffect(() => {
    // Authenticate User
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        setUserId(session.user.id);
        setLoading(false);
      }
    };
    checkAuth();

    // Defaulting to NGN for the Lagos strategy
    setLocale("en-NG");
    setCurrencyCode("NGN");
  }, [router]);

  // Formats the pure number into localized currency
  const formatCurrency = (value: number) => {
    try {
      return new Intl.NumberFormat(locale, { 
        style: 'currency', 
        currency: currencyCode, 
        maximumFractionDigits: 0 
      }).format(value);
    } catch (e) {
      return `₦${value}`; // Fallback
    }
  };

  // Localized Nigerian Pricing Logic based on selections
  useEffect(() => {
    if (deviceModel && condition) {
      let basePrice = 0;
      if (deviceModel.includes("15")) basePrice = 850000;
      else if (deviceModel.includes("14")) basePrice = 600000;
      else if (deviceModel.includes("13")) basePrice = 400000;
      else if (deviceModel.includes("MacBook")) basePrice = 950000;
      else if (deviceModel.includes("iPad")) basePrice = 300000;
      else basePrice = 150000;

      // Adjusted to match the letter grades
      if (condition === "A") basePrice *= 1.2; // Flawless
      if (condition === "C") basePrice *= 0.5; // Cracked/Damaged

      setEstimatedValue(Math.round(basePrice));
    }
  }, [deviceModel, condition]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !deviceModel || !condition || estimatedValue === null) return;

    setSubmitting(true);
    setError(null);

    try {
      const { error: dbError } = await supabase
        .from("trade_in_offers")
        .insert([
          {
            user_id: userId,
            device_details: { model: deviceModel, storage: storage },
            grade: condition,
            offered_price: estimatedValue,
            status: "Pending Review"
          }
        ]);

      if (dbError) throw dbError;
      
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError("Database Error: " + (err.message || "Unknown error"));
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
        <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-apple-dark mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {success ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-apple-dark mb-4">Swap Offer Submitted!</h2>
            <p className="text-gray-500 mb-8">
              We've locked in your estimated swap value of <strong>{formatCurrency(estimatedValue || 0)}</strong> toward your UK Used upgrade. You will receive an email shortly with dispatch instructions.
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
                Swap & Upgrade
              </h1>
              <p className="text-lg text-gray-500">
                Get an instant valuation to swap your current device for a UK Used upgrade.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-start mb-6 border border-red-100">
                  <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-apple-dark mb-2">Current Device Model</label>
                  <select
                    required
                    value={deviceModel}
                    onChange={(e) => setDeviceModel(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-xl px-4 py-3 text-apple-dark outline-none transition-all appearance-none"
                  >
                    <option value="" disabled>Select your device...</option>
                    <option value="iPhone 15 Pro">iPhone 15 Pro</option>
                    <option value="iPhone 14">iPhone 14</option>
                    <option value="iPhone 13">iPhone 13</option>
                    <option value="MacBook Air M2">MacBook Air M2</option>
                    <option value="iPad Pro 11-inch">iPad Pro 11-inch</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-apple-dark mb-2">Storage Capacity</label>
                  <select
                    required
                    value={storage}
                    onChange={(e) => setStorage(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-xl px-4 py-3 text-apple-dark outline-none transition-all appearance-none"
                  >
                    <option value="" disabled>Select storage...</option>
                    <option value="128GB">128GB</option>
                    <option value="256GB">256GB</option>
                    <option value="512GB">512GB</option>
                    <option value="1TB">1TB</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-apple-dark mb-2">Condition</label>
                  <select
                    required
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-xl px-4 py-3 text-apple-dark outline-none transition-all appearance-none"
                  >
                    <option value="" disabled>Select condition...</option>
                    <option value="A">Flawless (Looks brand new)</option>
                    <option value="B">Good (Normal wear and tear)</option>
                    <option value="C">Cracked or Damaged</option>
                  </select>
                </div>

                {estimatedValue !== null && (
                  <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 text-center mt-6 animate-in fade-in">
                    <p className="text-sm font-semibold text-purple-800 mb-1">Estimated Swap Value</p>
                    <p className="text-4xl font-bold text-purple-900">{formatCurrency(estimatedValue)}</p>
                    <p className="text-xs text-purple-600 mt-2">Value to be deducted from your new UK Used device.</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting || estimatedValue === null}
                  className="w-full bg-apple-dark text-white py-4 rounded-xl font-medium hover:bg-black transition-colors flex items-center justify-center disabled:opacity-70 mt-4"
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

// "use client";

// import { useState, useEffect } from "react";
// import { supabase } from "@/lib/supabase";
// import { useRouter } from "next/navigation";
// import { apiService } from "@/services/api";
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

//   // Dynamic Region & Currency State
//   const [locale, setLocale] = useState("en-US");
//   const [currencyCode, setCurrencyCode] = useState("USD");

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

//     // Detect user region/currency dynamically to prevent hydration mismatch
//     if (typeof window !== "undefined") {
//       const userLocale = navigator.language || "en-US";
//       setLocale(userLocale);

//       const region = userLocale.split('-')[1] || userLocale;
//       let detectedCurrency = "USD";

//       if (['GB'].includes(region)) detectedCurrency = "GBP";
//       else if (['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'GR', 'IE', 'PT', 'FI'].includes(region)) detectedCurrency = "EUR";
//       else if (['CA'].includes(region)) detectedCurrency = "CAD";
//       else if (['AU'].includes(region)) detectedCurrency = "AUD";
//       else if (['JP'].includes(region)) detectedCurrency = "JPY";
//       else if (['IN'].includes(region)) detectedCurrency = "INR";

//       setCurrencyCode(detectedCurrency);
//     }
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
//       return `$${value}`; // Fallback
//     }
//   };

//   // Simple mock pricing logic based on selections
//   useEffect(() => {
//     if (deviceModel && condition) {
//       let basePrice = 0;
//       if (deviceModel.includes("15")) basePrice = 600;
//       else if (deviceModel.includes("14")) basePrice = 450;
//       else if (deviceModel.includes("13")) basePrice = 300;
//       else if (deviceModel.includes("MacBook")) basePrice = 700;
//       else if (deviceModel.includes("iPad")) basePrice = 250;
//       else basePrice = 100;

//       // Adjusted to match the new letter grades (A, B, C)
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
//       // Bypassing the Python backend to insert directly into Supabase.
//       // The `condition` variable is now a letter grade (e.g., "A", "B", "C") which fits the varchar(2) limit.
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
//       // We will now see the EXACT database error if it fails
//       setError(
//         "Database Error: " + (err.message || "Unknown error")
//       );
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
//     <div className="min-h-screen bg-apple-gray flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
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
//             <h2 className="text-3xl font-bold text-apple-dark mb-4">Offer Submitted!</h2>
//             <p className="text-gray-500 mb-8">
//               We've locked in your estimated trade-in value of <strong>{formatCurrency(estimatedValue || 0)}</strong>. You will receive an email shortly with shipping instructions.
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
//                 Trade In & Upgrade
//               </h1>
//               <p className="text-lg text-gray-500">
//                 Get an instant estimate for your current device.
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
//                   <label className="block text-sm font-semibold text-apple-dark mb-2">Device Model</label>
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
//                     <p className="text-sm font-semibold text-purple-800 mb-1">Estimated Trade-In Value</p>
//                     <p className="text-4xl font-bold text-purple-900">{formatCurrency(estimatedValue)}</p>
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
//                     "Accept Offer & Continue"
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