

// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import {
//   Search,
//   ShieldCheck,
//   Wrench,
//   RefreshCw,
//   ChevronDown,
//   MapPin,
//   Truck,
//   Zap,
//   Package,
//   CheckCircle2,
//   Lock,
//   ArrowRight,
//   Smartphone,
//   Shield,
//   AlertCircle,
// } from "lucide-react";
// import { apiService } from "@/services/api";

// interface ImeiTeaserResult {
//   model?: string;
//   identifier?: string;
//   imei?: string;
// }

// export default function LandingPage() {
//   // IMEI Search State
//   const [imeiQuery, setImeiQuery] = useState("");
//   const [isSearching, setIsSearching] = useState(false);
//   const [searchResult, setSearchResult] = useState<ImeiTeaserResult | null>(null);
//   const [searchError, setSearchError] = useState<string | null>(null);

//   // FAQ State
//   const [openFaq, setOpenFaq] = useState<number | null>(null);

//   const handleImeiSearch = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const cleanedImei = imeiQuery.trim();
//     if (cleanedImei.length !== 15) {
//       setSearchError("Please enter a valid 15-digit IMEI number.");
//       return;
//     }

//     setIsSearching(true);
//     setSearchError(null);
//     setSearchResult(null);

//     try {
//       const data = await apiService.checkImei(cleanedImei);
//       setSearchResult(data);
//     } catch (err: unknown) {
//       const message =
//         err instanceof Error ? err.message : "Failed to identify device.";
//       setSearchError(message);
//     } finally {
//       setIsSearching(false);
//     }
//   };

//   const faqs = [
//     {
//       question: "Do you use original Apple parts?",
//       answer:
//         "We offer two options: Premium OEM parts (original specifications) and Standard Aftermarket parts. We will always clearly explain the difference and let you choose what fits your budget.",
//     },
//     {
//       question: "Will I lose my data during a repair?",
//       answer:
//         "For standard repairs like screens and batteries, your data is 100% safe. However, for logic board micro-soldering or severe water damage, data loss is possible. We always recommend backing up your device before sending it to our physical lab.",
//     },
//     {
//       question: "How does the swap (trade-in) work?",
//       answer:
//         "Use our online swap calculator to get an estimated value for your current device. Once approved, that value is deducted from the price of the UK Used device you want to upgrade to!",
//     },
//     {
//       question: "How long does a typical repair take?",
//       answer:
//         "Most screen and battery replacements are completed within 1-2 hours of receiving the device. Logic board repairs and water damage recovery require 24-48 hours for thorough diagnostic testing.",
//     },
//   ];

//   const resolvedIdentifier =
//     searchResult?.identifier || searchResult?.imei || imeiQuery;

//   return (
//     <div className="bg-white">
//       {/* 1. HERO SECTION */}
//       <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-28 overflow-hidden">
//         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-white -z-10"></div>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
//           <div className="inline-flex items-center px-4 py-2 rounded-full bg-apple-blue/10 text-apple-blue font-semibold text-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
//             <SparklesIcon className="w-4 h-4 mr-2" />
//             Lagos&apos;s Premier Apple Repair Lab
//           </div>

//           <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-apple-dark mb-6 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700">
//             Expert care for your <br className="hidden md:block" />
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
//               Apple devices.
//             </span>
//           </h1>

//           <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
//             From precision micro-soldering to instant UK Used swaps. We revive,
//             restore, and upgrade your tech with absolute transparency.
//           </p>

//           <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
//             <Link
//               href="/book"
//               className="w-full sm:w-auto bg-apple-dark text-white px-8 py-4 rounded-full font-bold hover:bg-black transition-all hover:scale-105 shadow-lg"
//             >
//               Book a Repair
//             </Link>
//             <Link
//               href="/trade-in"
//               className="w-full sm:w-auto bg-white text-apple-dark border-2 border-gray-200 px-8 py-4 rounded-full font-bold hover:border-apple-dark hover:bg-gray-50 transition-all flex items-center justify-center"
//             >
//               Swap a Device <RefreshCw className="w-4 h-4 ml-2" />
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* 2. IMEI SECURITY REPORT (THE TENTPOLE FEATURE) */}
//       <section
//         id="imei-audit"
//         className="py-20 bg-apple-dark text-white relative overflow-hidden"
//       >
//         <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
//         <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
//           <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
//             <Shield className="w-8 h-8 text-white" />
//           </div>
//           <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
//             IMEI Security Report
//           </h2>
//           <p className="text-gray-400 mb-10 text-lg max-w-2xl mx-auto">
//             Buying a UK Used phone? Don&apos;t risk buying a stolen or locked
//             device. Enter the 15-digit IMEI to instantly verify the model and
//             unlock a premium security audit.
//           </p>

//           <form
//             onSubmit={handleImeiSearch}
//             className="relative max-w-2xl mx-auto mb-4"
//           >
//             <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 pointer-events-none" />
//             <input
//               type="text"
//               inputMode="numeric"
//               maxLength={15}
//               aria-label="Enter 15-digit IMEI number"
//               value={imeiQuery}
//               onChange={(e) =>
//                 setImeiQuery(e.target.value.replace(/\D/g, "").slice(0, 15))
//               }
//               placeholder="Enter 15-digit IMEI number..."
//               className="w-full bg-white/5 border border-white/10 focus:bg-white/10 focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/50 rounded-full pl-16 pr-36 py-5 text-lg text-white placeholder-gray-500 outline-none transition-all shadow-inner"
//             />
//             <button
//               type="submit"
//               disabled={isSearching || imeiQuery.length !== 15}
//               className="absolute right-2 top-1/2 -translate-y-1/2 bg-apple-blue text-white px-6 py-3 rounded-full font-bold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:hover:bg-apple-blue flex items-center"
//             >
//               {isSearching ? (
//                 <span className="animate-pulse">Verifying...</span>
//               ) : (
//                 "Verify Free"
//               )}
//             </button>
//           </form>
//           <p className="text-xs text-gray-500">
//             {imeiQuery.length}/15 digits entered
//           </p>

//           {searchError && (
//             <div className="mt-6 inline-flex items-center bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-3 rounded-full text-sm font-medium animate-in fade-in">
//               <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
//               {searchError}
//             </div>
//           )}

//           {/* Instant Gratification Teaser Result */}
//           {searchResult && (
//             <div className="mt-10 bg-white text-apple-dark rounded-3xl p-8 max-w-2xl mx-auto shadow-2xl animate-in zoom-in-95 duration-500">
//               <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <CheckCircle2 className="w-6 h-6 text-green-500" />
//               </div>
//               <h3 className="text-2xl font-bold mb-1">
//                 Device Detected Successfully
//               </h3>
//               <p className="text-gray-500 mb-6 font-medium">
//                 {searchResult.model || "Apple Device"} &bull; {resolvedIdentifier}
//               </p>

//               <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 mb-8 text-left max-w-md mx-auto">
//                 <p className="font-bold text-blue-900 flex items-center mb-3">
//                   <Lock className="w-4 h-4 mr-2" /> Locked Premium Data:
//                 </p>
//                 <ul className="space-y-2 text-sm text-gray-600">
//                   <li className="flex items-center">
//                     <ShieldCheck className="w-4 h-4 mr-2 text-gray-400 shrink-0" />{" "}
//                     Global Blacklist &amp; Stolen Status
//                   </li>
//                   <li className="flex items-center">
//                     <ShieldCheck className="w-4 h-4 mr-2 text-gray-400 shrink-0" />{" "}
//                     iCloud Activation Lock (Find My)
//                   </li>
//                   <li className="flex items-center">
//                     <ShieldCheck className="w-4 h-4 mr-2 text-gray-400 shrink-0" />{" "}
//                     Network Carrier &amp; SIM Lock Data
//                   </li>
//                   <li className="flex items-center">
//                     <ShieldCheck className="w-4 h-4 mr-2 text-gray-400 shrink-0" />{" "}
//                     Outstanding Financial Contracts
//                   </li>
//                 </ul>
//               </div>

//               <Link
//                 href={"/report?imei=" + encodeURIComponent(resolvedIdentifier)}
//                 className="w-full sm:w-auto inline-flex items-center justify-center bg-apple-dark text-white px-8 py-4 rounded-full font-bold hover:bg-black transition-all hover:scale-105 shadow-lg group"
//               >
//                 Unlock Full Security Audit (₦2,000)
//                 <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
//               </Link>
//             </div>
//           )}
//         </div>
//       </section>

//       {/* 3. LOGISTICS & DELIVERY (NATIONWIDE SECTION) */}
//       <section
//         className="py-24 bg-gray-50 border-y border-gray-200/50"
//         id="logistics"
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold text-apple-dark mb-4 tracking-tight">
//               We come to you, wherever you are.
//             </h2>
//             <p className="text-lg text-gray-500 max-w-2xl mx-auto">
//               From beating Lekki traffic to managing out-of-state logistics,
//               we&apos;ve built a premium delivery network so you can get your
//               device fixed without the stress.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
//             {/* Lagos Operations Card */}
//             <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-200 relative overflow-hidden group">
//               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>

//               <div className="relative z-10">
//                 <div className="w-14 h-14 bg-apple-blue/10 rounded-2xl flex items-center justify-center mb-8">
//                   <MapPin className="w-7 h-7 text-apple-blue" />
//                 </div>

//                 <h3 className="text-2xl font-bold text-apple-dark mb-3">
//                   Within Lagos
//                 </h3>
//                 <p className="text-gray-500 mb-8 leading-relaxed">
//                   Experience our premium local services. Drop by our physical
//                   lab, or let our engineers come directly to you.
//                 </p>

//                 <ul className="space-y-5 mb-10">
//                   <li className="flex items-start">
//                     <div className="bg-gray-100 p-2 rounded-full mr-4 mt-0.5 shrink-0">
//                       <CheckCircle2 className="w-4 h-4 text-gray-600" />
//                     </div>
//                     <div>
//                       <h4 className="font-bold text-apple-dark text-sm">
//                         Walk-in to Lab (Free)
//                       </h4>
//                       <p className="text-xs text-gray-500">
//                         Visit our secure facility in the Ajah/Lekki axis.
//                       </p>
//                     </div>
//                   </li>
//                   <li className="flex items-start">
//                     <div className="bg-blue-50 p-2 rounded-full mr-4 mt-0.5 shrink-0">
//                       <Truck className="w-4 h-4 text-apple-blue" />
//                     </div>
//                     <div>
//                       <h4 className="font-bold text-apple-dark text-sm">
//                         VIP Dispatch (+₦5,000)
//                       </h4>
//                       <p className="text-xs text-gray-500">
//                         Secure pickup and return to your home or office.
//                       </p>
//                     </div>
//                   </li>
//                   <li className="flex items-start">
//                     <div className="bg-yellow-50 p-2 rounded-full mr-4 mt-0.5 shrink-0">
//                       <Zap className="w-4 h-4 text-yellow-600" />
//                     </div>
//                     <div>
//                       <h4 className="font-bold text-apple-dark text-sm">
//                         Home/Office Visit (+₦20,000)
//                       </h4>
//                       <p className="text-xs text-gray-500">
//                         An engineer fixes it right in front of you.
//                       </p>
//                     </div>
//                   </li>
//                 </ul>

//                 <Link
//                   href="/book"
//                   className="inline-flex items-center text-apple-blue font-bold hover:underline"
//                 >
//                   Book a Lagos Repair <ArrowRight className="w-4 h-4 ml-1" />
//                 </Link>
//               </div>
//             </div>

//             {/* Nationwide Operations Card */}
//             <div className="bg-apple-dark text-white rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden group">
//               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>

//               <div className="relative z-10">
//                 <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
//                   <Package className="w-7 h-7 text-white" />
//                 </div>

//                 <h3 className="text-2xl font-bold mb-3">
//                   Outside Lagos (Nationwide)
//                 </h3>
//                 <p className="text-gray-400 mb-8 leading-relaxed">
//                   Securely mail your device to us from anywhere in Nigeria. We
//                   fix it on camera and ship it right back to you.
//                 </p>

//                 <ul className="space-y-5 mb-10">
//                   <li className="flex items-start">
//                     <div className="bg-white/10 p-2 rounded-full mr-4 mt-0.5 shrink-0">
//                       <Smartphone className="w-4 h-4 text-gray-300" />
//                     </div>
//                     <div>
//                       <h4 className="font-bold text-white text-sm">
//                         Book Online
//                       </h4>
//                       <p className="text-xs text-gray-400">
//                         Generate a secure Ticket ID and terminal address.
//                       </p>
//                     </div>
//                   </li>
//                   <li className="flex items-start">
//                     <div className="bg-white/10 p-2 rounded-full mr-4 mt-0.5 shrink-0">
//                       <Shield className="w-4 h-4 text-green-400" />
//                     </div>
//                     <div>
//                       <h4 className="font-bold text-white text-sm">
//                         Ship via Trusted Partners
//                       </h4>
//                       <p className="text-xs text-gray-400">
//                         We partner with GIGL, DHL, GUO, and ABC Transport.
//                       </p>
//                     </div>
//                   </li>
//                   <li className="flex items-start">
//                     <div className="bg-white/10 p-2 rounded-full mr-4 mt-0.5 shrink-0">
//                       <CheckCircle2 className="w-4 h-4 text-blue-400" />
//                     </div>
//                     <div>
//                       <h4 className="font-bold text-white text-sm">
//                         Repair &amp; Return
//                       </h4>
//                       <p className="text-xs text-gray-400">
//                         We fix it, verify it, and waybill it back safely.
//                       </p>
//                     </div>
//                   </li>
//                 </ul>

//                 <Link
//                   href="/waybill"
//                   className="inline-flex items-center bg-white text-apple-dark px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
//                 >
//                   View Waybill Guide
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* 4. OUR SERVICES GRID */}
//       <section className="py-24 bg-white" id="services">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold text-apple-dark mb-4">
//               Precision Services
//             </h2>
//             <p className="text-lg text-gray-500 max-w-2xl mx-auto">
//               Equipped with logic board schematics and premium parts, we handle
//               what other shops can&apos;t.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             <div className="bg-gray-50 rounded-3xl p-8 hover:shadow-md transition-shadow border border-gray-100">
//               <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
//                 <Smartphone className="w-6 h-6" />
//               </div>
//               <h3 className="text-xl font-bold text-apple-dark mb-3">
//                 Screen &amp; Battery
//               </h3>
//               <p className="text-gray-500 text-sm mb-6 leading-relaxed">
//                 Restore your device to factory feel. We offer both Premium OEM
//                 (True Tone retained) and standard aftermarket options.
//               </p>
//               <Link
//                 href="/book"
//                 className="text-sm font-bold text-apple-blue hover:underline"
//               >
//                 Book Replacement &rarr;
//               </Link>
//             </div>

//             <div className="bg-gray-50 rounded-3xl p-8 hover:shadow-md transition-shadow border border-gray-100">
//               <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
//                 <Wrench className="w-6 h-6" />
//               </div>
//               <h3 className="text-xl font-bold text-apple-dark mb-3">
//                 Micro-Soldering
//               </h3>
//               <p className="text-gray-500 text-sm mb-6 leading-relaxed">
//                 Dead logic boards, water damage, and Face ID failures. We go
//                 down to the component level to save your device.
//               </p>
//               <Link
//                 href="/book"
//                 className="text-sm font-bold text-purple-600 hover:underline"
//               >
//                 Book Diagnostics &rarr;
//               </Link>
//             </div>

//             <div className="bg-gray-50 rounded-3xl p-8 hover:shadow-md transition-shadow border border-gray-100">
//               <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6">
//                 <RefreshCw className="w-6 h-6" />
//               </div>
//               <h3 className="text-xl font-bold text-apple-dark mb-3">
//                 Swap &amp; Upgrade
//               </h3>
//               <p className="text-gray-500 text-sm mb-6 leading-relaxed">
//                 Don&apos;t want to fix it? Trade in your damaged or older device
//                 for credit toward a pristine UK Used upgrade.
//               </p>
//               <Link
//                 href="/trade-in"
//                 className="text-sm font-bold text-green-600 hover:underline"
//               >
//                 Get an Offer &rarr;
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* 5. FAQ SECTION */}
//       <section className="py-24 bg-apple-gray" id="faq">
//         <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold text-apple-dark mb-4 tracking-tight">
//               Frequently Asked Questions
//             </h2>
//             <p className="text-gray-500">
//               Everything you need to know about our repair and swap process.
//             </p>
//           </div>

//           <div className="space-y-4">
//             {faqs.map((faq, index) => (
//               <div
//                 key={index}
//                 className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300"
//               >
//                 <button
//                   type="button"
//                   aria-expanded={openFaq === index}
//                   onClick={() => setOpenFaq(openFaq === index ? null : index)}
//                   className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
//                 >
//                   <span className="font-semibold text-apple-dark pr-4">
//                     {faq.question}
//                   </span>
//                   <ChevronDown
//                     className={
//                       "w-5 h-5 text-gray-400 transition-transform duration-300 shrink-0 " +
//                       (openFaq === index ? "rotate-180" : "")
//                     }
//                   />
//                 </button>
//                 <div
//                   className={
//                     "overflow-hidden transition-all duration-300 ease-in-out " +
//                     (openFaq === index
//                       ? "max-h-48 opacity-100"
//                       : "max-h-0 opacity-0")
//                   }
//                 >
//                   <p className="px-6 pb-6 text-sm text-gray-500 leading-relaxed">
//                     {faq.answer}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="mt-12 text-center">
//             <p className="text-gray-500 text-sm mb-4">Still have questions?</p>
//             <button
//               type="button"
//               onClick={() => window.dispatchEvent(new Event("open-chat"))}
//               className="bg-white border border-gray-200 text-apple-dark px-6 py-3 rounded-full font-semibold hover:border-apple-dark transition-colors shadow-sm"
//             >
//               Ask our AI Genius
//             </button>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       aria-hidden="true"
//     >
//       <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
//     </svg>
//   );
// }



"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ShieldCheck,
  Wrench,
  RefreshCw,
  ChevronDown,
  MapPin,
  Truck,
  Zap,
  Package,
  CheckCircle2,
  Lock,
  ArrowRight,
  Smartphone,
  Shield,
  AlertCircle,
} from "lucide-react";
import { apiService } from "@/services/api";

interface ImeiTeaserResult {
  model: string;
  identifier?: string;
  imei?: string;
}

export default function LandingPage() {
  // IMEI Search State
  const [imeiQuery, setImeiQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<ImeiTeaserResult | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  // FAQ State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleImeiSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedImei = imeiQuery.trim();
    if (!cleanedImei || cleanedImei.length !== 15) {
      setSearchError("Please enter a valid 15-digit IMEI number.");
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setSearchResult(null);

    try {
      const data = await apiService.checkImei(cleanedImei);
      setSearchResult(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to identify device.";
      setSearchError(message);
    } finally {
      setIsSearching(false);
    }
  };

  const faqs = [
    {
      question: "Do you use original Apple parts?",
      answer:
        "We offer two options: Premium OEM parts (original specifications) and Standard Aftermarket parts. We will always clearly explain the difference and let you choose what fits your budget.",
    },
    {
      question: "Will I lose my data during a repair?",
      answer:
        "For standard repairs like screens and batteries, your data is 100% safe. However, for logic board micro-soldering or severe water damage, data loss is possible. We always recommend backing up your device before sending it to our physical lab.",
    },
    {
      question: "How does the swap (trade-in) work?",
      answer:
        "Use our online swap calculator to get an estimated value for your current device. Once approved, that value is deducted from the price of the UK Used device you want to upgrade to!",
    },
    {
      question: "How long does a typical repair take?",
      answer:
        "Most screen and battery replacements are completed within 1-2 hours of receiving the device. Logic board repairs and water damage recovery require 24-48 hours for thorough diagnostic testing.",
    },
  ];

  const resolvedImei =
    searchResult?.identifier || searchResult?.imei || imeiQuery;

  return (
    <div className="w-full flex flex-col">
      {/* 1. HERO SECTION */}
      <section className="pt-20 pb-24 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-apple-blue/10 text-apple-blue font-semibold text-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SparklesIcon className="w-4 h-4 mr-2" />
            <span className="inline-flex items-center gap-2">
              Lagos Lab
              <span className="w-1 h-1 rounded-full bg-current opacity-50" aria-hidden="true" />
              Insured Nationwide Waybill
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-apple-dark mb-6 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700">
            Expert care for your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Apple devices.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            From precision micro-soldering to instant UK Used swaps. Lock in upfront quotes, 
            track your repair in real time, and stay covered with a 90-day warranty.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
            <Link
              href="/book"
              className="w-full sm:w-auto bg-apple-dark text-white px-8 py-4 rounded-full font-bold hover:bg-black transition-all hover:scale-105 shadow-lg"
            >
              Book a Repair
            </Link>
            <Link
              href="/trade-in"
              className="w-full sm:w-auto bg-white text-apple-dark border-2 border-gray-200 px-8 py-4 rounded-full font-bold hover:border-apple-dark hover:bg-gray-50 transition-all flex items-center justify-center"
            >
              Swap a Device <RefreshCw className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. IMEI SECURITY REPORT (THE TENTPOLE FEATURE) */}
      <section
        id="imei-report"
        className="py-20 bg-apple-dark text-white relative overflow-hidden scroll-mt-16"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            IMEI Security Report
          </h2>
          <p className="text-gray-400 mb-10 text-lg max-w-2xl mx-auto">
            Buying a UK Used phone? Don&apos;t risk buying a stolen or locked
            device. Enter the 15-digit IMEI to instantly verify the model and
            unlock a premium security audit.
          </p>

          <form
            onSubmit={handleImeiSearch}
            className="relative max-w-2xl mx-auto mb-4"
          >
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 pointer-events-none" />
            <input
              type="text"
              inputMode="numeric"
              pattern="\d{15}"
              maxLength={15}
              aria-label="Enter 15-digit IMEI number"
              value={imeiQuery}
              onChange={(e) =>
                setImeiQuery(e.target.value.replace(/\D/g, "").slice(0, 15))
              }
              placeholder="Enter 15-digit IMEI number..."
              className="w-full bg-white/5 border border-white/10 focus:bg-white/10 focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/50 rounded-full pl-16 pr-36 py-5 text-lg text-white placeholder-gray-500 outline-none transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={isSearching || imeiQuery.length !== 15}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-apple-blue text-white px-6 py-3 rounded-full font-bold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-apple-blue flex items-center"
            >
              {isSearching ? (
                <span className="animate-pulse">Verifying...</span>
              ) : (
                "Verify Free"
              )}
            </button>
          </form>
          <p className="text-xs text-gray-500">
            {imeiQuery.length}/15 digits entered
          </p>

          {searchError && (
            <div className="mt-6 inline-flex items-center bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-3 rounded-full text-sm font-medium animate-in fade-in">
              <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
              {searchError}
            </div>
          )}

          {/* Instant Gratification Teaser Result */}
          {searchResult && (
            <div className="mt-10 bg-white text-apple-dark rounded-3xl p-8 max-w-2xl mx-auto shadow-2xl animate-in zoom-in-95 duration-500">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold mb-1">
                Device Detected Successfully
              </h3>
              <p className="text-gray-500 mb-6 font-medium">
                {searchResult.model} &bull; {resolvedImei}
              </p>

              <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 mb-8 text-left max-w-md mx-auto">
                <p className="font-bold text-blue-900 flex items-center mb-3">
                  <Lock className="w-4 h-4 mr-2" /> Locked Premium Data:
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <ShieldCheck className="w-4 h-4 mr-2 text-gray-400 shrink-0" />{" "}
                    Global Blacklist &amp; Stolen Status
                  </li>
                  <li className="flex items-center">
                    <ShieldCheck className="w-4 h-4 mr-2 text-gray-400 shrink-0" />{" "}
                    iCloud Activation Lock (Find My)
                  </li>
                  <li className="flex items-center">
                    <ShieldCheck className="w-4 h-4 mr-2 text-gray-400 shrink-0" />{" "}
                    Network Carrier &amp; SIM Lock Data
                  </li>
                  <li className="flex items-center">
                    <ShieldCheck className="w-4 h-4 mr-2 text-gray-400 shrink-0" />{" "}
                    Outstanding Financial Contracts
                  </li>
                </ul>
              </div>

              <Link
                href={"/report?imei=" + encodeURIComponent(resolvedImei)}
                className="w-full sm:w-auto inline-flex items-center justify-center bg-apple-dark text-white px-8 py-4 rounded-full font-bold hover:bg-black transition-all hover:scale-105 shadow-lg group"
              >
                Unlock Full Security Audit (₦2,000)
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 3. LOGISTICS & DELIVERY (NATIONWIDE SECTION) */}
      <section
        className="py-24 bg-gray-50 border-y border-gray-200/50"
        id="logistics"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-apple-dark mb-4 tracking-tight">
              We come to you, wherever you are.
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              From beating Lekki traffic to managing out-of-state logistics,
              we&apos;ve built a premium delivery network so you can get your
              device fixed without the stress.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Lagos Operations Card */}
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-200 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>

              <div className="relative z-10">
                <div className="w-14 h-14 bg-apple-blue/10 rounded-2xl flex items-center justify-center mb-8">
                  <MapPin className="w-7 h-7 text-apple-blue" />
                </div>

                <h3 className="text-2xl font-bold text-apple-dark mb-3">
                  Within Lagos
                </h3>
                <p className="text-gray-500 mb-8 leading-relaxed">
                  Experience our premium local services. Drop by our physical
                  lab, or let our engineers come directly to you.
                </p>

                <ul className="space-y-5 mb-10">
                  <li className="flex items-start">
                    <div className="bg-gray-100 p-2 rounded-full mr-4 mt-0.5 shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-apple-dark text-sm">
                        Walk-in to Lab (Free)
                      </h4>
                      <p className="text-xs text-gray-500">
                        Visit our secure facility in the Ajah/Lekki axis.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-50 p-2 rounded-full mr-4 mt-0.5 shrink-0">
                      <Truck className="w-4 h-4 text-apple-blue" />
                    </div>
                    <div>
                      <h4 className="font-bold text-apple-dark text-sm">
                        VIP Dispatch (+₦5,000)
                      </h4>
                      <p className="text-xs text-gray-500">
                        Secure pickup and return to your home or office.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-yellow-50 p-2 rounded-full mr-4 mt-0.5 shrink-0">
                      <Zap className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-apple-dark text-sm">
                        Home/Office Visit (+₦20,000)
                      </h4>
                      <p className="text-xs text-gray-500">
                        An engineer fixes it right in front of you.
                      </p>
                    </div>
                  </li>
                </ul>

                <Link
                  href="/book"
                  className="inline-flex items-center text-apple-blue font-bold hover:underline"
                >
                  Book a Lagos Repair <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>

            {/* Nationwide Operations Card */}
            <div className="bg-apple-dark text-white rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>

              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
                  <Package className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-2xl font-bold mb-3">
                  Outside Lagos (Nationwide)
                </h3>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  Securely mail your device to us from anywhere in Nigeria. We
                  fix it on camera and ship it right back to you.
                </p>

                <ul className="space-y-5 mb-10">
                  <li className="flex items-start">
                    <div className="bg-white/10 p-2 rounded-full mr-4 mt-0.5 shrink-0">
                      <Smartphone className="w-4 h-4 text-gray-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">
                        Book Online
                      </h4>
                      <p className="text-xs text-gray-400">
                        Generate a secure Ticket ID and terminal address.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-white/10 p-2 rounded-full mr-4 mt-0.5 shrink-0">
                      <Shield className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">
                        Ship via Trusted Partners
                      </h4>
                      <p className="text-xs text-gray-400">
                        We partner with GIGL, DHL, GUO, and ABC Transport.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-white/10 p-2 rounded-full mr-4 mt-0.5 shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">
                        Repair &amp; Return
                      </h4>
                      <p className="text-xs text-gray-400">
                        We fix it, verify it, and waybill it back safely.
                      </p>
                    </div>
                  </li>
                </ul>

                <Link
                  href="/waybill"
                  className="inline-flex items-center bg-white text-apple-dark px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
                >
                  View Waybill Guide
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. OUR SERVICES GRID */}
      <section className="py-24 bg-white scroll-mt-16" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-apple-dark mb-4">
              Precision Services
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Equipped with logic board schematics and premium parts, we handle
              what other shops can&apos;t.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-3xl p-8 hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-apple-dark mb-3">
                Screen &amp; Battery
              </h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Restore your device to factory feel. We offer both Premium OEM
                (True Tone retained) and standard aftermarket options.
              </p>
              <Link
                href="/book"
                className="text-sm font-bold text-apple-blue hover:underline"
              >
                Book Replacement &rarr;
              </Link>
            </div>

            <div className="bg-gray-50 rounded-3xl p-8 hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-apple-dark mb-3">
                Micro-Soldering
              </h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Dead logic boards, water damage, and Face ID failures. We go
                down to the component level to save your device.
              </p>
              <Link
                href="/book"
                className="text-sm font-bold text-purple-600 hover:underline"
              >
                Book Diagnostics &rarr;
              </Link>
            </div>

            <div className="bg-gray-50 rounded-3xl p-8 hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-apple-dark mb-3">
                Swap &amp; Upgrade
              </h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Don&apos;t want to fix it? Trade in your damaged or older device
                for credit toward a pristine UK Used upgrade.
              </p>
              <Link
                href="/trade-in"
                className="text-sm font-bold text-green-600 hover:underline"
              >
                Get an Offer &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ SECTION */}
      <section className="py-24 bg-apple-gray" id="faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-apple-dark mb-4 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500">
              Everything you need to know about our repair and swap process.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  type="button"
                  aria-expanded={openFaq === index}
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="font-semibold text-apple-dark pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={
                      "w-5 h-5 text-gray-400 transition-transform duration-300 shrink-0 " +
                      (openFaq === index ? "rotate-180" : "")
                    }
                  />
                </button>
                <div
                  className={
                    "overflow-hidden transition-all duration-300 ease-in-out " +
                    (openFaq === index
                      ? "max-h-48 opacity-100"
                      : "max-h-0 opacity-0")
                  }
                >
                  <p className="px-6 pb-6 text-sm text-gray-500 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm mb-4">Still have questions?</p>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("open-chat"))}
              className="bg-white border border-gray-200 text-apple-dark px-6 py-3 rounded-full font-semibold hover:border-apple-dark transition-colors shadow-sm"
            >
              Ask our AI Genius
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
      <path d="M20 3v4" />
      <path d="M22 5h-4" />
      <path d="M4 17v2" />
      <path d="M5 18H3" />
    </svg>
  );
}