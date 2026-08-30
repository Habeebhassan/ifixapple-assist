import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

// Correct Next.js SEO configuration (Only works in Server Components)
export const metadata: Metadata = {
  title: "iFixApple | Premium Apple Device Repairs Lagos",
  description: "Lagos' premier independent Apple device repair and swap laboratory in the Lekki/Ajah axis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} bg-zinc-50 text-zinc-950 antialiased h-full flex flex-col`}>
        
        {/* Global Navigation */}
        <Navbar />
        
        {/* Main Content Area Container */}
        <main className="flex-grow flex flex-col relative z-10">
          <div className="flex-grow flex flex-col">
            {children}
          </div>
        </main>

        {/* Global Footer */}
        <Footer />
        
      </body>
    </html>
  );
}



// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import "./globals.css";
// import Navbar from "@/components/Navbar";
// import ChatInterface from "@/components/chat/ChatInterface";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "iFixApple Assist",
//   description: "Premium Apple Device Repairs & AI Diagnostics",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body className={`${inter.className} bg-apple-gray text-apple-dark antialiased`}>
//         <Navbar />
//         {children}
//         <ChatInterface />
//       </body>
//     </html>
//   );
// }
