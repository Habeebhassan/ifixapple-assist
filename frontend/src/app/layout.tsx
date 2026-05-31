import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ChatInterface from "@/components/chat/ChatInterface";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "iFixApple Assist",
  description: "Premium Apple Device Repairs & AI Diagnostics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-apple-gray text-apple-dark antialiased`}>
        <Navbar />
        {children}
        <ChatInterface />
      </body>
    </html>
  );
}
