import React from "react";

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-6 space-y-8">
      <h1 className="text-4xl font-black tracking-tight">Terms of Service</h1>
      <div className="prose prose-slate max-w-none space-y-6 text-slate-600 leading-relaxed">
        <p>Last updated: April 8, 2026</p>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p>By accessing or using Holberton School's platform, you agree to be bound by these terms of service.</p>
        </section>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">2. User Conduct</h2>
          <p>You agree not to use the services for any purpose that is illegal or prohibited by these terms.</p>
        </section>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">3. Termination</h2>
          <p>We may terminate or suspend your access to our services immediately, without prior notice or liability, for any reason whatsoever.</p>
        </section>
      </div>
    </div>
  );
}
