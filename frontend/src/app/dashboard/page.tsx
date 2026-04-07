"use client";

import { Smartphone, Laptop, Tablet, Clock, CheckCircle2, Wrench, ChevronRight, ArrowLeft } from "lucide-react";

// --- Mock Data ---
const mockDevices = [
  { id: 1, name: "iPhone 13 Pro", identifier: "IMEI: 354892019384721", type: "phone" },
  { id: 2, name: "MacBook Air M1", identifier: "Serial: C02DG543Q6L4", type: "laptop" },
];

const mockTickets = [
  {
    id: "TKT-8923",
    device: "iPhone 13 Pro",
    issue: "Screen Replacement",
    status: "In Progress",
    statusStep: 2, // 1: Received, 2: In Progress, 3: Ready/Completed
    date: "Oct 24, 2024",
    estimatedCompletion: "Oct 25, 2024 - 4:00 PM",
  },
  {
    id: "TKT-8102",
    device: "iPad Pro 11-inch",
    issue: "Battery Replacement",
    status: "Completed",
    statusStep: 3,
    date: "Sep 15, 2024",
    estimatedCompletion: "Sep 16, 2024",
  }
];

export default function DashboardPage() {
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "laptop": return <Laptop className="w-6 h-6 text-apple-dark" />;
      case "tablet": return <Tablet className="w-6 h-6 text-apple-dark" />;
      default: return <Smartphone className="w-6 h-6 text-apple-dark" />;
    }
  };

  return (
    <div className="min-h-screen bg-apple-gray pb-12">
      {/* Simple Header */}
      <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <a href="/" className="text-gray-500 hover:text-apple-dark transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </a>
            <h1 className="text-xl font-semibold text-apple-dark tracking-tight">My Dashboard</h1>
          </div>
          <div className="w-8 h-8 bg-apple-blue text-white rounded-full flex items-center justify-center font-medium text-sm">
            JD
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-4">
        <h2 className="text-3xl font-bold text-apple-dark mb-8 tracking-tight">Welcome back, John.</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Active & Past Repairs Column (Takes up 2 columns on large screens) */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-lg font-semibold text-apple-dark flex items-center">
              <Wrench className="w-5 h-5 mr-2 text-gray-400" />
              Repair Tickets
            </h3>
            
            <div className="space-y-4">
              {mockTickets.map((ticket) => (
                <div key={ticket.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="font-bold text-lg text-apple-dark">{ticket.issue}</h4>
                      <p className="text-sm text-gray-500">{ticket.device} • {ticket.id}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${ticket.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {ticket.status}
                    </span>
                  </div>

                  {/* Visual Status Timeline */}
                  <div className="relative mb-6">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full"></div>
                    <div 
                      className={`absolute top-1/2 left-0 h-1 bg-apple-blue -translate-y-1/2 rounded-full transition-all duration-500`}
                      style={{ width: ticket.statusStep === 1 ? '10%' : ticket.statusStep === 2 ? '50%' : '100%' }}
                    ></div>
                    
                    <div className="relative flex justify-between">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 ${ticket.statusStep >= 1 ? 'bg-apple-blue text-white' : 'bg-gray-200 text-gray-400'}`}>
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium mt-2 text-gray-600">Received</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 ${ticket.statusStep >= 2 ? 'bg-apple-blue text-white' : 'bg-gray-200 text-gray-400'}`}>
                          <Wrench className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-medium mt-2 text-gray-600">Fixing</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 ${ticket.statusStep >= 3 ? (ticket.status === 'Completed' ? 'bg-green-500 text-white' : 'bg-apple-blue text-white') : 'bg-gray-200 text-gray-400'}`}>
                          {ticket.status === 'Completed' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                        </div>
                        <span className="text-xs font-medium mt-2 text-gray-600">Ready</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4 text-sm flex justify-between items-center">
                    <span className="text-gray-500">Est. Completion: <strong className="text-apple-dark">{ticket.estimatedCompletion}</strong></span>
                    <button className="text-apple-blue font-medium hover:text-blue-700 text-sm">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* My Devices Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-apple-dark flex items-center">
              <Smartphone className="w-5 h-5 mr-2 text-gray-400" />
              My Devices
            </h3>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-100">
                {mockDevices.map((device) => (
                  <div key={device.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer group">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
                        {getDeviceIcon(device.type)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-apple-dark text-sm">{device.name}</h4>
                        <p className="text-xs text-gray-500">{device.identifier}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-apple-blue transition-colors" />
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-gray-100 bg-gray-50 text-center">
                <a href="/status" className="text-sm font-medium text-apple-blue hover:text-blue-700">
                  + Add another device
                </a>
              </div>
            </div>
            
            {/* Quick Actions Card */}
            <div className="bg-apple-dark text-white rounded-3xl p-6 shadow-md mt-6">
              <h4 className="font-semibold mb-2">Need another repair?</h4>
              <p className="text-sm text-gray-400 mb-6">Start a new diagnostic session with our AI to get a quote.</p>
              <button 
                className="w-full bg-white text-apple-dark py-3 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors"
                onClick={() => { window.location.href = "/" }}
              >
                Start New Chat
              </button>
            </div>
            
          </div>
          
        </div>
      </main>
    </div>
  );
}
