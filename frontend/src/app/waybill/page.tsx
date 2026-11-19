import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Map,
  Package,
  Truck,
  ShieldCheck,
  ArrowRight,
  MapPin,
  Smartphone,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Nationwide Mail-In & Interstate Waybill Repair | Apple Repair Lab",
  description:
    "Securely waybill your Apple device from anywhere in Nigeria to our Lagos precision repair laboratory via GIG Logistics, DHL, GUO, or ABC Transport.",
};

export default function WaybillGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-apple-dark mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Map className="w-10 h-10 text-apple-blue" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-apple-dark mb-6">
            Nationwide Mail-In Repair
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Not in Lagos? No problem. Securely waybill your Apple device to our
            precision laboratory from anywhere in Nigeria. We fix it on camera
            and ship it right back.
          </p>
        </div>

        {/* How It Works - Step by Step */}
        <h2 className="text-2xl font-bold text-apple-dark mb-8 text-center">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-apple-blue text-white rounded-2xl flex items-center justify-center font-bold text-xl mb-6 shadow-md">
                1
              </div>
              <h3 className="text-xl font-bold text-apple-dark mb-3">
                Book Online
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Fill out our repair form and select &ldquo;Interstate
                Waybill&rdquo; as your delivery method. You will instantly
                receive a Ticket ID and our secure terminal receiving address.
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-purple-500 text-white rounded-2xl flex items-center justify-center font-bold text-xl mb-6 shadow-md">
                2
              </div>
              <h3 className="text-xl font-bold text-apple-dark mb-3">
                Package Securely
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Wrap your device in thick bubble wrap or a sturdy box.{" "}
                <strong className="text-apple-dark">
                  Do not include your charger or original Apple box
                </strong>
                , as they may not be returned. Include a note with your Ticket
                ID.
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-green-500 text-white rounded-2xl flex items-center justify-center font-bold text-xl mb-6 shadow-md">
                3
              </div>
              <h3 className="text-xl font-bold text-apple-dark mb-3">
                Ship via Trusted Partner
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Take the packaged device to a trusted logistics terminal (see
                our recommendations below). Send the waybill tracking receipt to
                our WhatsApp support line.
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center font-bold text-xl mb-6 shadow-md">
                4
              </div>
              <h3 className="text-xl font-bold text-apple-dark mb-3">
                Repair &amp; Return
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Once received, we diagnose it, fix it, and send you a payment
                invoice. After payment, we securely waybill it back to your
                local terminal.
              </p>
            </div>
          </div>
        </div>

        {/* Trusted Partners Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 mb-16">
          <div className="flex items-center justify-center mb-8">
            <ShieldCheck className="w-8 h-8 text-green-500 mr-3" />
            <h2 className="text-2xl font-bold text-apple-dark">
              Approved Logistics Partners
            </h2>
          </div>
          <p className="text-center text-gray-500 text-sm mb-10 max-w-xl mx-auto">
            For the safety of your high-value devices, we strongly recommend
            using one of these established, trackable transport companies.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-gray-100 hover:border-gray-300 transition-colors">
              <Truck className="w-8 h-8 text-gray-700 mb-3" />
              <span className="font-bold text-apple-dark text-sm">
                GIG Logistics
              </span>
              <span className="text-xs text-gray-400 mt-1">
                Highly Recommended
              </span>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-gray-100 hover:border-gray-300 transition-colors">
              <Package className="w-8 h-8 text-red-600 mb-3" />
              <span className="font-bold text-apple-dark text-sm">
                DHL Nigeria
              </span>
              <span className="text-xs text-gray-400 mt-1">Premium Choice</span>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-gray-100 hover:border-gray-300 transition-colors">
              <MapPin className="w-8 h-8 text-blue-600 mb-3" />
              <span className="font-bold text-apple-dark text-sm">
                GUO Transport
              </span>
              <span className="text-xs text-gray-400 mt-1">
                Reliable Terminals
              </span>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-gray-100 hover:border-gray-300 transition-colors">
              <Truck className="w-8 h-8 text-green-600 mb-3" />
              <span className="font-bold text-apple-dark text-sm">
                ABC Transport
              </span>
              <span className="text-xs text-gray-400 mt-1">Wide Coverage</span>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-apple-dark text-white rounded-3xl p-8 md:p-12 text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
          <Smartphone className="w-12 h-12 text-white/80 mx-auto mb-6 relative z-10" />
          <h2 className="text-3xl font-bold mb-4 relative z-10">
            Ready to send your device?
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto relative z-10">
            Book your repair online right now and select &ldquo;Interstate
            Waybill&rdquo; to generate your tracking ticket.
          </p>
          <Link
            href="/book?delivery=waybill"
            className="inline-flex items-center bg-apple-blue text-white px-8 py-4 rounded-full font-bold hover:bg-blue-600 transition-all hover:scale-105 shadow-md relative z-10"
          >
            Book Waybill Repair
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}