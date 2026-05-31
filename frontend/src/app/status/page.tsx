"use client";

import { useState } from "react";
import { Search, Smartphone, Shield, Lock, AlertCircle, ArrowLeft, Loader2, CheckCircle2, Unlock, FileText, Signal } from "lucide-react";
import Link from "next/link";
import { apiService } from "@/services/api";

type DeviceStatus = {
  imei: string;
  model: string;
  storage: string;
  warranty_status: string;
  find_my_iphone: string;
  blacklist_status: string;
  sim_lock: string;
  carrier?: string;
  contract_status?: string;
};

export default function StatusPage() {
  const [imei, setImei] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DeviceStatus | null>(null);
  const [error, setError] = useState("");

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imei.trim() || imei.length !== 15) {
      setError("Please enter a valid 15-digit IMEI number.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await apiService.checkImei(imei);
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-apple-gray flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-apple-dark mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-apple-dark mb-4">
            Device Status Check
          </h1>
          <p className="text-lg text-gray-500">
            Enter your 15-digit IMEI number to check warranty, lock status, and trade-in eligibility.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-white p-2 rounded-full shadow-sm border border-gray-200 mb-8 transition-all focus-within:ring-4 focus-within:ring-apple-blue/10">
          <form onSubmit={handleCheck} className="flex items-center">
            <Search className="w-6 h-6 text-gray-400 ml-4" />
            <input
              type="text"
              value={imei}
              onChange={(e) => setImei(e.target.value.replace(/\D/g, ''))} // Only allow numbers
              placeholder="Enter 15-digit IMEI"
              maxLength={15}
              className="flex-1 bg-transparent py-4 px-4 outline-none text-lg text-apple-dark placeholder-gray-400 font-medium"
            />
            <button
              type="submit"
              disabled={loading || imei.length < 15}
              className="bg-apple-dark text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-black transition-colors disabled:opacity-50 disabled:bg-gray-400 flex items-center"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Check"}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center justify-center border border-red-100 mb-8 animate-in fade-in slide-in-from-top-4">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {/* Results Dashboard */}
        {result && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 animate-in fade-in slide-in-from-bottom-8">
            <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-gray-100">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
                <Smartphone className="w-8 h-8 text-apple-dark" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-apple-dark">{result.model}</h2>
                <p className="text-gray-500 font-medium">IMEI: {result.imei}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Storage */}
              <div className="flex items-start space-x-3 p-4 rounded-2xl bg-gray-50">
                <div className="mt-1">
                  <CheckCircle2 className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-apple-dark">Storage Capacity</p>
                  <p className="text-gray-600">{result.storage}</p>
                </div>
              </div>

              {/* Warranty */}
              <div className="flex items-start space-x-3 p-4 rounded-2xl bg-gray-50">
                <div className="mt-1">
                  <Shield className={`w-5 h-5 ${result.warranty_status === "Active" ? "text-green-500" : "text-gray-400"}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-apple-dark">Warranty Status</p>
                  <p className={`${result.warranty_status === "Active" ? "text-green-600" : "text-gray-600"}`}>
                    {result.warranty_status}
                  </p>
                </div>
              </div>

              {/* FMI Status */}
              <div className="flex items-start space-x-3 p-4 rounded-2xl bg-gray-50">
                <div className="mt-1">
                  <Lock className={`w-5 h-5 ${result.find_my_iphone === "OFF" ? "text-green-500" : "text-red-500"}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-apple-dark">Find My iPhone</p>
                  <p className={`${result.find_my_iphone === "OFF" ? "text-green-600" : "text-red-600"}`}>
                    {result.find_my_iphone}
                  </p>
                </div>
              </div>

              {/* Blacklist Status */}
              <div className={`flex items-start space-x-3 p-4 rounded-2xl ${result.blacklist_status === "CLEAN" ? "bg-green-50/50 border border-green-100" : "bg-red-50 border border-red-100"}`}>
                <div className="mt-1">
                  <AlertCircle className={`w-5 h-5 ${result.blacklist_status === "CLEAN" ? "text-green-500" : "text-red-500"}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-apple-dark">Blacklist Status</p>
                  <p className={`font-medium ${result.blacklist_status === "CLEAN" ? "text-green-600" : "text-red-600"}`}>
                    {result.blacklist_status}
                  </p>
                </div>
              </div>

              {/* Carrier Info */}
              {result.carrier && (
                <div className="flex items-start space-x-3 p-4 rounded-2xl bg-gray-50">
                  <div className="mt-1">
                    <Signal className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-apple-dark">Network Carrier</p>
                    <p className="text-gray-600">{result.carrier}</p>
                  </div>
                </div>
              )}

              {/* Contract Status */}
              {result.contract_status && (
                <div className={`flex items-start space-x-3 p-4 rounded-2xl ${result.contract_status === "Clean" ? "bg-gray-50" : "bg-yellow-50 border border-yellow-100"}`}>
                  <div className="mt-1">
                    <FileText className={`w-5 h-5 ${result.contract_status === "Clean" ? "text-gray-400" : "text-yellow-600"}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-apple-dark">Contract Status</p>
                    <p className={`${result.contract_status === "Clean" ? "text-gray-600" : "text-yellow-700 font-medium"}`}>
                      {result.contract_status}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Network Unlock Action Card */}
            {result.sim_lock === "Locked" && (
              <div className="mt-8 bg-apple-dark text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between shadow-lg">
                <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <Unlock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Network Unlock Available</h3>
                    <p className="text-gray-400 text-sm">Factory unlock your device for any carrier worldwide.</p>
                  </div>
                </div>
                <button 
                  onClick={() => alert("Redirecting to Unlock Checkout... (Integration pending)")}
                  className="w-full sm:w-auto bg-apple-blue text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-600 transition-colors"
                >
                  Unlock Device
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}