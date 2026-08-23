"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { 
  Smartphone, 
  Clock, 
  CheckCircle2, 
  Wrench, 
  Loader2, 
  Package, 
  RefreshCw,
  XCircle,
  Tag
} from "lucide-react";
import Link from "next/link";

type Ticket = {
  id: number;
  device_model: string;
  issue_type: string;
  status: string;
  created_at: string;
};

type TradeIn = {
  id: number;
  device_details: { model: string; storage: string };
  grade: string;
  offered_price: number;
  status: string;
  created_at: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [tradeIns, setTradeIns] = useState<TradeIn[]>([]);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      // 1. Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/login");
        return;
      } 
      
      setUserId(session.user.id);

      // 2. Fetch Repair Tickets
      const { data: ticketData, error: ticketError } = await supabase
        .from("repair_tickets")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (!ticketError && ticketData) {
        setTickets(ticketData);
      }

      // 3. Fetch Trade-In (Swap) Offers
      const { data: tradeData, error: tradeError } = await supabase
        .from("trade_in_offers")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (!tradeError && tradeData) {
        setTradeIns(tradeData);
      }

      setLoading(false);
    };

    checkAuthAndFetchData();
  }, [router]);

  // Formats currency to Nigerian Naira for Lagos Strategy
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', { 
      style: 'currency', 
      currency: 'NGN', 
      maximumFractionDigits: 0 
    }).format(value);
  };

  // Helper functions for UI mapping
  const getTicketStatusDisplay = (status: string) => {
    switch (status) {
      case "Completed":
        return { icon: <CheckCircle2 className="w-5 h-5 mr-2" />, color: "text-green-600", bg: "bg-green-50", border: "border-green-100" };
      case "In Progress":
        return { icon: <Wrench className="w-5 h-5 mr-2" />, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" };
      case "Received":
      default:
        return { icon: <Clock className="w-5 h-5 mr-2" />, color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-100" };
    }
  };

  const getTradeInStatusDisplay = (status: string) => {
    switch (status) {
      case "Approved":
        return { icon: <CheckCircle2 className="w-5 h-5 mr-2" />, color: "text-green-600", bg: "bg-green-50", border: "border-green-100" };
      case "Rejected":
        return { icon: <XCircle className="w-5 h-5 mr-2" />, color: "text-red-600", bg: "bg-red-50", border: "border-red-100" };
      case "Pending Review":
      default:
        return { icon: <Clock className="w-5 h-5 mr-2" />, color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-100" };
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-apple-gray">
        <Loader2 className="w-8 h-8 animate-spin text-apple-blue" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-apple-gray pb-12 flex flex-col items-center animate-in fade-in duration-300">
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h2 className="text-3xl md:text-4xl font-bold text-apple-dark mb-8 tracking-tight">Welcome back.</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Column: Tickets & Trade-Ins */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Active Tickets Panel */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold mb-6 flex items-center text-apple-dark">
                    <Wrench className="w-6 h-6 mr-3 text-apple-blue" />
                    Your Active Repairs
                  </h3>
                  
                  {tickets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-center bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                      <p className="text-gray-500 font-medium">No active repair tickets found.</p>
                      <p className="text-sm text-gray-400 mt-2">Book a repair and track its progress here.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {tickets.map((ticket) => {
                        const statusUI = getTicketStatusDisplay(ticket.status || "Received");
                        return (
                          <div key={`ticket-${ticket.id}`} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow bg-white group">
                            <div className="flex items-start space-x-4 mb-4 sm:mb-0">
                              <div className={`p-3 rounded-xl ${statusUI.bg} ${statusUI.color}`}>
                                <Smartphone className="w-6 h-6" />
                              </div>
                              <div>
                                <h4 className="font-bold text-apple-dark">{ticket.device_model}</h4>
                                <p className="text-sm text-gray-500">{ticket.issue_type}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                  Submitted on {new Date(ticket.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            
                            <div className={`flex items-center px-4 py-2 rounded-full border ${statusUI.bg} ${statusUI.color} ${statusUI.border} self-start sm:self-auto`}>
                              {statusUI.icon}
                              <span className="font-semibold text-sm">{ticket.status || "Received"}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
              </div>

              {/* Trade-In (Swap) Offers Panel */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold mb-6 flex items-center text-apple-dark">
                    <RefreshCw className="w-6 h-6 mr-3 text-purple-600" />
                    Your Swap & Upgrade Offers
                  </h3>
                  
                  {tradeIns.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-center bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                      <p className="text-gray-500 font-medium">No swap offers found.</p>
                      <p className="text-sm text-gray-400 mt-2">Get an instant quote to swap your old device.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {tradeIns.map((trade) => {
                        const statusUI = getTradeInStatusDisplay(trade.status || "Pending Review");
                        return (
                          <div key={`trade-${trade.id}`} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow bg-white group">
                            <div className="flex items-start space-x-4 mb-4 sm:mb-0">
                              <div className={`p-3 rounded-xl bg-purple-50 text-purple-600`}>
                                <Tag className="w-6 h-6" />
                              </div>
                              <div>
                                <h4 className="font-bold text-apple-dark">{trade.device_details?.model || "Device"}</h4>
                                <div className="flex items-center text-sm text-gray-500 space-x-2">
                                  <span>{trade.device_details?.storage || "N/A"}</span>
                                  <span>•</span>
                                  <span className="font-medium text-gray-700">{formatCurrency(trade.offered_price)}</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                  {trade.grade} condition • Offered on {new Date(trade.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            
                            <div className={`flex items-center px-4 py-2 rounded-full border ${statusUI.bg} ${statusUI.color} ${statusUI.border} self-start sm:self-auto`}>
                              {statusUI.icon}
                              <span className="font-semibold text-sm">{trade.status || "Pending Review"}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
              </div>

            </div>

            {/* Right Column: Quick Actions Panel */}
            <div className="bg-apple-dark text-white rounded-3xl p-8 shadow-sm flex flex-col justify-center items-center text-center lg:sticky lg:top-24">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-3">Need our help?</h4>
                <p className="text-gray-400 mb-8 text-sm">Talk to our AI Genius, book a repair, or swap another device.</p>
                
                <button 
                  onClick={() => {
                    router.push("/");
                    setTimeout(() => window.dispatchEvent(new Event('open-chat')), 500);
                  }}
                  className="block w-full text-center bg-white text-apple-dark py-3.5 rounded-full font-bold hover:bg-gray-100 transition-colors"
                >
                    Start New Chat
                </button>
                
                <Link href="/book" className="block w-full text-center bg-transparent border border-white/20 text-white py-3.5 rounded-full font-semibold hover:bg-white/10 transition-colors mt-3">
                    Book a Repair
                </Link>

                <div className="w-full h-px bg-white/10 my-6"></div>
                
                <Link href="/trade-in" className="flex items-center justify-center w-full text-center text-apple-blue font-semibold hover:text-white transition-colors">
                  <RefreshCw className="w-4 h-4 mr-2" /> Swap a Device
                </Link>
            </div>

        </div>
      </main>
    </div>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import { supabase } from "@/lib/supabase";
// import { useRouter } from "next/navigation";
// import { 
//   Smartphone, 
//   Clock, 
//   CheckCircle2, 
//   Wrench, 
//   Loader2, 
//   Package, 
//   RefreshCw,
//   XCircle,
//   Tag
// } from "lucide-react";
// import Link from "next/link";

// type Ticket = {
//   id: number;
//   device_model: string;
//   issue_type: string;
//   status: string;
//   created_at: string;
// };

// type TradeIn = {
//   id: number;
//   device_details: { model: string; storage: string };
//   grade: string;
//   offered_price: number;
//   status: string;
//   created_at: string;
// };

// export default function DashboardPage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [userId, setUserId] = useState<string | null>(null);
  
//   const [tickets, setTickets] = useState<Ticket[]>([]);
//   const [tradeIns, setTradeIns] = useState<TradeIn[]>([]);

//   useEffect(() => {
//     const checkAuthAndFetchData = async () => {
//       // 1. Get current user session
//       const { data: { session } } = await supabase.auth.getSession();
      
//       if (!session) {
//         router.push("/login");
//         return;
//       } 
      
//       setUserId(session.user.id);

//       // 2. Fetch Repair Tickets
//       const { data: ticketData, error: ticketError } = await supabase
//         .from("repair_tickets")
//         .select("*")
//         .eq("user_id", session.user.id)
//         .order("created_at", { ascending: false });

//       if (!ticketError && ticketData) {
//         setTickets(ticketData);
//       }

//       // 3. Fetch Trade-In Offers
//       const { data: tradeData, error: tradeError } = await supabase
//         .from("trade_in_offers")
//         .select("*")
//         .eq("user_id", session.user.id)
//         .order("created_at", { ascending: false });

//       if (!tradeError && tradeData) {
//         setTradeIns(tradeData);
//       }

//       setLoading(false);
//     };

//     checkAuthAndFetchData();
//   }, [router]);

//   // Helper function for currency formatting
//   const formatCurrency = (value: number) => {
//     return new Intl.NumberFormat('en-US', { 
//       style: 'currency', 
//       currency: 'USD', 
//       maximumFractionDigits: 0 
//     }).format(value);
//   };

//   // Helper function to render the correct icon and color based on ticket status
//   const getTicketStatusDisplay = (status: string) => {
//     switch (status) {
//       case "Completed":
//         return { icon: <CheckCircle2 className="w-5 h-5 mr-2" />, color: "text-green-600", bg: "bg-green-50", border: "border-green-100" };
//       case "In Progress":
//         return { icon: <Wrench className="w-5 h-5 mr-2" />, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" };
//       case "Received":
//       default:
//         return { icon: <Clock className="w-5 h-5 mr-2" />, color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-100" };
//     }
//   };

//   // Helper function to render the correct icon and color based on trade-in status
//   const getTradeInStatusDisplay = (status: string) => {
//     switch (status) {
//       case "Approved":
//         return { icon: <CheckCircle2 className="w-5 h-5 mr-2" />, color: "text-green-600", bg: "bg-green-50", border: "border-green-100" };
//       case "Rejected":
//         return { icon: <XCircle className="w-5 h-5 mr-2" />, color: "text-red-600", bg: "bg-red-50", border: "border-red-100" };
//       case "Pending Review":
//       default:
//         return { icon: <Clock className="w-5 h-5 mr-2" />, color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-100" };
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-apple-gray">
//         <Loader2 className="w-8 h-8 animate-spin text-apple-blue" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-[calc(100vh-64px)] bg-apple-gray pb-12 flex flex-col items-center animate-in fade-in duration-300">
//       <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
//         <h2 className="text-3xl md:text-4xl font-bold text-apple-dark mb-8 tracking-tight">Welcome back.</h2>
        
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
//             {/* Left Column: Tickets & Trade-Ins */}
//             <div className="lg:col-span-2 space-y-8">
              
//               {/* Active Tickets Panel */}
//               <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
//                   <h3 className="text-xl font-semibold mb-6 flex items-center text-apple-dark">
//                     <Wrench className="w-6 h-6 mr-3 text-apple-blue" />
//                     Your Active Repairs
//                   </h3>
                  
//                   {tickets.length === 0 ? (
//                     <div className="flex flex-col items-center justify-center h-48 text-center bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
//                       <p className="text-gray-500 font-medium">No active repair tickets found.</p>
//                       <p className="text-sm text-gray-400 mt-2">Book a repair and track its progress here.</p>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       {tickets.map((ticket) => {
//                         const statusUI = getTicketStatusDisplay(ticket.status || "Received");
//                         return (
//                           <div key={`ticket-${ticket.id}`} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow bg-white group">
//                             <div className="flex items-start space-x-4 mb-4 sm:mb-0">
//                               <div className={`p-3 rounded-xl ${statusUI.bg} ${statusUI.color}`}>
//                                 <Smartphone className="w-6 h-6" />
//                               </div>
//                               <div>
//                                 <h4 className="font-bold text-apple-dark">{ticket.device_model}</h4>
//                                 <p className="text-sm text-gray-500">{ticket.issue_type}</p>
//                                 <p className="text-xs text-gray-400 mt-1">
//                                   Submitted on {new Date(ticket.created_at).toLocaleDateString()}
//                                 </p>
//                               </div>
//                             </div>
                            
//                             <div className={`flex items-center px-4 py-2 rounded-full border ${statusUI.bg} ${statusUI.color} ${statusUI.border} self-start sm:self-auto`}>
//                               {statusUI.icon}
//                               <span className="font-semibold text-sm">{ticket.status || "Received"}</span>
//                             </div>
//                           </div>
//                         )
//                       })}
//                     </div>
//                   )}
//               </div>

//               {/* Trade-In Offers Panel */}
//               <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
//                   <h3 className="text-xl font-semibold mb-6 flex items-center text-apple-dark">
//                     <RefreshCw className="w-6 h-6 mr-3 text-purple-600" />
//                     Your Trade-In Offers
//                   </h3>
                  
//                   {tradeIns.length === 0 ? (
//                     <div className="flex flex-col items-center justify-center h-48 text-center bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
//                       <p className="text-gray-500 font-medium">No trade-in offers found.</p>
//                       <p className="text-sm text-gray-400 mt-2">Get an instant quote for your old devices.</p>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       {tradeIns.map((trade) => {
//                         const statusUI = getTradeInStatusDisplay(trade.status || "Pending Review");
//                         return (
//                           <div key={`trade-${trade.id}`} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow bg-white group">
//                             <div className="flex items-start space-x-4 mb-4 sm:mb-0">
//                               <div className={`p-3 rounded-xl bg-purple-50 text-purple-600`}>
//                                 <Tag className="w-6 h-6" />
//                               </div>
//                               <div>
//                                 <h4 className="font-bold text-apple-dark">{trade.device_details?.model || "Device"}</h4>
//                                 <div className="flex items-center text-sm text-gray-500 space-x-2">
//                                   <span>{trade.device_details?.storage || "N/A"}</span>
//                                   <span>•</span>
//                                   <span className="font-medium text-gray-700">{formatCurrency(trade.offered_price)}</span>
//                                 </div>
//                                 <p className="text-xs text-gray-400 mt-1">
//                                   {trade.grade} condition • Offered on {new Date(trade.created_at).toLocaleDateString()}
//                                 </p>
//                               </div>
//                             </div>
                            
//                             <div className={`flex items-center px-4 py-2 rounded-full border ${statusUI.bg} ${statusUI.color} ${statusUI.border} self-start sm:self-auto`}>
//                               {statusUI.icon}
//                               <span className="font-semibold text-sm">{trade.status || "Pending Review"}</span>
//                             </div>
//                           </div>
//                         )
//                       })}
//                     </div>
//                   )}
//               </div>

//             </div>

//             {/* Right Column: Quick Actions Panel */}
//             <div className="bg-apple-dark text-white rounded-3xl p-8 shadow-sm flex flex-col justify-center items-center text-center lg:sticky lg:top-24">
//                 <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6">
//                   <Package className="w-8 h-8 text-white" />
//                 </div>
//                 <h4 className="text-xl font-semibold mb-3">Need our help?</h4>
//                 <p className="text-gray-400 mb-8 text-sm">Talk to our AI Genius, book a repair, or value another device.</p>
                
//                 <button 
//                   onClick={() => {
//                     router.push("/");
//                     setTimeout(() => window.dispatchEvent(new Event('open-chat')), 500);
//                   }}
//                   className="block w-full text-center bg-white text-apple-dark py-3.5 rounded-full font-bold hover:bg-gray-100 transition-colors"
//                 >
//                     Start New Chat
//                 </button>
                
//                 <Link href="/book" className="block w-full text-center bg-transparent border border-white/20 text-white py-3.5 rounded-full font-semibold hover:bg-white/10 transition-colors mt-3">
//                     Book a Repair
//                 </Link>

//                 <div className="w-full h-px bg-white/10 my-6"></div>
                
//                 <Link href="/trade-in" className="flex items-center justify-center w-full text-center text-apple-blue font-semibold hover:text-white transition-colors">
//                   <RefreshCw className="w-4 h-4 mr-2" /> Sell a Device
//                 </Link>
//             </div>

//         </div>
//       </main>
//     </div>
//   );
// }