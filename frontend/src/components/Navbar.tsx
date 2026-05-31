"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import { User, LogOut, ShieldCheck, Menu, X } from "lucide-react";

export default function Navbar() {
  const [session, setSession] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-apple-dark rounded-xl flex items-center justify-center text-white font-bold">
              iF
            </div>
            <span className="font-semibold text-xl tracking-tight text-apple-dark">
              iFixApple
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/#features" className="text-sm font-medium text-gray-500 hover:text-apple-dark transition-colors">
              Services
            </Link>
            <Link href="/status" className="text-sm font-medium text-gray-500 hover:text-apple-dark transition-colors">
              Check Status
            </Link>
            <Link href="/trade-in" className="text-sm font-medium text-gray-500 hover:text-apple-dark transition-colors">
              Trade-In
            </Link>
            {session && (
              <Link href="/admin" className="text-sm font-medium text-apple-blue hover:text-blue-700 flex items-center">
                <ShieldCheck className="w-4 h-4 mr-1" /> Admin
              </Link>
            )}
          </div>

          {/* Auth & Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/book" className="bg-apple-dark text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-black transition-all">
              Book Repair
            </Link>

            <div className="h-6 w-px bg-gray-200 mx-2"></div>

            {session ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-gray-500 hover:text-apple-blue transition-colors">
                  <User className="w-5 h-5" />
                </Link>
                <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-5">
                <Link href="/login" className="text-sm font-medium text-gray-500 hover:text-apple-dark transition-colors">
                  Log In
                </Link>
                <Link href="/signup" className="text-sm font-bold text-apple-blue hover:text-blue-700 transition-colors border-2 border-apple-blue px-4 py-1.5 rounded-full">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-500">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 py-4 px-4 space-y-4 animate-in slide-in-from-top duration-200">
          <Link href="/#features" className="block text-base font-medium text-gray-600">Services</Link>
          <Link href="/status" className="block text-base font-medium text-gray-600">Check Status</Link>
          <Link href="/trade-in" className="block text-base font-medium text-gray-600">Trade-In</Link>
          <hr className="border-gray-100" />
          {!session ? (
            <>
              <Link href="/login" className="block text-base font-medium text-gray-600">Log In</Link>
              <Link href="/signup" className="block text-base font-bold text-apple-blue">Sign Up</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="block text-base font-medium text-red-500">Log Out</button>
          )}
          <Link href="/book" className="block w-full text-center bg-apple-dark text-white py-3 rounded-xl font-bold">Book Repair</Link>
        </div>
      )}
    </nav>
  );
}
