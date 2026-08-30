import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-zinc-200/60">
        
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Header Block */}
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mr-4 shrink-0">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Privacy Policy</h1>
        </div>
        
        <p className="text-sm text-zinc-500 mb-8">Last Updated: August 2026</p>

        {/* Content Body */}
        <div className="space-y-8 text-zinc-600 leading-relaxed text-sm sm:text-base">
          
          <section>
            <h2 className="text-lg font-bold text-zinc-900 mb-3">1. Introduction</h2>
            <p>
              At iFixApple Tech Ltd ("iFixApple", "we", "us", or "our"), we respect your privacy and are committed to protecting the personal and device data you share with us. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website (the "Service") or physical repair services in Lagos, Nigeria.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-zinc-900 mb-3">2. Information We Collect</h2>
            <p className="mb-2">We collect information to provide better services to our users. This includes:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-zinc-900">Personal Information:</strong> Name, email address, phone number, and physical address (for VIP Dispatch and Waybill services).</li>
              <li><strong className="text-zinc-900">Device Information:</strong> Device model, IMEI number, serial number, passcode (only when explicitly provided and required for diagnostic testing), and device condition.</li>
              <li><strong className="text-zinc-900">Payment Information:</strong> Processed securely via third-party providers (like Paystack). We do not store your raw credit card data on our servers.</li>
              <li><strong className="text-zinc-900">Chat Data:</strong> Conversations with our AI Genius are logged to improve diagnostic accuracy and service quality.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-zinc-900 mb-3">3. Strict &quot;No Data Snooping&quot; Policy</h2>
            <p>
              Your privacy on your device is absolute. Our engineers are strictly prohibited from accessing personal files, photos, messages, or emails on your device. Passcodes provided for post-repair diagnostic testing (e.g., verifying Face ID, cameras, or touch functionality) are used solely for those purposes and are wiped from our internal tracking systems once the device is returned to you.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-zinc-900 mb-3">4. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>To process and fulfill your repair or swap requests.</li>
              <li>To communicate with you regarding your ticket status, dispatch logistics, or billing.</li>
              <li>To verify device ownership and check for iCloud/Blacklist status to prevent the handling of stolen property.</li>
              <li>To improve our AI diagnostic engine and website functionality.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-zinc-900 mb-3">5. Data Sharing & Security</h2>
            <p>
              We do not sell, rent, or trade your personal information to third parties. We may share necessary data with trusted logistics partners (e.g., dispatch riders) solely for the purpose of picking up or delivering your device. We utilize industry-standard encryption and secure databases (via Supabase) to protect your personal and ticket data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-zinc-900 mb-3">6. Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy or how your data is handled, please contact our support team at <a href="mailto:support@ifixapple.com.ng" className="text-blue-600 hover:underline">support@ifixapple.com.ng</a> or visit our lab in the Ajah/Lekki axis, Lagos.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
