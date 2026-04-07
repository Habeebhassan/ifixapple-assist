"use client";

import { ArrowRight, Wrench, ShieldCheck, Smartphone } from "lucide-react";
import Link from "next/link";
import ChatInterface from "@/components/chat/ChatInterface";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-apple-dark rounded-xl flex items-center justify-center text-white font-bold">
                iF
              </div>
              <span className="font-semibold text-xl tracking-tight text-apple-dark">
                iFixApple
              </span>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link href="#features" className="text-sm font-medium text-gray-500 hover:text-apple-dark transition-colors">
                Services
              </Link>
              
              <Link href="/status" className="text-sm font-medium text-gray-500 hover:text-apple-dark transition-colors">
                Check Status
              </Link>
              
              <Link href="/trade-in" className="text-sm font-medium text-gray-500 hover:text-apple-dark transition-colors">
                Trade-In
              </Link>
            </div>
            <div>
              <Link href="/book" className="bg-apple-dark text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-black transition-colors">
                Book Repair
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 text-center py-24 sm:py-32">
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-apple-dark max-w-4xl mb-6">
          Bring your Apple devices <br className="hidden sm:block" /> back to life.
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mb-10">
          Expert repairs, genuine parts, and instant AI diagnostics. Find out what's wrong with your device in seconds.
        </p>
        
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <button 
            onClick={() => typeof window !== 'undefined' && window.dispatchEvent(new Event('open-chat'))}
            className="bg-apple-blue text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center group"
          >
            Start AI Diagnosis
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <Link href="/status" className="bg-white border border-gray-300 text-apple-dark px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center">
            Check IMEI Status
          </Link>
        </div>
      </main>

      {/* Features Grid */}
      <section id="features" className="bg-white py-24 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-50 text-apple-blue rounded-2xl flex items-center justify-center mb-6">
                <Wrench className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Certified Repairs</h3>
              <p className="text-gray-500">Screen, battery, and logic board repairs completed by trained specialists.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-50 text-apple-blue rounded-2xl flex items-center justify-center mb-6">
                <Smartphone className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Troubleshooting</h3>
              <p className="text-gray-500">Chat with our Genius AI to instantly diagnose your device symptoms before you book.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-50 text-apple-blue rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Guaranteed Quality</h3>
              <p className="text-gray-500">Every repair comes with a comprehensive 1-year warranty for your peace of mind.</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Chat Interface */}
      <ChatInterface />
    </div>
  );
}
