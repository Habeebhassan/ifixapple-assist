import Link from "next/link";
import { ShieldCheck, MapPin, Phone, Mail, Clock, CreditCard, Lock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-gray-200 py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          
          {/* Column 1: Brand & Trust */}
          <div className="space-y-5">
            <div className="flex items-center space-x-2 mb-6 group">
              <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center shadow-md">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="3" ry="3"></rect>
                  <path d="M12 18h.01" stroke="#0071E3"></path>
                  <path d="M9 11h6" stroke="#0071E3"></path>
                  <path d="M12 8v6" stroke="#0071E3"></path>
                </svg>
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                iFixApple
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Lagos' premier independent Apple device repair and swap laboratory. Fast, reliable, and secure.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center text-sm text-gray-300">
                <ShieldCheck className="w-4 h-4 mr-2 text-green-400" />
                90-Day Repair Warranty
              </li>
              <li className="flex items-center text-sm text-gray-300">
                <Lock className="w-4 h-4 mr-2 text-blue-500" />
                No Part-Swapping Guarantee
              </li>
              <li className="flex items-center text-sm text-gray-300">
                <CreditCard className="w-4 h-4 mr-2 text-purple-400" />
                Paystack Verified Secure Payments
              </li>
            </ul>
          </div>

          {/* Column 2: Our Specialties */}
          <div>
            <h4 className="font-bold mb-6 text-white tracking-wide uppercase text-xs">Our Specialties</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/book" className="text-sm text-gray-400 hover:text-white transition-colors">
                  iPhone Screen Swaps
                </Link>
              </li>
              <li>
                <Link href="/book" className="text-sm text-gray-400 hover:text-white transition-colors">
                  MacBook Logic Board Fixes
                </Link>
              </li>
              <li>
                <Link href="/book" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Face ID & Battery Health
                </Link>
              </li>
              <li>
                <Link href="/trade-in" className="text-sm text-gray-400 hover:text-white transition-colors">
                  UK Used Device Swaps
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: How it Works & Logistics */}
          <div>
            <h4 className="font-bold mb-6 text-white tracking-wide uppercase text-xs">How It Works</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/book" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Book a Repair Online
                </Link>
              </li>
              <li>
                <Link href="/book" className="text-sm text-gray-400 hover:text-white transition-colors">
                  VIP Dispatch Pick-up (Island)
                </Link>
              </li>
              <li>
                <Link href="/waybill" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Interstate Waybill Guide
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Track Repair Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Locations */}
          <div>
            <h4 className="font-bold mb-6 text-white tracking-wide uppercase text-xs">Head Office & Support</h4>
            <ul className="space-y-4">
              <li className="flex items-start text-sm text-gray-400">
                <MapPin className="w-5 h-5 mr-3 text-gray-500 shrink-0" />
                <span>E223 Ikota Shopping Complex<br/>Ajah / Lekki Axis<br/>Lagos, Nigeria</span>
              </li>
              <li className="flex items-center text-sm text-gray-400">
                <Phone className="w-5 h-5 mr-3 text-gray-500 shrink-0" />
                <span>+234 (0) 907 787 1875</span>
              </li>
              <li className="flex items-center text-sm text-gray-400">
                <Mail className="w-5 h-5 mr-3 text-gray-500 shrink-0" />
                <span>support@ifixapple.com.ng</span>
              </li>
              <li className="flex items-center text-sm text-gray-400">
                <Clock className="w-5 h-5 mr-3 text-gray-500 shrink-0" />
                <span>Mon-Sat: 9am - 6pm</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Legal & Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} iFixApple Solutions Ltd. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy-policy" className="text-xs text-gray-500 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="text-xs text-gray-500 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>

        {/* Trademark Disclaimer */}
        <div className="mt-8 text-center border-t border-white/5 pt-6">
          <p className="text-[10px] text-gray-600 leading-relaxed max-w-4xl mx-auto">
            iFixApple is a local independent repair laboratory operating in Nigeria. We are not officially affiliated with Apple Inc. 
            Apple, iPhone, iPad, MacBook, and Apple Watch are registered trademarks of Apple Inc., registered in the U.S. and other countries.
          </p>
        </div>

      </div>
    </footer>
  );
}


// import Link from "next/link";
// import { ShieldCheck, MapPin, Phone, Mail, Clock, CreditCard, Lock } from "lucide-react";

// export default function Footer() {
//   return (
//     <footer className="bg-neutral-950 text-gray-200 py-16 border-t border-white/5">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
//         {/* Main 4-Column Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          
//           {/* Column 1: Brand & Trust */}
//           <div className="space-y-5">
//             <div className="flex items-center space-x-2 mb-6 group">
//               <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center shadow-md">
//                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                   <rect x="5" y="2" width="14" height="20" rx="3" ry="3"></rect>
//                   <path d="M12 18h.01" stroke="#0071E3"></path>
//                   <path d="M9 11h6" stroke="#0071E3"></path>
//                   <path d="M12 8v6" stroke="#0071E3"></path>
//                 </svg>
//               </div>
//               <span className="font-bold text-xl tracking-tight text-white">
//                 iFixApple
//               </span>
//             </div>
//             <p className="text-sm text-gray-400 leading-relaxed mb-4">
//               Lagos' premier independent Apple device repair and swap laboratory. Fast, reliable, and secure.
//             </p>
//             <ul className="space-y-3">
//               <li className="flex items-center text-sm text-gray-300">
//                 <ShieldCheck className="w-4 h-4 mr-2 text-green-400" />
//                 90-Day Repair Warranty
//               </li>
//               <li className="flex items-center text-sm text-gray-300">
//                 <Lock className="w-4 h-4 mr-2 text-blue-500" />
//                 No Part-Swapping Guarantee
//               </li>
//               <li className="flex items-center text-sm text-gray-300">
//                 <CreditCard className="w-4 h-4 mr-2 text-purple-400" />
//                 Paystack Verified Secure Payments
//               </li>
//             </ul>
//           </div>

//           {/* Column 2: Our Specialties */}
//           <div>
//             <h4 className="font-bold mb-6 text-white tracking-wide uppercase text-xs">Our Specialties</h4>
//             <ul className="space-y-4">
//               <li>
//                 <Link href="/book" className="text-sm text-gray-400 hover:text-white transition-colors">
//                   iPhone Screen Swaps
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/book" className="text-sm text-gray-400 hover:text-white transition-colors">
//                   MacBook Logic Board Fixes
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/book" className="text-sm text-gray-400 hover:text-white transition-colors">
//                   Face ID & Battery Health
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/trade-in" className="text-sm text-gray-400 hover:text-white transition-colors">
//                   UK Used Device Swaps
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Column 3: How it Works & Logistics */}
//           <div>
//             <h4 className="font-bold mb-6 text-white tracking-wide uppercase text-xs">How It Works</h4>
//             <ul className="space-y-4">
//               <li>
//                 <Link href="/book" className="text-sm text-gray-400 hover:text-white transition-colors">
//                   Book a Repair Online
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/book" className="text-sm text-gray-400 hover:text-white transition-colors">
//                   VIP Dispatch Pick-up (Island)
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/waybill" className="text-sm text-gray-400 hover:text-white transition-colors">
//                   Interstate Waybill Guide
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/status" className="text-sm text-gray-400 hover:text-white transition-colors">
//                   Track Repair Status
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Column 4: Contact & Locations */}
//           <div>
//             <h4 className="font-bold mb-6 text-white tracking-wide uppercase text-xs">Head Office & Support</h4>
//             <ul className="space-y-4">
//               <li className="flex items-start text-sm text-gray-400">
//                 <MapPin className="w-5 h-5 mr-3 text-gray-500 shrink-0" />
//                 <span>E223 Ikota Shopping Complex<br/>Ajah / Lekki Axis<br/>Lagos, Nigeria</span>
//               </li>
//               <li className="flex items-center text-sm text-gray-400">
//                 <Phone className="w-5 h-5 mr-3 text-gray-500 shrink-0" />
//                 <span>+234 (0) 907 787 1875</span>
//               </li>
//               <li className="flex items-center text-sm text-gray-400">
//                 <Mail className="w-5 h-5 mr-3 text-gray-500 shrink-0" />
//                 <span>support@ifixapple.com.ng</span>
//               </li>
//               <li className="flex items-center text-sm text-gray-400">
//                 <Clock className="w-5 h-5 mr-3 text-gray-500 shrink-0" />
//                 <span>Mon-Sat: 9am - 6pm</span>
//               </li>
//             </ul>
//           </div>

//         </div>

//         {/* Bottom Bar: Legal & Copyright */}
//         <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
//           <p className="text-xs text-gray-500">
//             © {new Date().getFullYear()} iFixApple Solution Ltd. All rights reserved.
//           </p>
//           <div className="flex space-x-6">
//             <Link href="/privacy" className="text-xs text-gray-500 hover:text-white transition-colors">Privacy Policy</Link>
//             <Link href="/terms" className="text-xs text-gray-500 hover:text-white transition-colors">Terms of Service</Link>
//           </div>
//         </div>

//         {/* Trademark Disclaimer */}
//         <div className="mt-8 text-center border-t border-white/5 pt-6">
//           <p className="text-[10px] text-gray-600 leading-relaxed max-w-4xl mx-auto">
//             iFixApple is a local independent repair laboratory operating in Nigeria. We are not officially affiliated with Apple Inc. 
//             Apple, iPhone, iPad, MacBook, and Apple Watch are registered trademarks of Apple Inc., registered in the U.S. and other countries.
//           </p>
//         </div>

//       </div>
//     </footer>
//   );
// }
