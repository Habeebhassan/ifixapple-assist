"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Loader2, 
  CheckCircle2, 
  ArrowRight, 
  XCircle,
  Smartphone
} from "lucide-react";

type Ticket = {
  id: number;
  user_id: string;
  device_model: string;
  issue_type: string;
  status: string;
  created_at: string;
};

type TradeIn = {
  id: number;
  user_id: string;
  device_details: any;
  grade: string;
  offered_price: number;
  status: string;
  created_at: string;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"tickets" | "trade-ins">("tickets");
  
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [tradeIns, setTradeIns] = useState<TradeIn[]>([]);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      // 1. Check Authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      // 2. Fetch Data
      await fetchTickets();
      await fetchTradeIns();
      setLoading(false);
    };

    checkAuthAndFetchData();
  }, [router]);

  const fetchTickets = async () => {
    const { data, error } = await supabase
      .from("repair_tickets")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (!error && data) setTickets(data);
  };

  const fetchTradeIns = async () => {
    const { data, error } = await supabase
      .from("trade_in_offers")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (!error && data) setTradeIns(data);
  };

  // Move a ticket to the next phase
  const advanceTicketStatus = async (id: number, currentStatus: string) => {
    setActionLoading(id);
    let newStatus = "In Progress";
    if (currentStatus === "In Progress") newStatus = "Completed";

    const { error } = await supabase
      .from("repair_tickets")
      .update({ status: newStatus })
      .eq("id", id);

    if (!error) {
      setTickets(tickets.map(t => t.id === id ? { ...t, status: newStatus } : t));
    } else {
      console.error("Failed to update status", error);
    }
    setActionLoading(null);
  };

  // Update a trade-in offer (Approve or Reject)
  const updateTradeInStatus = async (id: number, newStatus: string) => {
    setActionLoading(id);
    const { error } = await supabase
      .from("trade_in_offers")
      .update({ status: newStatus })
      .eq("id", id);

    if (!error) {
      setTradeIns(tradeIns.map(t => t.id === id ? { ...t, status: newStatus } : t));
    } else {
      console.error("Failed to update trade-in status", error);
    }
    setActionLoading(null);
  };

  if (loading) {
    return (
      <div className="flex-1 w-full flex items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-apple-blue" />
      </div>
    );
  }

  // Kanban Columns Data
  const receivedTickets = tickets.filter(t => t.status === "Received" || !t.status);
  const inProgressTickets = tickets.filter(t => t.status === "In Progress");
  const completedTickets = tickets.filter(t => t.status === "Completed");

  return (
    <div className="flex-1 bg-apple-gray flex flex-col p-4 sm:p-8">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-apple-dark flex items-center">
              <LayoutDashboard className="w-8 h-8 mr-3 text-apple-blue" />
              Admin Control Center
            </h1>
            <p className="text-gray-500 mt-2">Manage incoming repair tickets and trade-in reviews.</p>
          </div>

          {/* Custom Tabs */}
          <div className="flex bg-gray-200/50 p-1 rounded-full w-full md:w-auto">
            <button
              onClick={() => setActiveTab("tickets")}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeTab === "tickets" ? "bg-white text-apple-dark shadow-sm" : "text-gray-500 hover:text-apple-dark"
              }`}
            >
              Repair Tickets
            </button>
            <button
              onClick={() => setActiveTab("trade-ins")}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeTab === "trade-ins" ? "bg-white text-apple-dark shadow-sm" : "text-gray-500 hover:text-apple-dark"
              }`}
            >
              Trade-In Offers
            </button>
          </div>
        </div>

        {/* ==================================================== */}
        {/* REPAIR TICKETS KANBAN BOARD                          */}
        {/* ==================================================== */}
        {activeTab === "tickets" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
            
            {/* Column 1: Received */}
            <div className="bg-gray-100/50 rounded-3xl p-6 border border-gray-200/50 flex flex-col h-[600px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-700 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></span>
                  New Requests
                </h3>
                <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-full">{receivedTickets.length}</span>
              </div>
              <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pb-4 pr-2">
                {receivedTickets.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No new tickets.</p>}
                {receivedTickets.map(ticket => (
                  <div key={ticket.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 group">
                    <h4 className="font-bold text-apple-dark text-sm mb-1">{ticket.issue_type}</h4>
                    <p className="text-xs text-gray-500 mb-4">{ticket.device_model}</p>
                    <button 
                      onClick={() => advanceTicketStatus(ticket.id, ticket.status || "Received")}
                      disabled={actionLoading === ticket.id}
                      className="w-full bg-gray-50 hover:bg-apple-blue hover:text-white text-apple-dark py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center"
                    >
                      {actionLoading === ticket.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Start Repair <ArrowRight className="w-3 h-3 ml-1" /></>}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: In Progress */}
            <div className="bg-blue-50/50 rounded-3xl p-6 border border-blue-100/50 flex flex-col h-[600px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-blue-900 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-apple-blue mr-2"></span>
                  In Progress
                </h3>
                <span className="bg-blue-200/50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">{inProgressTickets.length}</span>
              </div>
              <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pb-4 pr-2">
                {inProgressTickets.length === 0 && <p className="text-sm text-blue-400/70 text-center py-4">No active repairs.</p>}
                {inProgressTickets.map(ticket => (
                  <div key={ticket.id} className="bg-white p-5 rounded-2xl shadow-sm border border-blue-100">
                    <h4 className="font-bold text-apple-dark text-sm mb-1">{ticket.issue_type}</h4>
                    <p className="text-xs text-gray-500 mb-4">{ticket.device_model}</p>
                    <button 
                      onClick={() => advanceTicketStatus(ticket.id, ticket.status)}
                      disabled={actionLoading === ticket.id}
                      className="w-full bg-blue-50 hover:bg-green-500 hover:text-white text-apple-blue py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center"
                    >
                      {actionLoading === ticket.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Mark Completed <CheckCircle2 className="w-3 h-3 ml-1" /></>}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Completed */}
            <div className="bg-green-50/50 rounded-3xl p-6 border border-green-100/50 flex flex-col h-[600px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-green-900 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  Ready for Pickup
                </h3>
                <span className="bg-green-200/50 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">{completedTickets.length}</span>
              </div>
              <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pb-4 pr-2">
                {completedTickets.length === 0 && <p className="text-sm text-green-400/70 text-center py-4">No completed repairs.</p>}
                {completedTickets.map(ticket => (
                  <div key={ticket.id} className="bg-white p-5 rounded-2xl shadow-sm border border-green-100 opacity-80">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-gray-900 text-sm">{ticket.issue_type}</h4>
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-xs text-gray-500">{ticket.device_model}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ==================================================== */}
        {/* TRADE-IN OFFERS REVIEW LIST                          */}
        {/* ==================================================== */}
        {activeTab === "trade-ins" && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50/80 text-xs uppercase text-gray-500 font-semibold border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Device Details</th>
                    <th className="px-6 py-4">Condition</th>
                    <th className="px-6 py-4">Estimated Payout</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tradeIns.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                        No trade-in offers pending review.
                      </td>
                    </tr>
                  )}
                  {tradeIns.map((offer) => (
                    <tr key={offer.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                            <Smartphone className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-bold text-apple-dark">{offer.device_details?.model || 'Unknown Device'}</p>
                            <p className="text-xs text-gray-500">{offer.device_details?.storage || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-semibold">
                          {offer.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-apple-dark">
                        ${offer.offered_price}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center
                          ${offer.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                            offer.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
                            'bg-yellow-100 text-yellow-700'}`}
                        >
                          {offer.status || 'Pending Review'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {(!offer.status || offer.status === 'Pending Review') ? (
                          <>
                            <button 
                              onClick={() => updateTradeInStatus(offer.id, 'Approved')}
                              disabled={actionLoading === offer.id}
                              className="text-green-600 hover:bg-green-50 p-2 rounded-lg transition-colors inline-flex items-center disabled:opacity-50"
                              title="Approve Offer"
                            >
                              <CheckCircle2 className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => updateTradeInStatus(offer.id, 'Rejected')}
                              disabled={actionLoading === offer.id}
                              className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors inline-flex items-center disabled:opacity-50"
                              title="Reject Offer"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400 font-medium px-2">Completed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}



