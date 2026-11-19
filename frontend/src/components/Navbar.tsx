// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { supabase } from "@/lib/supabase";
// import { useRouter, usePathname } from "next/navigation";
// import type { Session } from "@supabase/supabase-js";
// import { User, LogOut, ShieldCheck, Menu, X } from "lucide-react";

// const checkAdminStatus = (email: string | undefined) => {
//   if (!email) return false;
//   return email.toLowerCase().endsWith("@ifixapple.com.ng");
// };

// export default function Navbar() {
//   const [session, setSession] = useState<Session | null>(null);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const router = useRouter();
//   const pathname = usePathname();

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
//       setSession(currentSession);
//       setIsAdmin(checkAdminStatus(currentSession?.user?.email));
//     });

//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((_event, currentSession) => {
//       setSession(currentSession);
//       setIsAdmin(checkAdminStatus(currentSession?.user?.email));
//     });

//     return () => subscription.unsubscribe();
//   }, []);

//   useEffect(() => {
//     setIsMenuOpen(false);
//   }, [pathname]);

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     setIsMenuOpen(false);
//     router.push("/");
//   };

//   return (
//     <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16 items-center">
//           {/* Logo */}
//           <Link href="/" className="flex items-center space-x-2 group">
//             <div className="w-9 h-9 bg-apple-dark rounded-xl flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
//               <svg
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 className="w-5 h-5 text-white"
//                 strokeWidth="2.5"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 aria-hidden="true"
//               >
//                 <rect x="5" y="2" width="14" height="20" rx="3" ry="3"></rect>
//                 <path d="M12 18h.01" stroke="#0071E3"></path>
//                 <path d="M9 11h6" stroke="#0071E3"></path>
//                 <path d="M12 8v6" stroke="#0071E3"></path>
//               </svg>
//             </div>
//             <span className="font-semibold text-xl tracking-tight text-apple-dark">
//               iFixApple
//             </span>
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex space-x-8 items-center">
//             <Link
//               href="/#services"
//               className="text-sm font-medium text-gray-500 hover:text-apple-dark transition-colors"
//             >
//               Services
//             </Link>
//             <Link
//               href="/trade-in"
//               className={
//                 pathname === "/trade-in"
//                   ? "text-sm font-semibold text-apple-dark transition-colors"
//                   : "text-sm font-medium text-gray-500 hover:text-apple-dark transition-colors"
//               }
//             >
//               Trade-In
//             </Link>
//             <Link
//               href="/report"
//               className={
//                 pathname === "/report"
//                   ? "text-sm font-semibold text-apple-dark transition-colors"
//                   : "text-sm font-medium text-gray-500 hover:text-apple-dark transition-colors"
//               }
//             >
//               IMEI Report
//             </Link>

//             {/* STRICT ADMIN LINK: Only renders if domain is @ifixapple.com.ng */}
//             {session && isAdmin && (
//               <Link
//                 href="/admin"
//                 className="text-sm font-bold text-apple-blue hover:text-blue-700 flex items-center bg-blue-50 px-3 py-1.5 rounded-full transition-colors"
//               >
//                 <ShieldCheck className="w-4 h-4 mr-1" /> Admin
//               </Link>
//             )}
//           </div>

//           {/* Auth & Actions */}
//           <div className="hidden md:flex items-center space-x-4">
//             <Link
//               href="/book"
//               className="bg-apple-dark text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-black transition-all"
//             >
//               Book Repair
//             </Link>

//             <div className="h-6 w-px bg-gray-200 mx-2"></div>

//             {session ? (
//               <div className="flex items-center space-x-4">
//                 <Link
//                   href="/dashboard"
//                   aria-label="User Dashboard"
//                   title="Dashboard"
//                   className={
//                     pathname === "/dashboard"
//                       ? "text-apple-blue transition-colors"
//                       : "text-gray-500 hover:text-apple-blue transition-colors"
//                   }
//                 >
//                   <User className="w-5 h-5" />
//                 </Link>
//                 <button
//                   type="button"
//                   onClick={handleLogout}
//                   aria-label="Log Out"
//                   className="text-gray-500 hover:text-red-500 transition-colors"
//                   title="Log Out"
//                 >
//                   <LogOut className="w-5 h-5" />
//                 </button>
//               </div>
//             ) : (
//               <div className="flex items-center space-x-5">
//                 <Link
//                   href="/login"
//                   className="text-sm font-medium text-gray-500 hover:text-apple-dark transition-colors"
//                 >
//                   Log In
//                 </Link>
//                 <Link
//                   href="/signup"
//                   className="text-sm font-bold text-apple-blue hover:text-blue-700 transition-colors border-2 border-apple-blue px-4 py-1.5 rounded-full"
//                 >
//                   Sign Up
//                 </Link>
//               </div>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="md:hidden flex items-center">
//             <button
//               type="button"
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               aria-expanded={isMenuOpen}
//               aria-label={isMenuOpen ? "Close menu" : "Open menu"}
//               className="text-gray-500 p-2 rounded-lg hover:bg-gray-100"
//             >
//               {isMenuOpen ? (
//                 <X className="w-6 h-6" />
//               ) : (
//                 <Menu className="w-6 h-6" />
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isMenuOpen && (
//         <div className="md:hidden bg-white border-b border-gray-200 py-4 px-4 space-y-4 animate-in slide-in-from-top duration-200 shadow-lg">
//           <Link
//             href="/#services"
//             onClick={() => setIsMenuOpen(false)}
//             className="block text-base font-medium text-gray-600"
//           >
//             Services
//           </Link>
//           <Link
//             href="/trade-in"
//             onClick={() => setIsMenuOpen(false)}
//             className="block text-base font-medium text-gray-600"
//           >
//             Trade-In
//           </Link>
//           <Link
//             href="/report"
//             onClick={() => setIsMenuOpen(false)}
//             className="block text-base font-medium text-gray-600"
//           >
//             IMEI Report
//           </Link>
//           <hr className="border-gray-100" />

//           {/* Mobile Admin Link */}
//           {session && isAdmin && (
//             <Link
//               href="/admin"
//               onClick={() => setIsMenuOpen(false)}
//               className="text-base font-bold text-apple-blue bg-blue-50 p-3 rounded-xl flex items-center"
//             >
//               <ShieldCheck className="w-5 h-5 mr-2" /> Admin Portal
//             </Link>
//           )}

//           {!session ? (
//             <>
//               <Link
//                 href="/login"
//                 onClick={() => setIsMenuOpen(false)}
//                 className="block text-base font-medium text-gray-600"
//               >
//                 Log In
//               </Link>
//               <Link
//                 href="/signup"
//                 onClick={() => setIsMenuOpen(false)}
//                 className="block text-base font-bold text-apple-blue"
//               >
//                 Sign Up
//               </Link>
//             </>
//           ) : (
//             <>
//               <Link
//                 href="/dashboard"
//                 onClick={() => setIsMenuOpen(false)}
//                 className="block text-base font-medium text-gray-600"
//               >
//                 My Dashboard
//               </Link>
//               <button
//                 type="button"
//                 onClick={handleLogout}
//                 className="block text-base font-medium text-red-500"
//               >
//                 Log Out
//               </button>
//             </>
//           )}
//           <Link
//             href="/book"
//             onClick={() => setIsMenuOpen(false)}
//             className="block w-full text-center bg-apple-dark text-white py-3 rounded-xl font-bold"
//           >
//             Book Repair
//           </Link>
//         </div>
//       )}
//     </nav>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { User, LogOut, ShieldCheck, Menu, X } from "lucide-react";

const checkAdminStatus = (email: string | undefined) => {
  if (!email) return false;
  return email.toLowerCase().endsWith("@ifixapple.com.ng");
};

export default function Navbar() {
  const [session, setSession] = useState<Session | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setIsAdmin(checkAdminStatus(currentSession?.user?.email));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setIsAdmin(checkAdminStatus(currentSession?.user?.email));
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMenuOpen(false);
    router.push("/");
  };

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group shrink-0">
            <div className="w-9 h-9 bg-apple-dark rounded-xl flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="w-5 h-5 text-white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="5" y="2" width="14" height="20" rx="3" ry="3"></rect>
                <path d="M12 18h.01" stroke="#0071E3"></path>
                <path d="M9 11h6" stroke="#0071E3"></path>
                <path d="M12 8v6" stroke="#0071E3"></path>
              </svg>
            </div>
            <span className="font-semibold text-xl tracking-tight text-apple-dark">
              iFixApple
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center md:space-x-5 lg:space-x-8">
            <Link
              href="/#services"
              className="text-sm font-medium text-gray-500 hover:text-apple-dark transition-colors whitespace-nowrap"
            >
              Services
            </Link>
            <Link
              href="/trade-in"
              className={
                pathname === "/trade-in"
                  ? "text-sm font-semibold text-apple-dark transition-colors whitespace-nowrap"
                  : "text-sm font-medium text-gray-500 hover:text-apple-dark transition-colors whitespace-nowrap"
              }
            >
              Trade-In
            </Link>
            <Link
              href="/#imei-report"
              className="text-sm font-medium text-gray-500 hover:text-apple-dark transition-colors whitespace-nowrap"
            >
              IMEI Report
            </Link>

            {/* STRICT ADMIN LINK: Only renders if domain is @ifixapple.com.ng */}
            {session && isAdmin && (
              <Link
                href="/admin"
                className="text-sm font-bold text-apple-blue hover:text-blue-700 flex items-center bg-blue-50 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap shrink-0"
              >
                <ShieldCheck className="w-4 h-4 mr-1" /> Admin
              </Link>
            )}
          </div>

          {/* Auth & Actions */}
          <div className="hidden md:flex items-center md:space-x-3 lg:space-x-4 shrink-0">
            <Link
              href="/book"
              className="bg-apple-dark text-white px-4 lg:px-5 py-2 rounded-full text-sm font-medium hover:bg-black transition-all whitespace-nowrap"
            >
              Book Repair
            </Link>

            <div className="h-6 w-px bg-gray-200"></div>

            {session ? (
              <div className="flex items-center space-x-3 lg:space-x-4">
                <Link
                  href="/dashboard"
                  aria-label="User Dashboard"
                  title="Dashboard"
                  className={
                    pathname === "/dashboard"
                      ? "text-apple-blue transition-colors"
                      : "text-gray-500 hover:text-apple-blue transition-colors"
                  }
                >
                  <User className="w-5 h-5" />
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  aria-label="Log Out"
                  className="text-gray-500 hover:text-red-500 transition-colors"
                  title="Log Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-500 hover:text-apple-dark transition-colors whitespace-nowrap"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-bold text-apple-blue hover:text-blue-700 transition-colors border-2 border-apple-blue px-4 py-1.5 rounded-full whitespace-nowrap"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="text-gray-500 p-2 rounded-lg hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 py-4 px-4 space-y-4 animate-in slide-in-from-top duration-200 shadow-lg">
          <Link
            href="/#services"
            onClick={() => setIsMenuOpen(false)}
            className="block text-base font-medium text-gray-600"
          >
            Services
          </Link>
          <Link
            href="/trade-in"
            onClick={() => setIsMenuOpen(false)}
            className="block text-base font-medium text-gray-600"
          >
            Trade-In
          </Link>
          <Link
            href="/#imei-report"
            onClick={() => setIsMenuOpen(false)}
            className="block text-base font-medium text-gray-600"
          >
            IMEI Report
          </Link>
          <hr className="border-gray-100" />

          {/* Mobile Admin Link */}
          {session && isAdmin && (
            <Link
              href="/admin"
              onClick={() => setIsMenuOpen(false)}
              className="text-base font-bold text-apple-blue bg-blue-50 p-3 rounded-xl flex items-center"
            >
              <ShieldCheck className="w-5 h-5 mr-2" /> Admin Portal
            </Link>
          )}

          {!session ? (
            <>
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block text-base font-medium text-gray-600"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsMenuOpen(false)}
                className="block text-base font-bold text-apple-blue"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="block text-base font-medium text-gray-600"
              >
                My Dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="block text-base font-medium text-red-500"
              >
                Log Out
              </button>
            </>
          )}
          <Link
            href="/book"
            onClick={() => setIsMenuOpen(false)}
            className="block w-full text-center bg-apple-dark text-white py-3 rounded-xl font-bold"
          >
            Book Repair
          </Link>
        </div>
      )}
    </nav>
  );
}