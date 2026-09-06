"use client";

import { useState, useEffect } from "react";
import {
ArrowRight, Wrench, ShieldCheck, Smartphone, PlayCircle,
Star, Quote, ChevronDown, MessageCircle, Truck, Zap, MapPin, CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { apiService } from "@/services/api";

export default function LandingPage() {
const [reviews, setReviews] = useState<any[]>([
{
author_name: "Chinedu Okafor",
rating: 5,
text: "Incredible service! The AI gave me a quote in seconds, and they fixed my iPhone 13 Pro Max screen the same day. Highly recommended.",
time_description: "2 weeks ago"
},
{
author_name: "Sarah Williams",
rating: 5,
text: "I was skeptical about giving out my MacBook, but their dispatch rider was so professional. Got my laptop back working perfectly without leaving my office.",
time_description: "1 month ago"
},
{
author_name: "David Adeleke",
rating: 5,
text: "The no part-swapping guarantee gave me peace of mind. Genuine Apple parts and a very clean lab environment. Best in the city.",
time_description: "3 months ago"
}
]);
const [rating, setRating] = useState(5.0);
const [totalRatings, setTotalRatings] = useState(124);

// Fetch live reviews on mount (falls back to default if API fails)
useEffect(() => {
const fetchReviews = async () => {
try {
const data = await apiService.getReviews();
if (data.reviews && data.reviews.length > 0) {
setReviews(data.reviews);
setRating(data.rating);
setTotalRatings(data.total_ratings);
}
} catch (error) {
console.log("Using fallback reviews.", error);
}
};
fetchReviews();
}, []);

return (
  <div className="flex flex-col">

  {/* Hero Section */}
  <section className="relative overflow-hidden pt-20 pb-24 sm:pt-32 sm:pb-32 lg:pb-40">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-100/50 to-transparent blur-3xl -z-10 rounded-full"></div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-apple-dark mb-8">
        Premium Apple Repairs.<br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-apple-blue to-blue-400">Powered by AI.</span>
      </h1>
      <p className="max-w-2xl mx-auto text-xl text-gray-500 mb-10 leading-relaxed">
        Get an instant diagnosis, lock in your repair quote, and track your device status in real-time. 
        Experience the future of tech support.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
        <button 
          onClick={() => typeof window !== 'undefined' && window.dispatchEvent(new Event('open-chat'))}
          className="w-full sm:w-auto bg-apple-dark text-white px-8 py-4 rounded-full font-semibold hover:bg-black transition-all hover:scale-105 shadow-lg flex items-center justify-center group"
        >
          Ask the AI Genius
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
        <Link 
          href="/book" 
          className="w-full sm:w-auto bg-white text-apple-dark border border-gray-200 px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center"
        >
          Book Priority Repair
        </Link>
      </div>
    </div>
  </section>

  {/* Proof of Quality Video Section */}
  <section className="py-12 bg-white border-y border-gray-100">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-[2rem] overflow-hidden shadow-2xl bg-black aspect-video group">
        {/* The actual video file goes in public/videos/repair-placeholder.mp4 */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
        >
          <source src="/videos/repair-placeholder.mp4" type="video/mp4" />
        </video>
        
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 sm:p-12">
          <div className="flex items-center space-x-3 mb-3">
            <ShieldCheck className="w-6 h-6 text-apple-blue" />
            <span className="text-white font-bold tracking-wide uppercase text-sm">Certified Lab</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Precision Micro-Soldering</h3>
          <p className="text-gray-300 max-w-lg">Watch our engineers bring logic boards back to life using state-of-the-art diagnostic equipment and genuine components.</p>
        </div>
      </div>
    </div>
  </section>

  {/* Core Features Grid */}
  <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Feature 1 */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
          <Smartphone className="w-7 h-7 text-apple-blue" />
        </div>
        <h3 className="text-xl font-bold text-apple-dark mb-3">Instant Quotes</h3>
        <p className="text-gray-500 leading-relaxed text-sm">
          Our AI accurately diagnoses your issue and provides a transparent, upfront quote. No hidden fees or surprise charges.
        </p>
      </div>

      {/* Feature 2 */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6">
          <ShieldCheck className="w-7 h-7 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-apple-dark mb-3">Guaranteed Quality</h3>
        <p className="text-gray-500 leading-relaxed text-sm">
          Every repair comes with a comprehensive 90-day warranty. We use premium OEM components to ensure longevity.
        </p>
      </div>

      {/* Feature 3 */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6">
          <Wrench className="w-7 h-7 text-purple-600" />
        </div>
        <h3 className="text-xl font-bold text-apple-dark mb-3">Expert Engineers</h3>
        <p className="text-gray-500 leading-relaxed text-sm">
          From shattered screens to complex liquid damage recovery, our certified lab handles the most difficult repairs.
        </p>
      </div>
    </div>
  </section>

  {/* VIP Dispatch Banner (Option 1) */}
  <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    <div className="bg-apple-dark rounded-[2.5rem] p-8 sm:p-16 relative overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-12">
      {/* Abstract Glowing Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-apple-blue/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

      <div className="relative z-10 lg:w-3/5">
        <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full mb-6 border border-white/20">
          <Truck className="w-4 h-4 text-apple-blue" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">Premium Logistics</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
          Skip the traffic.<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">We come to you.</span>
        </h2>
        <p className="text-gray-400 text-lg mb-8 max-w-xl leading-relaxed">
          Don't let busy roads delay your repair. Choose one of our premium logistics options at checkout and get your device fixed without leaving your seat.
        </p>

        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <Link href="/book?delivery=dispatch" className="flex items-start space-x-4 bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-all hover:scale-105 cursor-pointer">
            <div className="bg-blue-500/20 p-3 rounded-xl shrink-0">
              <Truck className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h4 className="text-white font-semibold mb-1">VIP Dispatch</h4>
              <p className="text-sm text-gray-400">Secure pickup from your location and same-day return delivery.</p>
            </div>
          </Link>
          <Link href="/book?delivery=home" className="flex items-start space-x-4 bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-all hover:scale-105 cursor-pointer">
            <div className="bg-purple-500/20 p-3 rounded-xl shrink-0">
              <Zap className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h4 className="text-white font-semibold mb-1">Home Visit</h4>
              <p className="text-sm text-gray-400">A verified engineer arrives and repairs your device on the spot.</p>
            </div>
          </Link>
        </div>

        <Link href="/book" className="inline-flex items-center justify-center bg-white text-apple-dark px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors group shadow-lg">
          Book Priority Repair
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Visual UI Graphic Area */}
      <div className="relative z-10 lg:w-2/5 w-full flex justify-center lg:justify-end">
         <div className="relative w-full max-w-sm aspect-square">
           <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full opacity-20 blur-3xl animate-pulse"></div>
           <div className="absolute inset-4 bg-gray-900 rounded-3xl border border-white/10 shadow-2xl flex flex-col p-6 transform lg:rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-white/10">
                 <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center"><MapPin className="w-6 h-6 text-white"/></div>
                 <div>
                   <div className="h-4 w-24 bg-white/20 rounded mb-2"></div>
                   <div className="h-3 w-32 bg-white/10 rounded"></div>
                 </div>
              </div>
              <div className="space-y-4 flex-1">
                 <div className="flex items-center justify-between bg-apple-blue/20 border border-apple-blue/50 p-4 rounded-xl">
                    <span className="text-white text-sm font-medium flex items-center"><Truck className="w-4 h-4 mr-2"/> Dispatch Checkout</span>
                    <div className="w-5 h-5 rounded-full bg-apple-blue flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-white"/></div>
                 </div>
                 <div className="flex items-center justify-between bg-white/5 border border-white/10 p-4 rounded-xl">
                    <span className="text-white text-sm font-medium flex items-center"><Zap className="w-4 h-4 mr-2 text-gray-400"/> Home Visit Options</span>
                    <div className="w-5 h-5 rounded-full border border-white/30"></div>
                 </div>
              </div>
           </div>
         </div>
      </div>
    </div>
  </section>

  {/* FAQ Section */}
  <section id="faq" className="bg-white py-24 border-t border-gray-100">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-apple-dark mb-4">Frequently Asked Questions</h2>
        <p className="text-lg text-gray-500">Everything you need to know about our repair process and policies.</p>
      </div>

      <div className="space-y-4">
        {/* FAQ 1 */}
        <details className="group border border-gray-200 rounded-2xl bg-gray-50 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer items-center justify-between p-6 font-semibold text-apple-dark">
            <span>Do you use original Apple parts?</span>
            <ChevronDown className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" />
          </summary>
          <div className="px-6 pb-6 text-gray-500 leading-relaxed text-sm">
            We offer two tiers of parts to fit your budget: <strong className="text-apple-dark">Premium OEM</strong> (Original Equipment Manufacturer pulled from genuine devices) and <strong className="text-apple-dark">Standard Aftermarket</strong> (high-quality certified third-party components). We will never install an aftermarket part without your explicit consent.
          </div>
        </details>

        {/* FAQ 2 */}
        <details className="group border border-gray-200 rounded-2xl bg-gray-50 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer items-center justify-between p-6 font-semibold text-apple-dark">
            <span>How long does a repair usually take?</span>
            <ChevronDown className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" />
          </summary>
          <div className="px-6 pb-6 text-gray-500 leading-relaxed text-sm">
            Standard repairs like screen swaps and battery replacements are typically completed in under <strong>45 minutes</strong> if you walk into our physical lab. Complex logic board micro-soldering or liquid damage recovery can take between 24 to 72 hours.
          </div>
        </details>

        {/* FAQ 3 */}
        <details className="group border border-gray-200 rounded-2xl bg-gray-50 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer items-center justify-between p-6 font-semibold text-apple-dark">
            <span>How does the VIP Dispatch Pick-up work?</span>
            <ChevronDown className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" />
          </summary>
          <div className="px-6 pb-6 text-gray-500 leading-relaxed text-sm">
            Select the "VIP Dispatch" option when booking online. A verified rider will pick up your device securely from your home or office, deliver it to our lab, and return it to you the exact same day once fixed.
          </div>
        </details>

        {/* FAQ 4 */}
        <details className="group border border-gray-200 rounded-2xl bg-gray-50 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer items-center justify-between p-6 font-semibold text-apple-dark">
            <span>Do I need to make an appointment?</span>
            <ChevronDown className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" />
          </summary>
          <div className="px-6 pb-6 text-gray-500 leading-relaxed text-sm">
            Walk-ins are always welcome! However, booking your repair online through our platform guarantees priority queue status, confirms part availability in advance, and locks in your repair quote.
          </div>
        </details>
      </div>

      <div className="mt-12 text-center bg-blue-50/50 p-8 rounded-3xl border border-blue-100 shadow-sm flex flex-col items-center">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-blue-100">
          <MessageCircle className="w-6 h-6 text-apple-blue" />
        </div>
        <h3 className="text-xl font-bold text-apple-dark mb-2">Have a specific issue?</h3>
        <p className="text-gray-500 mb-6 text-sm max-w-md mx-auto">
          Our AI Genius is trained on thousands of Apple repair manuals. Describe your problem to get an instant diagnosis and quote.
        </p>
        <button 
          onClick={() => typeof window !== 'undefined' && window.dispatchEvent(new Event('open-chat'))}
          className="bg-apple-dark text-white px-6 py-3 rounded-full font-medium hover:bg-black transition-colors"
        >
          Ask the AI Genius
        </button>
      </div>
    </div>
  </section>

  {/* Dynamic Customer Reviews Section */}
  <section id="reviews" className="bg-apple-gray py-24 border-t border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-apple-dark mb-4">
          Trusted by Nigerians
        </h2>
        <a 
          href="https://g.page/r/YOUR_GOOGLE_REVIEW_LINK" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center bg-white border border-gray-200 px-5 py-2.5 rounded-full shadow-sm hover:shadow-md hover:border-yellow-300 transition-all group"
        >
          <div className="flex space-x-1 mr-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400 group-hover:scale-110 transition-transform" style={{ transitionDelay: `${i * 50}ms` }} />
            ))}
          </div>
          <span className="text-apple-dark font-semibold">
            {rating.toFixed(1)} Rating • {totalRatings} Google Reviews
          </span>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map((review, index) => (
          <div key={index} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative h-full flex flex-col">
            <Quote className="w-10 h-10 text-blue-50 absolute top-6 right-6" />
            <div className="flex items-center space-x-1 mb-4">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-gray-600 leading-relaxed text-sm mb-6 flex-grow relative z-10">
              "{review.text}"
            </p>
            <div className="border-t border-gray-50 pt-4 mt-auto">
              <p className="font-bold text-apple-dark text-sm">{review.author_name}</p>
              <p className="text-xs text-gray-400">{review.time_description}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  </section>

</div>


);
}

// "use client";

// import { ArrowRight, Wrench, ShieldCheck, Smartphone } from "lucide-react";
// import Link from "next/link";
// import ChatInterface from "@/components/chat/ChatInterface";

// export default function Home() {
//   return (
//     <div className="flex flex-col">
//       {/* Hero Section */}
//       <main className="flex-grow flex flex-col items-center justify-center px-4 text-center py-20 sm:py-32 bg-white">
//         <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-apple-dark max-w-4xl mb-6">
//           Bring your Apple devices <br className="hidden sm:block" /> back to life.
//         </h1>
//         <p className="text-xl text-gray-500 max-w-2xl mb-10">
//           Expert repairs, genuine parts, and instant AI diagnostics. Find out what's wrong with your device in seconds.
//         </p>
        
//         <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
//           <button 
//             onClick={() => typeof window !== 'undefined' && window.dispatchEvent(new Event('open-chat'))}
//             className="bg-apple-blue text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center group"
//           >
//             Start AI Diagnosis
//             <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
//           </button>
          
//           <Link href="/status" className="bg-white border border-gray-300 text-apple-dark px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center">
//             Check IMEI Status
//           </Link>
//         </div>
//       </main>

//       {/* Features Grid */}
//       <section id="features" className="bg-white py-24 border-t border-gray-100">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
//             <div className="flex flex-col items-center">
//               <div className="w-16 h-16 bg-blue-50 text-apple-blue rounded-2xl flex items-center justify-center mb-6">
//                 <Wrench className="w-8 h-8" />
//               </div>
//               <h3 className="text-xl font-semibold mb-3">Certified Repairs</h3>
//               <p className="text-gray-500">Screen, battery, and logic board repairs completed by trained specialists.</p>
//             </div>
//             <div className="flex flex-col items-center">
//               <div className="w-16 h-16 bg-blue-50 text-apple-blue rounded-2xl flex items-center justify-center mb-6">
//                 <Smartphone className="w-8 h-8" />
//               </div>
//               <h3 className="text-xl font-semibold mb-3">AI Troubleshooting</h3>
//               <p className="text-gray-500">Chat with our Genius AI to instantly diagnose your device symptoms before you book.</p>
//             </div>
//             <div className="flex flex-col items-center">
//               <div className="w-16 h-16 bg-blue-50 text-apple-blue rounded-2xl flex items-center justify-center mb-6">
//                 <ShieldCheck className="w-8 h-8" />
//               </div>
//               <h3 className="text-xl font-semibold mb-3">Guaranteed Quality</h3>
//               <p className="text-gray-500">Every repair comes with a comprehensive 1-year warranty for your peace of mind.</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* AI Chat Interface */}
//     </div>
//   );
// }
