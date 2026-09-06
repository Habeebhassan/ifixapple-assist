"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Wrench, ShieldCheck, Smartphone, PlayCircle, Star, Quote, ChevronDown, MessageCircle } from "lucide-react";
import Link from "next/link";
import { apiService } from "@/services/api";

// Fallback reviews used for SSR and while the live API is fetching
const fallbackReviews = [
{
id: "fb-1",
name: "Chinedu O.",
date: "2 weeks ago",
text: "I thought my iPhone 13 Pro Max was dead after it fell in the pool. These guys revived the logic board in 48 hours. Absolute lifesavers. No data lost!",
rating: 5
},
{
id: "fb-2",
name: "Aisha T.",
date: "1 month ago",
text: "Used their VIP dispatch. The rider picked up my MacBook from VI, and it was back on my desk by evening with a new screen. Extremely professional service.",
rating: 5
},
{
id: "fb-3",
name: "Damilola A.",
date: "3 months ago",
text: "Swapped my old iPhone 11 for a UK Used 14. The AI valuation was spot on, no hidden stories when I got to the Ajah shop. Highly recommended.",
rating: 5
}
];

export default function Home() {
const [mounted, setMounted] = useState(false);

// Dynamic Review States
const [reviewsData, setReviewsData] = useState(fallbackReviews);
const [shopStats, setShopStats] = useState({ rating: 4.9, count: "50+" });

useEffect(() => {
setMounted(true);

// Fetch live Google Reviews in the background
const fetchLiveReviews = async () => {
  try {
    const data = await apiService.getReviews();
    if (data.success && data.reviews && data.reviews.length > 0) {
      
      // Map Google's payload to our UI format
      const formattedReviews = data.reviews.map((r: any, index: number) => ({
        id: `google-${index}`,
        name: r.author_name,
        date: r.relative_time_description,
        // Truncate overly long reviews to keep the grid looking clean
        text: r.text.length > 160 ? r.text.substring(0, 160) + '...' : r.text,
        rating: r.rating
      }));

      setReviewsData(formattedReviews);
      setShopStats({
        rating: data.rating,
        count: data.total_ratings > 1000 ? `${(data.total_ratings/1000).toFixed(1)}k+` : `${data.total_ratings}`
      });
    }
  } catch (error) {
    console.error("Using fallback reviews due to Google API timeout or error.");
  }
};

fetchLiveReviews();


}, []);

// SSR Fallback
if (!mounted) {
return null;
}

return (
  <div className="flex flex-col">

  {/* Hero Section */}
  <main className="flex-grow flex flex-col items-center justify-center px-4 text-center py-20 sm:py-32 bg-white">
    <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-apple-dark max-w-4xl mb-6">
      Bring your Apple devices <br className="hidden sm:block" /> back to life.
    </h1>
    <p className="text-xl text-gray-500 max-w-2xl mb-10">
      Expert repairs, genuine parts, and instant AI diagnostics. Find out what's wrong with your device in seconds.
    </p>
    
    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
      <button 
        onClick={() => typeof window !== 'undefined' && window.dispatchEvent(new Event('open-chat'))}
        className="bg-apple-blue text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center group shadow-sm"
      >
        Start AI Diagnosis
        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
      
      <Link href="/status" className="bg-white border border-gray-300 text-apple-dark px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center shadow-sm">
        Check IMEI Status
      </Link>
    </div>
  </main>

  {/* Proof of Quality / Video Section */}
  <section className="bg-apple-gray py-24 overflow-hidden relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row items-center gap-16">
        
        {/* Text Side */}
        <div className="lg:w-1/2 text-left z-10">
          <h2 className="text-3xl sm:text-5xl font-bold text-apple-dark mb-6 tracking-tight">
            Surgical precision.<br/>Visible results.
          </h2>
          <p className="text-lg text-gray-500 mb-8 leading-relaxed">
            We don't just fix devices; we restore them to factory standards. Watch our master technicians perform intricate micro-soldering and flawless screen replacements in real-time.
          </p>
          
          {/* Dynamic Trust Badge */}
          <a 
            href="https://g.page/r/CYlB77OoOeu-EBM/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-col space-y-2 group cursor-pointer hover:bg-gray-200/50 p-3 -ml-3 rounded-2xl transition-colors"
            title="Read our Google Reviews"
          >
            <div className="flex items-center space-x-1">
              {/* Render exact stars based on the Google Rating, rounded to nearest whole number for display */}
              {[...Array(Math.round(shopStats.rating))].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-sm font-bold text-gray-700 ml-2 group-hover:text-apple-blue transition-colors">
                {shopStats.rating}/5 Average Rating
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-apple-gray bg-gray-300"></div>
                <div className="w-10 h-10 rounded-full border-2 border-apple-gray bg-gray-400"></div>
                <div className="w-10 h-10 rounded-full border-2 border-apple-gray bg-apple-blue flex items-center justify-center text-xs font-bold text-white">
                  {shopStats.count}
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 group-hover:text-apple-dark transition-colors">Google Verified Reviews</p>
            </div>
          </a>
        </div>

        {/* Video Side */}
        <div className="lg:w-1/2 w-full relative">
          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl aspect-video bg-gray-900 border border-gray-800 flex items-center justify-center group">
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-gray-500">
              <PlayCircle className="w-12 h-12 mb-3 opacity-50" />
              <span className="text-sm font-medium">Repair footage loading...</span>
            </div>
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="absolute inset-0 w-full h-full object-cover z-10 opacity-90 group-hover:opacity-100 transition-opacity duration-500"
            >
              <source src="/videos/repair-placeholder.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="absolute -inset-6 bg-gradient-to-r from-apple-blue to-purple-500 opacity-20 blur-3xl -z-10 rounded-[3rem]"></div>
        </div>
        
      </div>
    </div>
  </section>

  {/* Features Grid */}
  <section id="features" className="bg-white py-24 border-t border-gray-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        <div className="flex flex-col items-center group">
          <div className="w-16 h-16 bg-blue-50 text-apple-blue rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
            <Wrench className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Certified Repairs</h3>
          <p className="text-gray-500">Screen, battery, and logic board repairs completed by trained specialists.</p>
        </div>
        <div className="flex flex-col items-center group">
          <div className="w-16 h-16 bg-blue-50 text-apple-blue rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
            <Smartphone className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold mb-3">AI Troubleshooting</h3>
          <p className="text-gray-500">Chat with our Genius AI to instantly diagnose your device symptoms before you book.</p>
        </div>
        <div className="flex flex-col items-center group">
          <div className="w-16 h-16 bg-blue-50 text-apple-blue rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Guaranteed Quality</h3>
          <p className="text-gray-500">Every repair comes with a comprehensive 90-day warranty for your peace of mind.</p>
        </div>
      </div>
    </div>
  </section>

   {/* FAQ Section */}
  <section id="faq" className="bg-apple-gray py-24 border-t border-gray-100">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-apple-dark mb-4">Frequently Asked Questions</h2>
        <p className="text-lg text-gray-500">Everything you need to know about our repair process and policies.</p>
      </div>

      <div className="space-y-4">
        {/* FAQ 1 */}
        <details className="group border border-gray-200 rounded-2xl bg-white [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer items-center justify-between p-6 font-semibold text-apple-dark">
            <span>Do you use original Apple parts?</span>
            <ChevronDown className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" />
          </summary>
          <div className="px-6 pb-6 text-gray-500 leading-relaxed text-sm">
            We offer two tiers of parts to fit your budget: <strong className="text-apple-dark">Premium OEM</strong> (Original Equipment Manufacturer pulled from genuine devices) and <strong className="text-apple-dark">Standard Aftermarket</strong> (high-quality certified third-party components). We will never install an aftermarket part without your explicit consent.
          </div>
        </details>

        {/* FAQ 2 */}
        <details className="group border border-gray-200 rounded-2xl bg-white [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer items-center justify-between p-6 font-semibold text-apple-dark">
            <span>How long does a repair usually take?</span>
            <ChevronDown className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" />
          </summary>
          <div className="px-6 pb-6 text-gray-500 leading-relaxed text-sm">
            Standard repairs like screen swaps and battery replacements are typically completed in under <strong>45 minutes</strong> if you walk into our Ajah lab. Complex logic board micro-soldering or liquid damage recovery can take between 24 to 72 hours.
          </div>
        </details>

        {/* FAQ 3 */}
        <details className="group border border-gray-200 rounded-2xl bg-white [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer items-center justify-between p-6 font-semibold text-apple-dark">
            <span>How does the VIP Dispatch Pick-up work?</span>
            <ChevronDown className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" />
          </summary>
          <div className="px-6 pb-6 text-gray-500 leading-relaxed text-sm">
            If you are on the Island, you can skip the traffic! Select the "VIP Dispatch" option when booking. A verified rider will pick up your device securely from your home or office, deliver it to our lab, and return it to you the exact same day once fixed.
          </div>
        </details>

        {/* FAQ 4 */}
        <details className="group border border-gray-200 rounded-2xl bg-white [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer items-center justify-between p-6 font-semibold text-apple-dark">
            <span>Do I need to make an appointment?</span>
            <ChevronDown className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" />
          </summary>
          <div className="px-6 pb-6 text-gray-500 leading-relaxed text-sm">
            Walk-ins are always welcome! However, booking your repair online through our platform guarantees priority queue status, confirms part availability in advance, and locks in your repair quote.
          </div>
        </details>
      </div>

      <div className="mt-12 text-center bg-white p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col items-center">
        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
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
        <h2 className="text-3xl sm:text-4xl font-bold text-apple-dark mb-4">Don't just take our word for it.</h2>
        <p className="text-lg text-gray-500">See what Nigerians are saying about our premium service on Google.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviewsData.map((review) => (
          <div key={review.id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-1 mb-4">
              {/* Safely render stars up to the rating value */}
              {[...Array(Math.min(5, Math.max(1, review.rating)))].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <div className="relative flex-grow">
              <Quote className="absolute -top-2 -left-2 w-8 h-8 text-gray-100 -z-10" />
              <p className="text-gray-700 leading-relaxed relative z-10 mb-6 text-sm">
                "{review.text}"
              </p>
            </div>
            <div className="mt-auto pt-6 border-t border-gray-50 flex justify-between items-center">
              <p className="font-bold text-apple-dark text-sm">{review.name}</p>
              <p className="text-xs text-gray-400">{review.date}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <a 
          href="https://g.page/r/CYlB77OoOeu-EBM/review"
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center text-apple-blue font-semibold hover:text-blue-700 transition-colors group"
        >
          Read all Google Reviews 
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </a>
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
