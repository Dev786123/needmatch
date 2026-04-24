"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        window.location.href = "/login";
        return;
      }

      setLoading(false);
    };

    checkUser();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Loading dashboard...</p>
      </main>
    );
  }

  const cards = [
    {
      title: "Post a Need",
      desc: "Create a new requirement and receive applications.",
      href: "/post-need",
      icon: "📝",
    },
    {
      title: "Browse Needs",
      desc: "Explore available work opportunities.",
      href: "/needs",
      icon: "🔍",
    },
    {
      title: "My Needs",
      desc: "Manage your posted needs and applicants.",
      href: "/my-needs",
      icon: "📌",
    },
    {
      title: "My Applications",
      desc: "Track proposals you have submitted.",
      href: "/my-applications",
      icon: "📨",
    },
    {
      title: "My Profile",
      desc: "Update your skills, bio, city and contact details.",
      href: "/profile",
      icon: "👤",
    },
    {
      title: "Credits",
      desc: "Use credits to unlock contact details.",
      href: "/credits",
      icon: "💳",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <p className="text-blue-100 mb-2">Welcome back</p>
          <h1 className="text-4xl font-bold mb-3">NeedMatch Dashboard</h1>
          <p className="text-blue-100 max-w-2xl">
            Manage your needs, applications, credits and profile from one clean
            workspace.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 -mt-8">
        <div className="bg-white rounded-2xl shadow p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-xl p-4">
            <p className="text-sm text-slate-500">Core Flow</p>
            <h2 className="text-2xl font-bold">Need → Apply</h2>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-sm text-slate-500">Hiring Action</p>
            <h2 className="text-2xl font-bold">Accept / Reject</h2>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-sm text-slate-500">Monetization</p>
            <h2 className="text-2xl font-bold">Credits Unlock</h2>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold mb-6 text-slate-900">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <a
              key={card.href}
              href={card.href}
              className="group bg-white rounded-2xl p-6 shadow-sm border hover:shadow-lg hover:-translate-y-1 transition"
            >
              <div className="text-3xl mb-4">{card.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-slate-900">
                {card.title}
              </h3>
              <p className="text-slate-600 mb-4">{card.desc}</p>
              <span className="text-blue-600 font-medium group-hover:underline">
                Open →
              </span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}