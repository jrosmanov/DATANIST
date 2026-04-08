import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-6 space-y-8">
      <h1 className="text-4xl font-black tracking-tight">Privacy Policy</h1>
      <div className="prose prose-slate max-w-none space-y-6 text-slate-600 leading-relaxed">
        <p>Last updated: April 8, 2026</p>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">1. Information We Collect</h2>
          <p>We collect information you provide directly to us when you create an account, participate in any interactive features of the services, fill out a form, or otherwise communicate with us.</p>
        </section>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">2. How We Use Your Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect Holberton School and our users.</p>
        </section>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">3. Data Security</h2>
          <p>We use reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>
        </section>
      </div>
    </div>
  );
}
