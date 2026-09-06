"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/2349077871875"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 p-4 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group flex items-center justify-center"
      title="Chat with us on WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />

      {/* Tooltip that expands on hover */}
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-semibold text-sm">
        <span className="pl-2 pr-1">Chat on WhatsApp</span>
      </span>
      
      {/* Online indicator dot */}
      <span className="absolute top-0 right-0 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-white border-2 border-[#25D366]"></span>
      </span>
    </a>
  );
}