// "use client";

// import { useState, useEffect, Suspense } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { supabase } from "@/lib/supabase";
// import type { Session } from "@supabase/supabase-js";
// import { Loader2, ArrowRight, CheckCircle2, AlertCircle, Wrench, Shield, Truck, Zap } from "lucide-react";
// import Link from "next/link";
// import { apiService } from "@/services/api";

// function BookRepairContent() {
// const router = useRouter();
// const searchParams = useSearchParams();

// const [session, setSession] = useState<Session | null>(null);
// const [loadingAuth, setLoadingAuth] = useState(true);

// // Serial/IMEI Lookup State
// const [serialNumber, setSerialNumber] = useState("");
// const [isVerifying, setIsVerifying] = useState(false);
// const [verifySuccess, setVerifySuccess] = useState<string | null>(null);

// // Form State
// const [deviceModel, setDeviceModel] = useState("");
// const [issueType, setIssueType] = useState("");
// const [description, setDescription] = useState("");

// // Phase 1 Upsell States
// const [partsQuality, setPartsQuality] = useState("Standard");
// const [deliveryMethod, setDeliveryMethod] = useState("Walk-in (Store)");

// const [isSubmitting, setIsSubmitting] = useState(false);
// const [isSuccess, setIsSuccess] = useState(false);
// const [error, setError] = useState<string | null>(null);
// const [quote, setQuote] = useState(0);

// // Deep Linking Logic: Pre-select delivery method based on URL parameter
// useEffect(() => {
// const deliveryParam = searchParams.get("delivery");
// if (deliveryParam === "dispatch") {
// setDeliveryMethod("VIP Dispatch (Pickup & Return)");
// } else if (deliveryParam === "home") {
// setDeliveryMethod("Home/Office Visit");
// } else {
// setDeliveryMethod("Walk-in (Store)");
// }
// }, [searchParams]);

// // Authenticate User
// useEffect(() => {
// supabase.auth.getSession().then(({ data: { session } }) => {
// if (!session) {
// router.push("/login");
// } else {
// setSession(session);
// setLoadingAuth(false);
// }
// });
// }, [router]);

// // Base Prices for logic calculations
// const baseRepairCosts: Record<string, number> = {
// "Screen Replacement": 80000,
// "Battery Replacement": 45000,
// "Water Damage / Logic Board": 150000,
// "Camera Repair": 60000,
// "Charging Port": 35000,
// "Other": 20000
// };

// const deliveryCosts: Record<string, number> = {
// "Walk-in (Store)": 0,
// "VIP Dispatch (Pickup & Return)": 5000,
// "Home/Office Visit": 20000
// };

// // Calculate dynamic quote when selections change
// useEffect(() => {
// if (issueType) {
// let total = baseRepairCosts[issueType] || 20000;

//   // Premium parts markup (+30%)
//   if (partsQuality === "Premium") {
//     total = Math.round(total * 1.3);
//   }
  
//   // Add dispatch logistics fee
//   total += deliveryCosts[deliveryMethod] || 0;
  
//   setQuote(total);
// } else {
//   setQuote(0);
// }


// }, [issueType, partsQuality, deliveryMethod]);

// const handleSubmit = async (e: React.FormEvent) => {
// e.preventDefault();
// if (!session) return;

// setIsSubmitting(true);
// setError(null);

// // Bundle the upsell selections directly into the issue_type string 
// const fullIssueDescription = `${issueType} | ${partsQuality} Parts | ${deliveryMethod}`;

// try {
//   await apiService.createTicket({
//     user_id: session.user.id,
//     device_model: deviceModel,
//     issue_type: fullIssueDescription,
//     quote_amount: quote
//   });
//   setIsSuccess(true);
// } catch (err: any) {
//   setError(err.message || "Something went wrong. Please try again.");
// } finally {
//   setIsSubmitting(false);
// }


// };

// if (loadingAuth) {
// return (
//   <div className="min-h-[60vh] flex items-center justify-center">
//     <Loader2 className="w-8 h-8 text-apple-blue animate-spin" />
//   </div>
// );
// }

// if (isSuccess) {
// return (
//   <div className="max-w-2xl mx-auto px-4 py-20 text-center">
//     <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
//     <h1 className="text-3xl font-bold text-apple-dark mb-4">Repair Ticket Created!</h1>
//     <p className="text-gray-500 mb-8">
//       Your repair request for the {deviceModel} has been successfully received. Estimated cost is ₦{quote.toLocaleString()}.
//     </p>
//     <Link href="/dashboard" className="inline-flex items-center bg-apple-dark text-white px-6 py-3 rounded-xl font-medium hover:bg-black transition-colors">
//       Go to Dashboard
//       <ArrowRight className="w-5 h-5 ml-2" />
//     </Link>
//   </div>
// );
// }

// return (
//   <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">


//     <div className="text-center mb-10">
//       <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
//         <Wrench className="w-8 h-8 text-apple-blue" />
//       </div>
//       <h1 className="text-4xl font-bold tracking-tight text-apple-dark mb-4">
//         Book a Repair
//       </h1>
//       <p className="text-lg text-gray-500">
//         Fast, reliable service delivered straight to you.
//       </p>
//     </div>

//     <section className="bg-apple-dark rounded-[2rem] p-8 sm:p-12 mb-10 shadow-2xl">
//       <p className="text-gray-400 text-lg mb-8 max-w-xl leading-relaxed">
//         Don't let busy roads delay your repair. Choose one of our premium logistics options at checkout and get your device fixed without leaving your seat.
//       </p>

//       <div className="grid sm:grid-cols-2 gap-6 mb-8">
//         <Link href="/book?delivery=dispatch" className="flex items-start space-x-4 bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-all hover:scale-105 cursor-pointer">
//           <div className="bg-blue-500/20 p-3 rounded-xl shrink-0">
//             <Truck className="w-6 h-6 text-blue-400" />
//           </div>
//           <div>
//             <h4 className="text-white font-semibold mb-1">VIP Dispatch</h4>
//             <p className="text-sm text-gray-400">Secure pickup from your location and same-day return delivery.</p>
//           </div>
//         </Link>
//         <Link href="/book?delivery=home" className="flex items-start space-x-4 bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-all hover:scale-105 cursor-pointer">
//           <div className="bg-purple-500/20 p-3 rounded-xl shrink-0">
//             <Zap className="w-6 h-6 text-purple-400" />
//           </div>
//           <div>
//             <h4 className="text-white font-semibold mb-1">Home Visit</h4>
//             <p className="text-sm text-gray-400">A verified engineer arrives and repairs your device on the spot.</p>
//           </div>
//         </Link>
//       </div>

//       <Link href="/book" className="inline-flex items-center justify-center bg-white text-apple-dark px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors group shadow-lg">
//         Choose a service option
//         <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
//       </Link>
//     </section>

//     <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-gray-100">
//       {error && (
//         <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center text-sm mb-6 border border-red-100">
//           <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
//           <span className="text-sm">{error}</span>
//         </div>
//       )}

//       {/* --- Serial Number Lookup Section --- */}
//       <div className="mb-8 p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
//         <label className="block text-sm font-semibold text-apple-dark mb-2">Have a Serial Number or IMEI?</label>
//         <p className="text-xs text-gray-500 mb-4">Enter it below to automatically find your exact device details.</p>
//         <div className="flex flex-col sm:flex-row gap-3">
//           <input
//             type="text"
//             value={serialNumber}
//             onChange={(e) => setSerialNumber(e.target.value)}
//             placeholder="e.g. 35XXXX..."
//             className="flex-1 bg-white border border-gray-200 focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 rounded-xl px-4 py-3 text-apple-dark outline-none transition-all uppercase"
//           />
//           <button
//             type="button"
//             onClick={async () => {
//               if(!serialNumber) return;
//               setIsVerifying(true);
//               setError(null);
//               setVerifySuccess(null);
//               try {
//                 const data = await apiService.checkImei(serialNumber);
//                 setDeviceModel(data.model); // Auto-fill the manual input below!
//                 setVerifySuccess(`Device found: ${data.model}`);
//               } catch (err: any) {
//                 setError(err.message || "Could not find device details.");
//               } finally {
//                 setIsVerifying(false);
//               }
//             }}
//             disabled={isVerifying || !serialNumber}
//             className="bg-apple-blue text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-70 flex items-center justify-center whitespace-nowrap shadow-sm"
//           >
//             {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Device"}
//           </button>
//         </div>
//         {verifySuccess && (
//           <p className="text-sm text-green-600 font-medium mt-3 flex items-center animate-in fade-in">
//             <CheckCircle2 className="w-4 h-4 mr-1"/> {verifySuccess}
//           </p>
//         )}
//       </div>
//       {/* ---------------------------------- */}

//       <form onSubmit={handleSubmit} className="space-y-8">
//         <div className="space-y-6">
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">Device Model</label>
//             <input
//               type="text"
//               required
//               value={deviceModel}
//               onChange={(e) => setDeviceModel(e.target.value)}
//               placeholder="e.g., iPhone 13 Pro Max, MacBook Air M1"
//               className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 rounded-xl px-4 py-3 text-apple-dark outline-none transition-all"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">What seems to be the issue?</label>
//             <select
//               required
//               value={issueType}
//               onChange={(e) => setIssueType(e.target.value)}
//               className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 rounded-xl px-4 py-3 text-apple-dark outline-none transition-all appearance-none"
//             >
//               <option value="" disabled>Select an issue...</option>
//               <option value="Screen Replacement">Screen Replacement</option>
//               <option value="Battery Replacement">Battery Replacement</option>
//               <option value="Water Damage / Logic Board">Water Damage / Logic Board Emergency</option>
//               <option value="Camera Repair">Camera Repair</option>
//               <option value="Charging Port">Charging Port</option>
//               <option value="Other">Other / Not Sure</option>
//             </select>
//             {issueType === "Water Damage / Logic Board" && (
//                <p className="text-xs text-red-500 font-medium mt-2 flex items-center">
//                  <AlertCircle className="w-3 h-3 mr-1" /> Includes mandatory ₦15,000 emergency diagnostic fee.
//                </p>
//             )}
//           </div>
//         </div>

//         <hr className="border-gray-100" />

//         {/* --- PARTS QUALITY UPSELL --- */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-4">Choose Parts Quality</label>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div 
//               onClick={() => setPartsQuality("Standard")}
//               className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${partsQuality === "Standard" ? "border-apple-blue bg-blue-50/30" : "border-gray-100 hover:border-gray-300"}`}
//             >
//               <div className="flex items-center justify-between mb-1">
//                 <span className="font-semibold text-apple-dark">Standard Aftermarket</span>
//                 {partsQuality === "Standard" && <CheckCircle2 className="w-5 h-5 text-apple-blue" />}
//               </div>
//               <p className="text-xs text-gray-500">High quality 3rd-party replacement parts. Affordable and reliable.</p>
//             </div>
            
//             <div 
//               onClick={() => setPartsQuality("Premium")}
//               className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${partsQuality === "Premium" ? "border-apple-blue bg-blue-50/30" : "border-gray-100 hover:border-gray-300"}`}
//             >
//               <div className="flex items-center justify-between mb-1">
//                 <span className="font-semibold text-apple-dark flex items-center">
//                   <Shield className="w-4 h-4 mr-1 text-apple-blue" /> Premium OEM
//                 </span>
//                 {partsQuality === "Premium" && <CheckCircle2 className="w-5 h-5 text-apple-blue" />}
//               </div>
//               <p className="text-xs text-gray-500">Original quality parts (OLED/Retina). Recommended for maximum longevity.</p>
//             </div>
//           </div>
//         </div>

//         {/* --- DELIVERY METHOD UPSELL --- */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-4">Delivery & Service Method</label>
//           <div className="space-y-3">
//             <label className={`flex items-start p-4 rounded-2xl border-2 cursor-pointer transition-all ${deliveryMethod === "Walk-in (Store)" ? "border-apple-blue bg-blue-50/30" : "border-gray-100 hover:border-gray-300"}`}>
//               <input type="radio" className="mt-1" name="delivery" checked={deliveryMethod === "Walk-in (Store)"} onChange={() => setDeliveryMethod("Walk-in (Store)")} />
//               <div className="ml-3">
//                 <p className="font-semibold text-apple-dark">Walk-in to Physical Lab <span className="text-sm font-normal text-gray-500 ml-2">(Free)</span></p>
//                 <p className="text-xs text-gray-500">Drop off your device securely at our physical location.</p>
//               </div>
//             </label>
            
//             <label className={`flex items-start p-4 rounded-2xl border-2 cursor-pointer transition-all ${deliveryMethod === "VIP Dispatch (Pickup & Return)" ? "border-apple-blue bg-blue-50/30" : "border-gray-100 hover:border-gray-300"}`}>
//               <input type="radio" className="mt-1" name="delivery" checked={deliveryMethod === "VIP Dispatch (Pickup & Return)"} onChange={() => setDeliveryMethod("VIP Dispatch (Pickup & Return)")} />
//               <div className="ml-3">
//                 <p className="font-semibold text-apple-dark flex items-center">
//                    VIP Dispatch
//                    <span className="text-sm font-normal text-gray-500 ml-2">(+₦5,000)</span>
//                 </p>
//                 <p className="text-xs text-gray-500">We pick up your device from your location and return it fixed.</p>
//               </div>
//             </label>

//             <label className={`flex items-start p-4 rounded-2xl border-2 cursor-pointer transition-all ${deliveryMethod === "Home/Office Visit" ? "border-apple-blue bg-blue-50/30" : "border-gray-100 hover:border-gray-300"}`}>
//               <input type="radio" className="mt-1" name="delivery" checked={deliveryMethod === "Home/Office Visit"} onChange={() => setDeliveryMethod("Home/Office Visit")} />
//               <div className="ml-3">
//                 <p className="font-semibold text-apple-dark flex items-center">
//                    Engineer Home/Office Visit
//                    <span className="text-sm font-normal text-gray-500 ml-2">(+₦20,000)</span>
//                 </p>
//                 <p className="text-xs text-gray-500">Skip the traffic. An engineer comes to you and fixes it on the spot.</p>
//               </div>
//             </label>
//           </div>
//         </div>

//         <hr className="border-gray-100" />

//         {quote > 0 && (
//           <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-center justify-between animate-in fade-in">
//             <div>
//               <p className="text-sm font-semibold text-blue-800">Estimated Total Quote</p>
//               <p className="text-xs text-blue-600 mt-1">Includes parts, labor, and logistics.</p>
//             </div>
//             <div className="text-right">
//               <p className="text-3xl font-bold text-apple-blue">₦{quote.toLocaleString()}</p>
//             </div>
//           </div>
//         )}

//         <button
//           type="submit"
//           disabled={isSubmitting || !deviceModel || !issueType}
//           className="w-full bg-apple-dark text-white py-4 rounded-xl font-medium hover:bg-black transition-colors flex items-center justify-center disabled:opacity-70 group"
//         >
//           {isSubmitting ? (
//             <Loader2 className="w-6 h-6 animate-spin" />
//           ) : (
//             <>
//               Confirm Booking 
//               <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
//             </>
//           )}
//         </button>
//       </form>
//     </div>
//   </div>


// );
// }

// // Wrap the main content in a Suspense boundary to prevent Next.js build errors (CSR Bailout)
// export default function BookRepairPage() {
// return (
// <Suspense fallback={
//   <div className="min-h-[60vh] flex items-center justify-center">
//     <Loader2 className="w-8 h-8 text-apple-blue animate-spin" />
//   </div>
// }>
//   <BookRepairContent />
// </Suspense>
// );
// }

"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import {
  Loader2,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Shield,
  Truck,
  Zap,
  Package,
} from "lucide-react";
import Link from "next/link";
import { apiService } from "@/services/api";

const BASE_REPAIR_COSTS: Record<string, number> = {
  "Screen Replacement": 80000,
  "Battery Replacement": 45000,
  "Water Damage / Logic Board": 150000,
  "Camera Repair": 60000,
  "Charging Port": 35000,
  Other: 20000,
};

const DELIVERY_COSTS: Record<string, number> = {
  "Walk-in (Store)": 0,
  "VIP Dispatch (Pickup & Return)": 5000,
  "Home/Office Visit": 20000,
  "Interstate Waybill (You ship to us)": 0, // Customer pays shipping company directly
};

function BookRepairContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [session, setSession] = useState<Session | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Serial/IMEI Lookup State
  const [serialNumber, setSerialNumber] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifySuccess, setVerifySuccess] = useState<string | null>(null);

  // Form State
  const [deviceModel, setDeviceModel] = useState("");
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");

  // Phase 1 Upsell States
  const [partsQuality, setPartsQuality] = useState<"Standard" | "Premium">(
    "Standard"
  );
  const [deliveryMethod, setDeliveryMethod] = useState("Walk-in (Store)");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quote, setQuote] = useState<number>(0);

  // Deep Linking Logic: Pre-select delivery method based on URL parameter
  useEffect(() => {
    const deliveryParam = searchParams.get("delivery");
    if (deliveryParam === "dispatch") {
      setDeliveryMethod("VIP Dispatch (Pickup & Return)");
    } else if (deliveryParam === "home") {
      setDeliveryMethod("Home/Office Visit");
    } else if (deliveryParam === "waybill") {
      setDeliveryMethod("Interstate Waybill (You ship to us)");
    } else {
      setDeliveryMethod("Walk-in (Store)");
    }
  }, [searchParams]);

  // Authenticate User
  useEffect(() => {
    let isMounted = true;
    supabase.auth.getSession().then(({ data: { session: activeSession } }) => {
      if (!isMounted) return;
      if (!activeSession) {
        router.push("/login");
      } else {
        setSession(activeSession);
        setLoadingAuth(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [router]);

  // Calculate dynamic quote when selections change
  useEffect(() => {
    if (issueType) {
      let total = BASE_REPAIR_COSTS[issueType] ?? 20000;

      // Premium parts markup (+30%)
      if (partsQuality === "Premium") {
        total = Math.round(total * 1.3);
      }

      // Add dispatch logistics fee
      total += DELIVERY_COSTS[deliveryMethod] ?? 0;

      setQuote(total);
    } else {
      setQuote(0);
    }
  }, [issueType, partsQuality, deliveryMethod]);

  const handleVerifyDevice = async () => {
    const cleaned = serialNumber.trim().toUpperCase();
    if (!cleaned) return;

    setIsVerifying(true);
    setError(null);
    setVerifySuccess(null);

    try {
      const data = await apiService.checkImei(cleaned);
      if (data?.model) {
        setDeviceModel(data.model);
        setVerifySuccess("Device found: " + data.model);
      } else {
        setError("Device verified, but model name could not be determined.");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Could not find device details.";
      setError(message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    setIsSubmitting(true);
    setError(null);

    const trimmedNotes = description.trim();
    const fullIssueDescription = trimmedNotes
      ? issueType +
        " | " +
        partsQuality +
        " Parts | " +
        deliveryMethod +
        " | Notes: " +
        trimmedNotes
      : issueType + " | " + partsQuality + " Parts | " + deliveryMethod;

    try {
      await apiService.createTicket({
        user_id: session.user.id,
        device_model: deviceModel.trim(),
        issue_type: fullIssueDescription,
        quote_amount: quote,
      });
      setIsSuccess(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-apple-gray">
        <Loader2 className="w-8 h-8 animate-spin text-apple-blue" />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-apple-gray flex flex-col items-center py-12 px-4 animate-in fade-in zoom-in duration-300">
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 max-w-2xl w-full">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-apple-dark mb-4">
            Repair Ticket Created!
          </h2>
          <p className="text-gray-500 mb-8">
            Your repair request for the <strong>{deviceModel}</strong> has been
            successfully received. Estimated cost is{" "}
            <strong>&#8358;{quote.toLocaleString()}</strong>.
          </p>

          {/* Special instructions for Waybill customers */}
          {deliveryMethod === "Interstate Waybill (You ship to us)" && (
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-left mb-8">
              <h3 className="font-bold text-blue-900 flex items-center mb-2">
                <Package className="w-5 h-5 mr-2" /> Next Steps for Waybill
              </h3>
              <p className="text-sm text-blue-800 mb-3">
                Please package your device securely. You can view our
                recommended shipping partners and terminal addresses in our
                Waybill Guide.
              </p>
              <Link
                href="/waybill"
                className="text-sm font-bold text-apple-blue hover:underline"
              >
                View Waybill Guide &rarr;
              </Link>
            </div>
          )}

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
            <Link
              href="/dashboard"
              className="bg-apple-dark text-white px-8 py-4 rounded-full font-medium hover:bg-black transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-apple-gray flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Wrench className="w-8 h-8 text-apple-blue" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-apple-dark mb-4">
            Book a Repair
          </h1>
          <p className="text-lg text-gray-500">
            Fast, reliable service delivered straight to you.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-gray-100">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center text-sm mb-6 border border-red-100">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* --- Serial Number Lookup Section --- */}
          <div className="mb-8 p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
            <label
              htmlFor="serial-lookup"
              className="block text-sm font-semibold text-apple-dark mb-2"
            >
              Have a Serial Number or IMEI?
            </label>
            <p className="text-xs text-gray-500 mb-4">
              Enter it below to automatically find your exact device details.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="serial-lookup"
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="e.g. 35XXXX..."
                className="flex-1 bg-white border border-gray-200 focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 rounded-xl px-4 py-3 text-apple-dark outline-none transition-all uppercase"
              />
              <button
                type="button"
                onClick={handleVerifyDevice}
                disabled={isVerifying || !serialNumber.trim()}
                className="bg-apple-blue text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-70 flex items-center justify-center whitespace-nowrap shadow-sm"
              >
                {isVerifying ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Verify Device"
                )}
              </button>
            </div>
            {verifySuccess && (
              <p className="text-sm text-green-600 font-medium mt-3 flex items-center animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 mr-1" /> {verifySuccess}
              </p>
            )}
          </div>
          {/* ---------------------------------- */}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="device-model"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Device Model
                </label>
                <input
                  id="device-model"
                  type="text"
                  required
                  value={deviceModel}
                  onChange={(e) => setDeviceModel(e.target.value)}
                  placeholder="e.g., iPhone 13 Pro Max, MacBook Air M1"
                  className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 rounded-xl px-4 py-3 text-apple-dark outline-none transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="issue-type"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  What seems to be the issue?
                </label>
                <select
                  id="issue-type"
                  required
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 rounded-xl px-4 py-3 text-apple-dark outline-none transition-all appearance-none"
                >
                  <option value="" disabled>
                    Select an issue...
                  </option>
                  <option value="Screen Replacement">Screen Replacement</option>
                  <option value="Battery Replacement">
                    Battery Replacement
                  </option>
                  <option value="Water Damage / Logic Board">
                    Water Damage / Logic Board Emergency
                  </option>
                  <option value="Camera Repair">Camera Repair</option>
                  <option value="Charging Port">Charging Port</option>
                  <option value="Other">Other / Not Sure</option>
                </select>
                {issueType === "Water Damage / Logic Board" && (
                  <p className="text-xs text-red-500 font-medium mt-2 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" /> Includes mandatory
                    &#8358;15,000 emergency diagnostic fee.
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="issue-notes"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Additional Details{" "}
                  <span className="font-normal text-gray-400">(Optional)</span>
                </label>
                <textarea
                  id="issue-notes"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe any symptoms, liquid exposure, or previous repairs..."
                  className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 rounded-xl px-4 py-3 text-apple-dark outline-none transition-all resize-none"
                />
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* --- PARTS QUALITY UPSELL --- */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Choose Parts Quality
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPartsQuality("Standard")}
                  className={
                    "text-left p-4 rounded-2xl border-2 cursor-pointer transition-all " +
                    (partsQuality === "Standard"
                      ? "border-apple-blue bg-blue-50/30"
                      : "border-gray-100 hover:border-gray-300")
                  }
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-apple-dark">
                      Standard Aftermarket
                    </span>
                    {partsQuality === "Standard" && (
                      <CheckCircle2 className="w-5 h-5 text-apple-blue" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    High quality 3rd-party replacement parts. Affordable and
                    reliable.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPartsQuality("Premium")}
                  className={
                    "text-left p-4 rounded-2xl border-2 cursor-pointer transition-all " +
                    (partsQuality === "Premium"
                      ? "border-apple-blue bg-blue-50/30"
                      : "border-gray-100 hover:border-gray-300")
                  }
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-apple-dark flex items-center">
                      <Shield className="w-4 h-4 mr-1 text-apple-blue" /> Premium
                      OEM
                    </span>
                    {partsQuality === "Premium" && (
                      <CheckCircle2 className="w-5 h-5 text-apple-blue" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Original quality parts (OLED/Retina). Recommended for
                    maximum longevity.
                  </p>
                </button>
              </div>
            </div>

            {/* --- DELIVERY METHOD UPSELL --- */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Delivery &amp; Service Method
              </label>
              <div className="space-y-3">
                <label
                  className={
                    "flex items-start p-4 rounded-2xl border-2 cursor-pointer transition-all " +
                    (deliveryMethod === "Walk-in (Store)"
                      ? "border-apple-blue bg-blue-50/30"
                      : "border-gray-100 hover:border-gray-300")
                  }
                >
                  <input
                    type="radio"
                    className="mt-1"
                    name="delivery"
                    checked={deliveryMethod === "Walk-in (Store)"}
                    onChange={() => setDeliveryMethod("Walk-in (Store)")}
                  />
                  <div className="ml-3">
                    <p className="font-semibold text-apple-dark">
                      Walk-in to Physical Lab{" "}
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        (Free)
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Drop off your device securely at our physical location.
                    </p>
                  </div>
                </label>

                <label
                  className={
                    "flex items-start p-4 rounded-2xl border-2 cursor-pointer transition-all " +
                    (deliveryMethod === "VIP Dispatch (Pickup & Return)"
                      ? "border-apple-blue bg-blue-50/30"
                      : "border-gray-100 hover:border-gray-300")
                  }
                >
                  <input
                    type="radio"
                    className="mt-1"
                    name="delivery"
                    checked={
                      deliveryMethod === "VIP Dispatch (Pickup & Return)"
                    }
                    onChange={() =>
                      setDeliveryMethod("VIP Dispatch (Pickup & Return)")
                    }
                  />
                  <div className="ml-3">
                    <p className="font-semibold text-apple-dark flex items-center">
                      VIP Dispatch{" "}
                      <Truck className="w-4 h-4 ml-2 text-gray-400" />
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        (+&#8358;5,000)
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">
                      We pick up your device from your location and return it
                      fixed.
                    </p>
                  </div>
                </label>

                <label
                  className={
                    "flex items-start p-4 rounded-2xl border-2 cursor-pointer transition-all " +
                    (deliveryMethod === "Home/Office Visit"
                      ? "border-apple-blue bg-blue-50/30"
                      : "border-gray-100 hover:border-gray-300")
                  }
                >
                  <input
                    type="radio"
                    className="mt-1"
                    name="delivery"
                    checked={deliveryMethod === "Home/Office Visit"}
                    onChange={() => setDeliveryMethod("Home/Office Visit")}
                  />
                  <div className="ml-3">
                    <p className="font-semibold text-apple-dark flex items-center">
                      Engineer Home/Office Visit{" "}
                      <Zap className="w-4 h-4 ml-2 text-yellow-500" />
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        (+&#8358;20,000)
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Skip the traffic. An engineer comes to you and fixes it on
                      the spot.
                    </p>
                  </div>
                </label>

                <label
                  className={
                    "flex items-start p-4 rounded-2xl border-2 cursor-pointer transition-all " +
                    (deliveryMethod === "Interstate Waybill (You ship to us)"
                      ? "border-apple-blue bg-blue-50/30"
                      : "border-gray-100 hover:border-gray-300")
                  }
                >
                  <input
                    type="radio"
                    className="mt-1"
                    name="delivery"
                    checked={
                      deliveryMethod === "Interstate Waybill (You ship to us)"
                    }
                    onChange={() =>
                      setDeliveryMethod("Interstate Waybill (You ship to us)")
                    }
                  />
                  <div className="ml-3">
                    <p className="font-semibold text-apple-dark flex items-center">
                      Interstate Waybill (You ship to us){" "}
                      <Package className="w-4 h-4 ml-2 text-purple-500" />
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        (Pay Shipper)
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Ship via GIGL, DHL, or GUO. We will send you our terminal
                      receiving address after booking.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <hr className="border-gray-100" />

            {quote > 0 && (
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-center justify-between animate-in fade-in">
                <div>
                  <p className="text-sm font-semibold text-blue-800">
                    Estimated Total Quote
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Includes parts, labor, and logistics.
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-apple-blue">
                    &#8358;{quote.toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !deviceModel.trim() || !issueType}
              className="w-full bg-apple-dark text-white py-4 rounded-xl font-medium hover:bg-black transition-colors flex items-center justify-center disabled:opacity-70 group"
            >
              {isSubmitting ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Confirm Booking
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Wrap the main content in a Suspense boundary to prevent Next.js build errors (CSR Bailout)
export default function BookRepairPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-apple-gray">
          <Loader2 className="w-8 h-8 animate-spin text-apple-blue" />
        </div>
      }
    >
      <BookRepairContent />
    </Suspense>
  );
}