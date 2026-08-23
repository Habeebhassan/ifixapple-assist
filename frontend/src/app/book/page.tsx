
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2, ArrowRight, CheckCircle2, AlertCircle, Wrench, Shield, Truck, Zap } from "lucide-react";
import Link from "next/link";
import { apiService } from "@/services/api";

export default function BookRepairPage() {
  const router = useRouter();
  
  const [session, setSession] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  
  // Serial/IMEI Lookup State
  const [serialNumber, setSerialNumber] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifySuccess, setVerifySuccess] = useState<string | null>(null);

  // Form State
  const [deviceModel, setDeviceModel] = useState("");
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  
  // Phase 1 Upsell States (Lagos Strategy)
  const [partsQuality, setPartsQuality] = useState("Standard");
  const [deliveryMethod, setDeliveryMethod] = useState("Walk-in (Ajah Store)");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quote, setQuote] = useState<number>(0);

  // Authenticate User
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/login");
      } else {
        setSession(session);
        setLoadingAuth(false);
      }
    });
  }, [router]);

  // Base Prices for logic calculations
  const baseRepairCosts: Record<string, number> = {
    "Screen Replacement": 80000,
    "Battery Replacement": 45000,
    "Water Damage / Logic Board": 150000,
    "Camera Repair": 60000,
    "Charging Port": 35000,
    "Other": 20000
  };

  const deliveryCosts: Record<string, number> = {
    "Walk-in (Ajah Store)": 0,
    "VIP Dispatch (Pickup & Return)": 5000,
    "Home/Office Visit": 20000
  };

  // Calculate dynamic quote when selections change
  useEffect(() => {
    if (issueType) {
      let total = baseRepairCosts[issueType] || 20000;
      
      // Premium parts markup (+30%)
      if (partsQuality === "Premium") {
        total = Math.round(total * 1.3);
      }
      
      // Add dispatch logistics fee
      total += deliveryCosts[deliveryMethod];
      
      setQuote(total);
    } else {
      setQuote(0);
    }
  }, [issueType, partsQuality, deliveryMethod]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    
    setIsSubmitting(true);
    setError(null);

    // Bundle the upsell selections directly into the issue_type string 
    // so it saves cleanly to the existing Supabase schema!
    const fullIssueDescription = `${issueType} | ${partsQuality} Parts | ${deliveryMethod}`;

    try {
      await apiService.createTicket({
        user_id: session.user.id,
        device_model: deviceModel,
        issue_type: fullIssueDescription,
        quote_amount: quote
      });
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
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
          <h2 className="text-3xl font-bold text-apple-dark mb-4">Repair Ticket Created!</h2>
          <p className="text-gray-500 mb-8">
            Your repair request for the <strong>{deviceModel}</strong> has been successfully received. Estimated cost is <strong>₦{quote.toLocaleString()}</strong>.
          </p>
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
            Fast, reliable service right here in Lagos.
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
            <label className="block text-sm font-semibold text-apple-dark mb-2">Have a Serial Number or IMEI?</label>
            <p className="text-xs text-gray-500 mb-4">Enter it below to automatically find your exact device details.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="e.g. C02X..."
                className="flex-1 bg-white border border-gray-200 focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 rounded-xl px-4 py-3 text-apple-dark outline-none transition-all uppercase"
              />
              <button
                type="button"
                onClick={async () => {
                  if(!serialNumber) return;
                  setIsVerifying(true);
                  setError(null);
                  setVerifySuccess(null);
                  try {
                    const data = await apiService.checkImei(serialNumber);
                    setDeviceModel(data.model); // Auto-fill the manual input below!
                    setVerifySuccess(`Device found: ${data.model}`);
                  } catch (err: any) {
                    setError(err.message || "Could not find device details.");
                  } finally {
                    setIsVerifying(false);
                  }
                }}
                disabled={isVerifying || !serialNumber}
                className="bg-apple-blue text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-70 flex items-center justify-center whitespace-nowrap shadow-sm"
              >
                {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Device"}
              </button>
            </div>
            {verifySuccess && (
              <p className="text-sm text-green-600 font-medium mt-3 flex items-center animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 mr-1"/> {verifySuccess}
              </p>
            )}
          </div>
          {/* ---------------------------------- */}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Device Model</label>
                <input
                  type="text"
                  required
                  value={deviceModel}
                  onChange={(e) => setDeviceModel(e.target.value)}
                  placeholder="e.g., iPhone 13 Pro Max, MacBook Air M1"
                  className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 rounded-xl px-4 py-3 text-apple-dark outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">What seems to be the issue?</label>
                <select
                  required
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 rounded-xl px-4 py-3 text-apple-dark outline-none transition-all appearance-none"
                >
                  <option value="" disabled>Select an issue...</option>
                  <option value="Screen Replacement">Screen Replacement</option>
                  <option value="Battery Replacement">Battery Replacement</option>
                  <option value="Water Damage / Logic Board">Water Damage / Logic Board Emergency</option>
                  <option value="Camera Repair">Camera Repair</option>
                  <option value="Charging Port">Charging Port</option>
                  <option value="Other">Other / Not Sure</option>
                </select>
                {issueType === "Water Damage / Logic Board" && (
                   <p className="text-xs text-red-500 font-medium mt-2 flex items-center">
                     <AlertCircle className="w-3 h-3 mr-1" /> Includes mandatory ₦15,000 emergency diagnostic fee.
                   </p>
                )}
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* --- PARTS QUALITY UPSELL --- */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">Choose Parts Quality</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div 
                  onClick={() => setPartsQuality("Standard")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${partsQuality === "Standard" ? "border-apple-blue bg-blue-50/30" : "border-gray-100 hover:border-gray-300"}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-apple-dark">Standard Aftermarket</span>
                    {partsQuality === "Standard" && <CheckCircle2 className="w-5 h-5 text-apple-blue" />}
                  </div>
                  <p className="text-xs text-gray-500">High quality 3rd-party replacement parts. Affordable and reliable.</p>
                </div>
                
                <div 
                  onClick={() => setPartsQuality("Premium")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${partsQuality === "Premium" ? "border-apple-blue bg-blue-50/30" : "border-gray-100 hover:border-gray-300"}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-apple-dark flex items-center">
                      <Shield className="w-4 h-4 mr-1 text-apple-blue" /> Premium OEM
                    </span>
                    {partsQuality === "Premium" && <CheckCircle2 className="w-5 h-5 text-apple-blue" />}
                  </div>
                  <p className="text-xs text-gray-500">Original quality parts (OLED/Retina). Recommended for maximum longevity.</p>
                </div>
              </div>
            </div>

            {/* --- DELIVERY METHOD UPSELL --- */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">Delivery & Service Method</label>
              <div className="space-y-3">
                <label className={`flex items-start p-4 rounded-2xl border-2 cursor-pointer transition-all ${deliveryMethod === "Walk-in (Ajah Store)" ? "border-apple-blue bg-blue-50/30" : "border-gray-100 hover:border-gray-300"}`}>
                  <input type="radio" className="mt-1" name="delivery" checked={deliveryMethod === "Walk-in (Ajah Store)"} onChange={() => setDeliveryMethod("Walk-in (Ajah Store)")} />
                  <div className="ml-3">
                    <p className="font-semibold text-apple-dark">Walk-in to Ajah Store <span className="text-sm font-normal text-gray-500 ml-2">(Free)</span></p>
                    <p className="text-xs text-gray-500">Drop off your device at our physical location.</p>
                  </div>
                </label>
                
                <label className={`flex items-start p-4 rounded-2xl border-2 cursor-pointer transition-all ${deliveryMethod === "VIP Dispatch (Pickup & Return)" ? "border-apple-blue bg-blue-50/30" : "border-gray-100 hover:border-gray-300"}`}>
                  <input type="radio" className="mt-1" name="delivery" checked={deliveryMethod === "VIP Dispatch (Pickup & Return)"} onChange={() => setDeliveryMethod("VIP Dispatch (Pickup & Return)")} />
                  <div className="ml-3">
                    <p className="font-semibold text-apple-dark flex items-center">
                       VIP Dispatch <Truck className="w-4 h-4 ml-2 text-gray-400" />
                       <span className="text-sm font-normal text-gray-500 ml-2">(+₦5,000)</span>
                    </p>
                    <p className="text-xs text-gray-500">We pick up your device from anywhere on the Island and return it fixed.</p>
                  </div>
                </label>

                <label className={`flex items-start p-4 rounded-2xl border-2 cursor-pointer transition-all ${deliveryMethod === "Home/Office Visit" ? "border-apple-blue bg-blue-50/30" : "border-gray-100 hover:border-gray-300"}`}>
                  <input type="radio" className="mt-1" name="delivery" checked={deliveryMethod === "Home/Office Visit"} onChange={() => setDeliveryMethod("Home/Office Visit")} />
                  <div className="ml-3">
                    <p className="font-semibold text-apple-dark flex items-center">
                       Engineer Home/Office Visit <Zap className="w-4 h-4 ml-2 text-yellow-500" />
                       <span className="text-sm font-normal text-gray-500 ml-2">(+₦20,000)</span>
                    </p>
                    <p className="text-xs text-gray-500">Skip the traffic. An engineer comes to you and fixes it on the spot.</p>
                  </div>
                </label>
              </div>
            </div>

            <hr className="border-gray-100" />

            {quote > 0 && (
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-center justify-between animate-in fade-in">
                <div>
                  <p className="text-sm font-semibold text-blue-800">Estimated Total Quote</p>
                  <p className="text-xs text-blue-600 mt-1">Includes parts, labor, and logistics.</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-apple-blue">₦{quote.toLocaleString()}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !deviceModel || !issueType}
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

// "use client";

// import { useState, useEffect } from "react";
// import { supabase } from "@/lib/supabase";
// import { useRouter } from "next/navigation";
// import { Loader2, ArrowRight, CheckCircle2, AlertCircle, Wrench } from "lucide-react";
// import Link from "next/link";
// import { apiService } from "@/services/api";

// export default function BookRepairPage() {
//   const router = useRouter();
  
//   const [session, setSession] = useState<any>(null);
//   const [loadingAuth, setLoadingAuth] = useState(true);
  
//   // New state for Serial/IMEI Lookup
//   const [serialNumber, setSerialNumber] = useState("");
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [verifySuccess, setVerifySuccess] = useState<string | null>(null);

//   const [deviceModel, setDeviceModel] = useState("");
//   const [issueType, setIssueType] = useState("");
//   const [description, setDescription] = useState("");
  
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const checkSession = async () => {
//       const { data: { session } } = await supabase.auth.getSession();
//       setSession(session);
//       setLoadingAuth(false);
//     };
//     checkSession();
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!session) return;
    
//     setIsSubmitting(true);
//     setError(null);

//     try {
//       // Use our centralized API service instead of direct Supabase client
//       await apiService.createTicket({
//         user_id: session.user.id,
//         device_model: deviceModel,
//         issue_type: issueType,
//       });

//       setIsSuccess(true);
//     } catch (err: any) {
//       console.error(err);
//       setError(
//         "Failed to submit request. Please check Supabase RLS policies. Details: " + 
//         (err.message || "Unknown error")
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (loadingAuth) {
//     return (
//       <div className="flex-1 flex items-center justify-center min-h-[600px]">
//         <Loader2 className="w-8 h-8 animate-spin text-apple-blue" />
//       </div>
//     );
//   }

//   // Require users to be logged in to book a repair
//   if (!session) {
//     return (
//       <div className="flex-1 flex flex-col items-center justify-center p-4 py-20 text-center">
//         <div className="w-16 h-16 bg-blue-50 text-apple-blue rounded-2xl flex items-center justify-center mb-6">
//           <Wrench className="w-8 h-8" />
//         </div>
//         <h2 className="text-2xl font-bold text-apple-dark mb-4">Sign in to book a repair</h2>
//         <p className="text-gray-500 mb-8 max-w-md">
//           You need an account to track your repair status and communicate with our technicians.
//         </p>
//         <Link 
//           href="/login" 
//           className="bg-apple-dark text-white px-8 py-3 rounded-full font-medium hover:bg-black transition-colors"
//         >
//           Go to Login
//         </Link>
//       </div>
//     );
//   }

//   if (isSuccess) {
//     return (
//       <div className="flex-1 flex flex-col items-center justify-center p-4 py-20 text-center animate-in zoom-in-95 duration-300">
//         <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
//           <CheckCircle2 className="w-10 h-10" />
//         </div>
//         <h2 className="text-3xl font-bold text-apple-dark mb-4">Ticket Submitted!</h2>
//         <p className="text-gray-500 mb-8 max-w-md">
//           We have received your repair request. Our technicians will review it shortly. You can track its progress in your dashboard.
//         </p>
//         <div className="flex space-x-4">
//           <Link 
//             href="/dashboard" 
//             className="bg-apple-dark text-white px-6 py-3 rounded-xl font-medium hover:bg-black transition-colors"
//           >
//             Go to Dashboard
//           </Link>
//           <button 
//             onClick={() => {
//               setIsSuccess(false);
//               setSerialNumber("");
//               setVerifySuccess(null);
//               setDeviceModel("");
//               setIssueType("");
//               setDescription("");
//             }}
//             className="bg-white border border-gray-200 text-apple-dark px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
//           >
//             Book Another
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 bg-apple-gray py-12 px-4 sm:px-6">
//       <div className="max-w-2xl mx-auto bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-gray-100">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-apple-dark mb-2">Book a Repair</h1>
//           <p className="text-gray-500">Tell us about your device and the issue you're experiencing.</p>
//         </div>

//         {error && (
//           <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center text-sm mb-6 border border-red-100">
//             <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
//             <span className="text-sm">{error}</span>
//           </div>
//         )}

//         {/* --- Serial Number Lookup Section --- */}
//         <div className="mb-8 p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
//           <label className="block text-sm font-semibold text-apple-dark mb-2">Have a Serial Number or IMEI?</label>
//           <p className="text-xs text-gray-500 mb-4">Enter it below to automatically find your exact device details.</p>
//           <div className="flex flex-col sm:flex-row gap-3">
//             <input
//               type="text"
//               value={serialNumber}
//               onChange={(e) => setSerialNumber(e.target.value)}
//               placeholder="e.g. C02X..."
//               className="flex-1 bg-white border border-gray-200 focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 rounded-xl px-4 py-3 text-apple-dark outline-none transition-all uppercase"
//             />
//             <button
//               type="button"
//               onClick={async () => {
//                 if(!serialNumber) return;
//                 setIsVerifying(true);
//                 setError(null);
//                 setVerifySuccess(null);
//                 try {
//                   const data = await apiService.checkImei(serialNumber);
//                   setDeviceModel(data.model); // Auto-fill the manual input below!
//                   setVerifySuccess(`Device found: ${data.model}`);
//                 } catch (err: any) {
//                   setError(err.message || "Could not find device details.");
//                 } finally {
//                   setIsVerifying(false);
//                 }
//               }}
//               disabled={isVerifying || !serialNumber}
//               className="bg-apple-blue text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-70 flex items-center justify-center whitespace-nowrap shadow-sm"
//             >
//               {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Device"}
//             </button>
//           </div>
//           {verifySuccess && (
//             <p className="text-sm text-green-600 font-medium mt-3 flex items-center animate-in fade-in">
//               <CheckCircle2 className="w-4 h-4 mr-1"/> {verifySuccess}
//             </p>
//           )}
//         </div>
//         {/* ---------------------------------- */}

//         <form onSubmit={handleSubmit} className="space-y-6">
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
//             <label className="block text-sm font-semibold text-gray-700 mb-2">Issue Type</label>
//             <select
//               required
//               value={issueType}
//               onChange={(e) => setIssueType(e.target.value)}
//               className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 rounded-xl px-4 py-3 text-apple-dark outline-none transition-all appearance-none"
//             >
//               <option value="" disabled>Select an issue...</option>
//               <option value="Cracked Screen">Cracked Screen</option>
//               <option value="Battery Draining Fast">Battery Draining Fast</option>
//               <option value="Not Charging">Not Charging</option>
//               <option value="Water Damage">Water Damage</option>
//               <option value="Software/Boot Loop">Software / Boot Loop</option>
//               <option value="Logic Board Failure">Logic Board Failure</option>
//               <option value="Other">Other</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Details (Optional)</label>
//             <textarea
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="Please provide any additional context about the issue..."
//               rows={4}
//               className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 rounded-xl px-4 py-3 text-apple-dark outline-none transition-all resize-none"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={isSubmitting || !deviceModel || !issueType}
//             className="w-full bg-apple-dark text-white py-4 rounded-xl font-bold hover:bg-black transition-colors flex items-center justify-center group disabled:opacity-70 mt-4"
//           >
//             {isSubmitting ? (
//               <Loader2 className="w-6 h-6 animate-spin" />
//             ) : (
//               <>
//                 Submit Repair Request
//                 <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
//               </>
//             )}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }