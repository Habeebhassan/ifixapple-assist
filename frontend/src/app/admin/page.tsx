'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle,
  XCircle,
  Plus,
  RefreshCw,
  Smartphone,
  Trash2,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { apiService } from '@/services/api';
import { supabase } from '@/lib/supabase';

interface RepairTicket {
  id: string;
  user_id: string;
  device_model: string;
  issue_type: string;
  status: string;
  quote_amount?: number | null;
  created_at: string;
}

interface TradeInOffer {
  id: string;
  user_id: string;
  device_details: any;
  grade?: string;
  offered_price?: number;
  status?: string;
  created_at?: string;
}

interface CatalogDevice {
  id: string | number;
  category: string;
  model_name: string;
  base_value: number;
  created_at?: string;
}

const DEVICE_CATEGORIES = [
  'iPhone',
  'MacBook',
  'iPad',
  'iMac',
  'Apple Watch',
  'Apple TV',
  'Headphones',
];

const normalizeStatus = (status?: string) => (status || '').toLowerCase().trim();
const isCompletedStatus = (status?: string) =>
  ['completed', 'ready', 'ready for pickup', 'ready_for_pickup', 'done'].includes(
    normalizeStatus(status)
  );
const isInProgressStatus = (status?: string) =>
  ['in progress', 'in_progress', 'repairing'].includes(normalizeStatus(status));
const isNewStatus = (status?: string) =>
  !isInProgressStatus(status) && !isCompletedStatus(status);

function parseTradeInDetails(details: any): { title: string; subtitle: string } {
  if (!details) return { title: 'Unknown Device', subtitle: 'No specs provided' };
  if (typeof details === 'string') return { title: details, subtitle: '' };

  const title =
    details.model_name ||
    details.device_model ||
    details.model ||
    details.device ||
    'Apple Device';

  const parts = [
    details.storage || details.storage_capacity,
    details.condition,
    details.imei ? `IMEI: ${details.imei}` : null,
  ].filter(Boolean);

  return {
    title: String(title),
    subtitle: parts.length > 0 ? parts.join(' • ') : '',
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [authChecking, setAuthChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const [activeTab, setActiveTab] = useState<'tickets' | 'trade-in' | 'pricing'>('tickets');
  const [loadingData, setLoadingData] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Live Supabase state
  const [tickets, setTickets] = useState<RepairTicket[]>([]);
  const [tradeIns, setTradeIns] = useState<TradeInOffer[]>([]);
  const [devices, setDevices] = useState<CatalogDevice[]>([]);

  // Action loading states
  const [updatingTicketId, setUpdatingTicketId] = useState<string | null>(null);
  const [savingDevice, setSavingDevice] = useState(false);
  const [newDevice, setNewDevice] = useState({
    category: 'iPhone',
    model_name: '',
    base_value: '',
  });

  const fetchAllData = useCallback(async () => {
    setLoadingData(true);
    setErrorMsg(null);
    try {
      const [ticketsRes, tradeInsRes, catalogRes] = await Promise.all([
        supabase
          .from('repair_tickets')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('trade_in_offers')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('device_catalog')
          .select('*')
          .order('created_at', { ascending: false }),
      ]);

      if (ticketsRes.error) throw new Error(`Tickets: ${ticketsRes.error.message}`);
      if (catalogRes.error) throw new Error(`Catalog: ${catalogRes.error.message}`);
      if (tradeInsRes.error) throw new Error(`Trade-Ins: ${tradeInsRes.error.message}`);

      setTickets(ticketsRes.data || []);
      setTradeIns(tradeInsRes.data || []);
      setDevices(catalogRes.data || []);
    } catch (err: any) {
      console.error('Admin fetch error:', err);
      setErrorMsg(err.message || 'Failed to load data from Supabase.');
    } finally {
      setLoadingData(false);
    }
  }, []);

  // Verify @ifixapple.com.ng staff access
  useEffect(() => {
    const verifyStaff = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !user.email?.toLowerCase().endsWith('@ifixapple.com.ng')) {
        router.replace('/dashboard');
        return;
      }

      setAuthorized(true);
      setAuthChecking(false);
      fetchAllData();
    };

    verifyStaff();
  }, [router, fetchAllData]);

  // Persist ticket status via FastAPI (triggers DB update + email background task)
  const handleUpdateTicketStatus = async (ticket: RepairTicket, newStatus: string) => {
    setUpdatingTicketId(ticket.id);
    setErrorMsg(null);
    try {
      await apiService.updateTicketStatus(ticket.id, newStatus, ticket.device_model);
      setTickets((prev) =>
        prev.map((t) => (t.id === ticket.id ? { ...t, status: newStatus } : t))
      );
    } catch (err: any) {
      console.error('Ticket update error:', err);
      setErrorMsg(err.message || 'Failed to update ticket status. Please try again.');
    } finally {
      setUpdatingTicketId(null);
    }
  };

  // Persist new device into Supabase device_catalog
  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDevice.model_name.trim() || !newDevice.base_value) return;

    setSavingDevice(true);
    setErrorMsg(null);
    try {
      const { data, error } = await supabase
        .from('device_catalog')
        .insert([
          {
            category: newDevice.category,
            model_name: newDevice.model_name.trim(),
            base_value: parseInt(newDevice.base_value, 10),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setDevices((prev) => [data, ...prev]);
      setNewDevice({ category: 'iPhone', model_name: '', base_value: '' });
    } catch (err: any) {
      console.error('Add device error:', err);
      setErrorMsg(err.message || 'Failed to add device to catalog.');
    } finally {
      setSavingDevice(false);
    }
  };

  // Delete device from Supabase device_catalog
  const handleRemoveDevice = async (id: string | number) => {
    setErrorMsg(null);
    try {
      const { error } = await supabase.from('device_catalog').delete().eq('id', id);
      if (error) throw error;
      setDevices((prev) => prev.filter((d) => d.id !== id));
    } catch (err: any) {
      console.error('Delete device error:', err);
      setErrorMsg(err.message || 'Failed to delete device from catalog.');
    }
  };

  // Persist trade-in approval/rejection to Supabase
  const handleUpdateTradeInStatus = async (id: string, newStatus: string) => {
    setErrorMsg(null);
    try {
      const { error } = await supabase
        .from('trade_in_offers')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setTradeIns((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
      );
    } catch (err: any) {
      console.error('Trade-in update error:', err);
      setErrorMsg(err.message || 'Failed to update trade-in offer status.');
    }
  };

  if (authChecking || !authorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3 text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-sm font-medium">Verifying staff credentials...</span>
        </div>
      </div>
    );
  }

  const newTickets = tickets.filter((t) => isNewStatus(t.status));
  const inProgressTickets = tickets.filter((t) => isInProgressStatus(t.status));
  const completedTickets = tickets.filter((t) => isCompletedStatus(t.status));

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header & Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <ShieldCheck className="w-8 h-8 mr-3 text-blue-600" />
              Admin Control Center
            </h1>
            <p className="text-gray-500 mt-1">Secure staff portal for iFixApple operations.</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={fetchAllData}
              disabled={loadingData}
              className="p-2.5 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              title="Refresh live data"
            >
              <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
            </button>
            <div className="bg-gray-200/50 p-1 rounded-lg flex space-x-1">
              <button
                onClick={() => setActiveTab('tickets')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'tickets'
                    ? 'bg-white shadow-sm text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Repair Tickets
              </button>
              <button
                onClick={() => setActiveTab('trade-in')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'trade-in'
                    ? 'bg-white shadow-sm text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Trade-In Offers
              </button>
              <button
                onClick={() => setActiveTab('pricing')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'pricing'
                    ? 'bg-white shadow-sm text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Pricing Engine
              </button>
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between text-red-700 text-sm">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-xs font-semibold underline ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* TAB 1: REPAIR TICKETS (Kanban) */}
        {activeTab === 'tickets' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: New Requests */}
            <div className="bg-gray-100/50 rounded-xl p-4 border border-gray-200 border-dashed">
              <h3 className="font-bold text-gray-700 mb-4 flex items-center">
                <span className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></span>
                New Requests ({newTickets.length})
              </h3>
              <div className="space-y-3">
                {newTickets.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-6">No new requests.</p>
                ) : (
                  newTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                    >
                      <p className="font-bold text-sm text-gray-900">{ticket.issue_type}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {ticket.device_model}
                        {ticket.quote_amount
                          ? ` • ₦${Number(ticket.quote_amount).toLocaleString()}`
                          : ''}
                      </p>
                      <button
                        disabled={updatingTicketId === ticket.id}
                        onClick={() => handleUpdateTicketStatus(ticket, 'In Progress')}
                        className="mt-4 w-full py-2 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 border border-gray-200 rounded-md text-xs font-bold text-gray-700 transition-colors"
                      >
                        {updatingTicketId === ticket.id ? 'Updating...' : 'Start Repair →'}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Column 2: In Progress */}
            <div className="bg-gray-100/50 rounded-xl p-4 border border-gray-200 border-dashed">
              <h3 className="font-bold text-gray-700 mb-4 flex items-center">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                In Progress ({inProgressTickets.length})
              </h3>
              <div className="space-y-3">
                {inProgressTickets.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-6">No active repairs.</p>
                ) : (
                  inProgressTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="bg-white p-4 rounded-lg shadow-sm border border-blue-200"
                    >
                      <p className="font-bold text-sm text-gray-900">{ticket.issue_type}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {ticket.device_model}
                        {ticket.quote_amount
                          ? ` • ₦${Number(ticket.quote_amount).toLocaleString()}`
                          : ''}
                      </p>
                      <button
                        disabled={updatingTicketId === ticket.id}
                        onClick={() => handleUpdateTicketStatus(ticket, 'Completed')}
                        className="mt-4 w-full py-2 bg-blue-50 hover:bg-blue-100 disabled:opacity-50 border border-blue-200 rounded-md text-xs font-bold text-blue-700 transition-colors"
                      >
                        {updatingTicketId === ticket.id ? (
                          'Updating...'
                        ) : (
                          <>
                            Mark Completed <CheckCircle className="inline w-3 h-3 ml-1" />
                          </>
                        )}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Column 3: Ready for Pickup */}
            <div className="bg-gray-100/50 rounded-xl p-4 border border-gray-200 border-dashed">
              <h3 className="font-bold text-gray-700 mb-4 flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                Ready for Pickup ({completedTickets.length})
              </h3>
              <div className="space-y-3">
                {completedTickets.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-6">No completed repairs.</p>
                ) : (
                  completedTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="bg-white p-4 rounded-lg shadow-sm border border-green-200 flex items-start justify-between"
                    >
                      <div>
                        <p className="font-bold text-sm text-gray-900">{ticket.issue_type}</p>
                        <p className="text-xs text-gray-500 mt-1">{ticket.device_model}</p>
                      </div>
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TRADE-IN OFFERS */}
        {activeTab === 'trade-in' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Customer Trade-In Valuations</h2>
              <button
                onClick={fetchAllData}
                className="text-sm text-blue-600 flex items-center hover:underline"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loadingData ? 'animate-spin' : ''}`} />
                Refresh Data
              </button>
            </div>
            {tradeIns.length === 0 ? (
              <div className="p-12 text-center text-gray-500 text-sm">
                No trade-in offers submitted yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                      <th className="p-4 font-medium">Device & Specs</th>
                      <th className="p-4 font-medium">Grade</th>
                      <th className="p-4 font-medium">Offered Price</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {tradeIns.map((trade) => {
                      const parsed = parseTradeInDetails(trade.device_details);
                      const statusLabel = trade.status || 'Pending Review';
                      return (
                        <tr key={trade.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-4">
                            <p className="font-medium text-gray-900 text-sm">{parsed.title}</p>
                            {parsed.subtitle && (
                              <p className="text-xs text-gray-500">{parsed.subtitle}</p>
                            )}
                          </td>
                          <td className="p-4 text-sm text-gray-600">{trade.grade || '—'}</td>
                          <td className="p-4 font-bold text-gray-900">
                            ₦ {Number(trade.offered_price || 0).toLocaleString()}
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                normalizeStatus(statusLabel) === 'approved'
                                  ? 'bg-green-100 text-green-800'
                                  : normalizeStatus(statusLabel) === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {statusLabel}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => handleUpdateTradeInStatus(trade.id, 'Approved')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleUpdateTradeInStatus(trade.id, 'Rejected')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PRICING ENGINE */}
        {activeTab === 'pricing' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Plus className="w-5 h-5 mr-2 text-blue-600" /> Add to Catalog
              </h2>
              <form onSubmit={handleAddDevice} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newDevice.category}
                    onChange={(e) => setNewDevice({ ...newDevice, category: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                  >
                    {DEVICE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model Name</label>
                  <input
                    type="text"
                    placeholder="e.g., iPhone 17 Pro Max"
                    value={newDevice.model_name}
                    onChange={(e) => setNewDevice({ ...newDevice, model_name: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Base Trade-In Value (₦)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 1500000"
                    value={newDevice.base_value}
                    onChange={(e) => setNewDevice({ ...newDevice, base_value: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={savingDevice}
                  className="w-full py-3 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-black disabled:opacity-50 transition-colors"
                >
                  {savingDevice ? 'Saving...' : 'Save Device'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">Live Pricing Database</h2>
                <span className="text-xs bg-green-100 px-3 py-1 rounded-full text-green-800 font-medium">
                  {devices.length} Active Devices
                </span>
              </div>

              {devices.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <Smartphone className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No devices in the pricing engine yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                        <th className="p-4 font-medium">Category</th>
                        <th className="p-4 font-medium">Model</th>
                        <th className="p-4 font-medium">Base Value</th>
                        <th className="p-4 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {devices.map((device) => (
                        <tr key={device.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-4 text-sm text-gray-500">{device.category}</td>
                          <td className="p-4 font-medium text-gray-900 text-sm">
                            {device.model_name}
                          </td>
                          <td className="p-4 font-bold text-gray-900">
                            ₦ {Number(device.base_value).toLocaleString()}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleRemoveDevice(device.id)}
                              className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"
                              title="Delete device"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabase";
// import {
//   Loader2,
//   CheckCircle2,
//   ArrowRight,
//   XCircle,
//   Smartphone,
//   ShieldCheck,
//   Database,
//   Plus,
//   Trash2,
//   ChevronDown,
// } from "lucide-react";

// // --- Types ---
// type Ticket = {
//   id: number;
//   user_id: string;
//   device_model: string;
//   issue_type: string;
//   status: string;
//   created_at: string;
// };

// type TradeInDeviceDetails = {
//   model?: string;
//   storage?: string;
//   serial_or_imei?: string;
//   condition_notes?: string;
// };

// type TradeIn = {
//   id: number;
//   user_id: string;
//   device_details: TradeInDeviceDetails | null;
//   grade: string;
//   offered_price: number;
//   status: string;
//   created_at: string;
// };

// type CatalogDevice = {
//   id: string;
//   model_name: string;
//   base_value: number;
//   category: string;
// };

// // STRICT DOMAIN LOCK: Only ifixapple.com.ng emails get Admin access
// const checkAdminStatus = (email: string | undefined) => {
//   if (!email) return false;
//   return email.toLowerCase().endsWith("@ifixapple.com.ng");
// };

// export default function AdminDashboard() {
//   const router = useRouter();

//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState<"tickets" | "trade-ins" | "pricing">(
//     "tickets"
//   );

//   const [tickets, setTickets] = useState<Ticket[]>([]);
//   const [tradeIns, setTradeIns] = useState<TradeIn[]>([]);
//   const [catalog, setCatalog] = useState<CatalogDevice[]>([]);

//   const [actionLoading, setActionLoading] = useState<string | number | null>(
//     null
//   );

//   // New Device Form State
//   const [newDevice, setNewDevice] = useState({
//     model_name: "",
//     base_value: "",
//     category: "iPhone",
//   });

//   useEffect(() => {
//     const fetchTickets = async () => {
//       const { data, error } = await supabase
//         .from("repair_tickets")
//         .select("*")
//         .order("created_at", { ascending: false });
//       if (!error && data) setTickets(data);
//     };

//     const fetchTradeIns = async () => {
//       const { data, error } = await supabase
//         .from("trade_in_offers")
//         .select("*")
//         .order("created_at", { ascending: false });
//       if (!error && data) setTradeIns(data);
//     };

//     const fetchCatalog = async () => {
//       const { data, error } = await supabase
//         .from("device_catalog")
//         .select("*")
//         .order("category", { ascending: true })
//         .order("model_name", { ascending: true });
//       if (!error && data) setCatalog(data);
//     };

//     const checkAuthAndFetchData = async () => {
//       const {
//         data: { session },
//       } = await supabase.auth.getSession();

//       if (!session) {
//         router.push("/login");
//         return;
//       }

//       if (!checkAdminStatus(session.user.email)) {
//         router.push("/dashboard");
//         return;
//       }

//       await Promise.all([fetchTickets(), fetchTradeIns(), fetchCatalog()]);
//       setLoading(false);
//     };

//     checkAuthAndFetchData();
//   }, [router]);

//   // --- Actions ---
//   const advanceTicketStatus = async (id: number, currentStatus: string) => {
//     setActionLoading(id);
//     const newStatus =
//       currentStatus === "In Progress" ? "Completed" : "In Progress";

//     const { error } = await supabase
//       .from("repair_tickets")
//       .update({ status: newStatus })
//       .eq("id", id);
//     if (!error) {
//       setTickets((prev) =>
//         prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
//       );
//     }
//     setActionLoading(null);
//   };

//   const updateTradeInStatus = async (id: number, newStatus: string) => {
//     setActionLoading(id);
//     const { error } = await supabase
//       .from("trade_in_offers")
//       .update({ status: newStatus })
//       .eq("id", id);
//     if (!error) {
//       setTradeIns((prev) =>
//         prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
//       );
//     }
//     setActionLoading(null);
//   };

//   const handleAddDevice = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const trimmedModel = newDevice.model_name.trim();
//     const parsedValue = Number.parseInt(newDevice.base_value, 10);

//     if (!trimmedModel || Number.isNaN(parsedValue) || parsedValue < 0) {
//       alert("Please enter a valid model name and base trade-in value.");
//       return;
//     }

//     setActionLoading("add_device");

//     const { data, error } = await supabase
//       .from("device_catalog")
//       .insert([
//         {
//           model_name: trimmedModel,
//           base_value: parsedValue,
//           category: newDevice.category,
//         },
//       ])
//       .select();

//     if (!error && data && data[0]) {
//       setCatalog((prev) =>
//         [...prev, data[0]].sort(
//           (a, b) =>
//             a.category.localeCompare(b.category) ||
//             a.model_name.localeCompare(b.model_name)
//         )
//       );
//       setNewDevice({ model_name: "", base_value: "", category: "iPhone" });
//     } else {
//       alert("Failed to add device to catalog.");
//     }
//     setActionLoading(null);
//   };

//   const handleDeleteDevice = async (id: string) => {
//     if (
//       !window.confirm(
//         "Are you sure you want to remove this device from the pricing engine?"
//       )
//     ) {
//       return;
//     }
//     setActionLoading("delete_" + id);

//     const { error } = await supabase
//       .from("device_catalog")
//       .delete()
//       .eq("id", id);
//     if (!error) {
//       setCatalog((prev) => prev.filter((d) => d.id !== id));
//     }
//     setActionLoading(null);
//   };

//   const formatCurrency = (value: number) => {
//     return new Intl.NumberFormat("en-NG", {
//       style: "currency",
//       currency: "NGN",
//       maximumFractionDigits: 0,
//     }).format(value);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-apple-gray">
//         <Loader2 className="w-8 h-8 animate-spin text-apple-blue" />
//         <span className="ml-3 text-sm font-medium text-gray-500">
//           Verifying security clearance...
//         </span>
//       </div>
//     );
//   }

//   const receivedTickets = tickets.filter(
//     (t) => t.status === "Received" || !t.status
//   );
//   const inProgressTickets = tickets.filter((t) => t.status === "In Progress");
//   const completedTickets = tickets.filter((t) => t.status === "Completed");

//   return (
//     <div className="min-h-[calc(100vh-64px)] bg-apple-gray pb-12 flex flex-col items-center animate-in fade-in duration-300">
//       <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header & Navigation */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
//           <div>
//             <div className="flex items-center space-x-3 mb-2">
//               <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
//                 <ShieldCheck className="w-6 h-6 text-apple-blue" />
//               </div>
//               <h1 className="text-3xl font-bold tracking-tight text-apple-dark">
//                 Admin Control Center
//               </h1>
//             </div>
//             <p className="text-sm text-gray-500">
//               Secure staff portal for iFixApple operations.
//             </p>
//           </div>

//           <div className="flex bg-gray-200/80 p-1.5 rounded-2xl w-full md:w-auto shadow-inner overflow-x-auto">
//             <button
//               type="button"
//               onClick={() => setActiveTab("tickets")}
//               className={
//                 activeTab === "tickets"
//                   ? "flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap bg-white text-apple-dark shadow-sm"
//                   : "flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap text-gray-500 hover:text-apple-dark"
//               }
//             >
//               Repair Tickets
//             </button>
//             <button
//               type="button"
//               onClick={() => setActiveTab("trade-ins")}
//               className={
//                 activeTab === "trade-ins"
//                   ? "flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap bg-white text-apple-dark shadow-sm"
//                   : "flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap text-gray-500 hover:text-apple-dark"
//               }
//             >
//               Trade-In Offers
//             </button>
//             <button
//               type="button"
//               onClick={() => setActiveTab("pricing")}
//               className={
//                 activeTab === "pricing"
//                   ? "flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex items-center justify-center bg-white text-apple-dark shadow-sm"
//                   : "flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex items-center justify-center text-gray-500 hover:text-apple-dark"
//               }
//             >
//               <Database className="w-4 h-4 mr-2" /> Pricing Engine
//             </button>
//           </div>
//         </div>

//         {/* --- TAB 1: TICKETS --- */}
//         {activeTab === "tickets" && (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
//             <div className="bg-gray-100/50 rounded-3xl p-6 border border-gray-200/50 flex flex-col h-[600px]">
//               <div className="flex items-center justify-between mb-6">
//                 <h3 className="font-semibold text-gray-700 flex items-center">
//                   <span className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></span>{" "}
//                   New Requests
//                 </h3>
//                 <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-full">
//                   {receivedTickets.length}
//                 </span>
//               </div>
//               <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pb-4 pr-2">
//                 {receivedTickets.length === 0 && (
//                   <p className="text-xs text-gray-400 text-center py-8">
//                     No new repair requests.
//                   </p>
//                 )}
//                 {receivedTickets.map((ticket) => (
//                   <div
//                     key={ticket.id}
//                     className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 group"
//                   >
//                     <h4 className="font-bold text-apple-dark text-sm mb-1">
//                       {ticket.issue_type}
//                     </h4>
//                     <p className="text-xs text-gray-500 mb-4">
//                       {ticket.device_model}
//                     </p>
//                     <button
//                       type="button"
//                       onClick={() =>
//                         advanceTicketStatus(
//                           ticket.id,
//                           ticket.status || "Received"
//                         )
//                       }
//                       disabled={actionLoading === ticket.id}
//                       className="w-full bg-gray-50 hover:bg-apple-blue hover:text-white text-apple-dark py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center"
//                     >
//                       {actionLoading === ticket.id ? (
//                         <Loader2 className="w-4 h-4 animate-spin" />
//                       ) : (
//                         <>
//                           Start Repair <ArrowRight className="w-3 h-3 ml-1" />
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="bg-blue-50/50 rounded-3xl p-6 border border-blue-100/50 flex flex-col h-[600px]">
//               <div className="flex items-center justify-between mb-6">
//                 <h3 className="font-semibold text-blue-900 flex items-center">
//                   <span className="w-2 h-2 rounded-full bg-apple-blue mr-2"></span>{" "}
//                   In Progress
//                 </h3>
//                 <span className="bg-blue-200/50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">
//                   {inProgressTickets.length}
//                 </span>
//               </div>
//               <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pb-4 pr-2">
//                 {inProgressTickets.length === 0 && (
//                   <p className="text-xs text-blue-400 text-center py-8">
//                     No devices currently on the bench.
//                   </p>
//                 )}
//                 {inProgressTickets.map((ticket) => (
//                   <div
//                     key={ticket.id}
//                     className="bg-white p-5 rounded-2xl shadow-sm border border-blue-100"
//                   >
//                     <h4 className="font-bold text-apple-dark text-sm mb-1">
//                       {ticket.issue_type}
//                     </h4>
//                     <p className="text-xs text-gray-500 mb-4">
//                       {ticket.device_model}
//                     </p>
//                     <button
//                       type="button"
//                       onClick={() =>
//                         advanceTicketStatus(ticket.id, ticket.status)
//                       }
//                       disabled={actionLoading === ticket.id}
//                       className="w-full bg-blue-50 hover:bg-green-500 hover:text-white text-apple-blue py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center"
//                     >
//                       {actionLoading === ticket.id ? (
//                         <Loader2 className="w-4 h-4 animate-spin" />
//                       ) : (
//                         <>
//                           Mark Completed{" "}
//                           <CheckCircle2 className="w-3 h-3 ml-1" />
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="bg-green-50/50 rounded-3xl p-6 border border-green-100/50 flex flex-col h-[600px]">
//               <div className="flex items-center justify-between mb-6">
//                 <h3 className="font-semibold text-green-900 flex items-center">
//                   <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>{" "}
//                   Ready for Pickup
//                 </h3>
//                 <span className="bg-green-200/50 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
//                   {completedTickets.length}
//                 </span>
//               </div>
//               <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pb-4 pr-2">
//                 {completedTickets.length === 0 && (
//                   <p className="text-xs text-green-600/60 text-center py-8">
//                     No completed tickets yet.
//                   </p>
//                 )}
//                 {completedTickets.map((ticket) => (
//                   <div
//                     key={ticket.id}
//                     className="bg-white p-5 rounded-2xl shadow-sm border border-green-100 opacity-80"
//                   >
//                     <div className="flex items-center justify-between mb-1">
//                       <h4 className="font-bold text-gray-900 text-sm">
//                         {ticket.issue_type}
//                       </h4>
//                       <CheckCircle2 className="w-4 h-4 text-green-500" />
//                     </div>
//                     <p className="text-xs text-gray-500">
//                       {ticket.device_model}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* --- TAB 2: TRADE-INS --- */}
//         {activeTab === "trade-ins" && (
//           <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-300">
//             <div className="overflow-x-auto">
//               <table className="w-full text-left text-sm text-gray-600">
//                 <thead className="bg-gray-50/80 text-xs uppercase text-gray-500 font-semibold border-b border-gray-100">
//                   <tr>
//                     <th className="px-6 py-4">Device Details</th>
//                     <th className="px-6 py-4">Condition</th>
//                     <th className="px-6 py-4">Estimated Payout</th>
//                     <th className="px-6 py-4">Status</th>
//                     <th className="px-6 py-4 text-right">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {tradeIns.length === 0 && (
//                     <tr>
//                       <td
//                         colSpan={5}
//                         className="px-6 py-12 text-center text-gray-400"
//                       >
//                         No trade-in offers submitted yet.
//                       </td>
//                     </tr>
//                   )}
//                   {tradeIns.map((offer) => (
//                     <tr
//                       key={offer.id}
//                       className="hover:bg-gray-50/50 transition-colors"
//                     >
//                       <td className="px-6 py-4">
//                         <div className="flex items-center space-x-3">
//                           <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
//                             <Smartphone className="w-5 h-5 text-purple-600" />
//                           </div>
//                           <div>
//                             <p className="font-bold text-apple-dark">
//                               {offer.device_details?.model || "Unknown Device"}
//                             </p>
//                             <p className="text-xs text-gray-500">
//                               {offer.device_details?.storage || "N/A"}
//                               {offer.device_details?.serial_or_imei
//                                 ? " • " + offer.device_details.serial_or_imei
//                                 : ""}
//                             </p>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-semibold">
//                           {offer.grade}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 font-bold text-apple-dark">
//                         {formatCurrency(offer.offered_price)}
//                       </td>
//                       <td className="px-6 py-4">
//                         <span
//                           className={
//                             offer.status === "Approved"
//                               ? "px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700"
//                               : offer.status === "Rejected"
//                               ? "px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700"
//                               : "px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700"
//                           }
//                         >
//                           {offer.status || "Pending Review"}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 text-right space-x-2">
//                         {(!offer.status ||
//                           offer.status === "Pending Review") && (
//                           <>
//                             <button
//                               type="button"
//                               aria-label="Approve Trade-In"
//                               title="Approve"
//                               onClick={() =>
//                                 updateTradeInStatus(offer.id, "Approved")
//                               }
//                               disabled={actionLoading === offer.id}
//                               className="text-green-600 hover:bg-green-50 p-2 rounded-lg transition-colors inline-flex items-center"
//                             >
//                               <CheckCircle2 className="w-5 h-5" />
//                             </button>
//                             <button
//                               type="button"
//                               aria-label="Reject Trade-In"
//                               title="Reject"
//                               onClick={() =>
//                                 updateTradeInStatus(offer.id, "Rejected")
//                               }
//                               disabled={actionLoading === offer.id}
//                               className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors inline-flex items-center"
//                             >
//                               <XCircle className="w-5 h-5" />
//                             </button>
//                           </>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {/* --- TAB 3: PRICING ENGINE --- */}
//         {activeTab === "pricing" && (
//           <div className="animate-in fade-in duration-300">
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//               {/* Add New Device Form */}
//               <div className="lg:col-span-1">
//                 <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-24">
//                   <h3 className="text-lg font-bold text-apple-dark mb-4 flex items-center">
//                     <Plus className="w-5 h-5 mr-2 text-apple-blue" /> Add to
//                     Catalog
//                   </h3>
//                   <form onSubmit={handleAddDevice} className="space-y-5">
//                     <div>
//                       <label
//                         htmlFor="catalog-category"
//                         className="block text-sm font-semibold text-gray-700 mb-2"
//                       >
//                         Category
//                       </label>
//                       <div className="relative">
//                         <select
//                           id="catalog-category"
//                           required
//                           value={newDevice.category}
//                           onChange={(e) =>
//                             setNewDevice({
//                               ...newDevice,
//                               category: e.target.value,
//                             })
//                           }
//                           className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-apple-blue rounded-xl px-4 pr-10 py-3 text-sm outline-none transition-all appearance-none"
//                         >
//                           <option value="iPhone">iPhone</option>
//                           <option value="MacBook">MacBook</option>
//                           <option value="iPad">iPad</option>
//                           <option value="Apple Watch">Apple Watch</option>
//                         </select>
//                         <ChevronDown className="w-4 h-4 text-gray-400 pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" />
//                       </div>
//                     </div>
//                     <div>
//                       <label
//                         htmlFor="catalog-model"
//                         className="block text-sm font-semibold text-gray-700 mb-2"
//                       >
//                         Model Name
//                       </label>
//                       <input
//                         id="catalog-model"
//                         type="text"
//                         required
//                         placeholder="e.g. iPhone 15 Pro Max"
//                         value={newDevice.model_name}
//                         onChange={(e) =>
//                           setNewDevice({
//                             ...newDevice,
//                             model_name: e.target.value,
//                           })
//                         }
//                         className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-apple-blue rounded-xl px-4 py-3 text-sm outline-none transition-all"
//                       />
//                     </div>
//                     <div>
//                       <label
//                         htmlFor="catalog-value"
//                         className="block text-sm font-semibold text-gray-700 mb-2"
//                       >
//                         Base Trade-In Value (₦)
//                       </label>
//                       <div className="relative">
//                         <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400 pointer-events-none">
//                           ₦
//                         </span>
//                         <input
//                           id="catalog-value"
//                           type="number"
//                           required
//                           min="0"
//                           step="1000"
//                           placeholder="850000"
//                           value={newDevice.base_value}
//                           onChange={(e) =>
//                             setNewDevice({
//                               ...newDevice,
//                               base_value: e.target.value,
//                             })
//                           }
//                           className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-apple-blue rounded-xl pl-9 pr-4 py-3 text-sm outline-none transition-all"
//                         />
//                       </div>
//                     </div>
//                     <button
//                       type="submit"
//                       disabled={
//                         actionLoading === "add_device" ||
//                         !newDevice.model_name.trim() ||
//                         !newDevice.base_value
//                       }
//                       className="w-full bg-apple-dark text-white py-3.5 rounded-xl font-bold hover:bg-black transition-colors flex items-center justify-center disabled:opacity-70"
//                     >
//                       {actionLoading === "add_device" ? (
//                         <Loader2 className="w-5 h-5 animate-spin" />
//                       ) : (
//                         "Publish to Engine"
//                       )}
//                     </button>
//                   </form>
//                 </div>
//               </div>

//               {/* Database Table */}
//               <div className="lg:col-span-2">
//                 <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
//                   <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
//                     <h3 className="font-bold text-apple-dark">
//                       Live Pricing Database
//                     </h3>
//                     <span className="text-xs font-semibold bg-gray-200 text-gray-600 px-3 py-1 rounded-full">
//                       {catalog.length} Devices
//                     </span>
//                   </div>
//                   <div className="overflow-x-auto max-h-[700px] overflow-y-auto custom-scrollbar">
//                     <table className="w-full text-left text-sm text-gray-600">
//                       <thead className="bg-white text-xs uppercase text-gray-400 font-bold border-b border-gray-100 sticky top-0 shadow-sm">
//                         <tr>
//                           <th className="px-6 py-4">Model &amp; Category</th>
//                           <th className="px-6 py-4">Flawless Base Value</th>
//                           <th className="px-6 py-4 text-right">Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-gray-50">
//                         {catalog.length === 0 && (
//                           <tr>
//                             <td
//                               colSpan={3}
//                               className="px-6 py-12 text-center text-gray-400"
//                             >
//                               No devices in the pricing engine yet.
//                             </td>
//                           </tr>
//                         )}
//                         {catalog.map((device) => (
//                           <tr
//                             key={device.id}
//                             className="hover:bg-gray-50/50 transition-colors"
//                           >
//                             <td className="px-6 py-4">
//                               <p className="font-bold text-apple-dark text-sm">
//                                 {device.model_name}
//                               </p>
//                               <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
//                                 {device.category}
//                               </span>
//                             </td>
//                             <td className="px-6 py-4">
//                               <span className="font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
//                                 {formatCurrency(device.base_value)}
//                               </span>
//                             </td>
//                             <td className="px-6 py-4 text-right">
//                               <button
//                                 type="button"
//                                 aria-label={"Remove " + device.model_name}
//                                 onClick={() => handleDeleteDevice(device.id)}
//                                 disabled={
//                                   actionLoading === "delete_" + device.id
//                                 }
//                                 className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors inline-flex items-center"
//                                 title="Remove from Catalog"
//                               >
//                                 {actionLoading === "delete_" + device.id ? (
//                                   <Loader2 className="w-4 h-4 animate-spin" />
//                                 ) : (
//                                   <Trash2 className="w-4 h-4" />
//                                 )}
//                               </button>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }