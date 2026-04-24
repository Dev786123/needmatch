"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    // ✅ FIX: get query param safely (no prerender error)
    const params = new URLSearchParams(window.location.search);
    setLoginSuccess(params.get("login") === "success");

    const loadDashboard = async () => {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        window.location.href = "/login";
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", userData.user.id)
        .maybeSingle();

      if (!profile?.role) {
        window.location.href = "/profile";
        return;
      }

      setRole(profile.role);
      setLoading(false);
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Loading dashboard...</p>
      </main>
    );
  }

  const clientCards = [
    {
      title: "Post a Need",
      desc: "Create a new work requirement and receive applications.",
      href: "/post-need",
      icon: "📝",
    },
    {
      title: "My Needs",
      desc: "Manage your posted needs, applicants, and contact unlocks.",
      href: "/my-needs",
      icon: "📌",
    },
    {
      title: "Credits",
      desc: "Use credits to unlock provider contact details.",
      href: "/credits",
      icon: "💳",
    },
    {
      title: "My Profile",
      desc: "Update your profile details.",
      href: "/profile",
      icon: "👤",
    },
  ];

  const providerCards = [
    {
      title: "Browse Needs",
      desc: "Find available work opportunities.",
      href: "/needs",
      icon: "🔍",
    },
    {
      title: "My Applications",
      desc: "Track your proposals and bids.",
      href: "/my-applications",
      icon: "📨",
    },
    {
      title: "My Profile",
      desc: "Update your skills and details.",
      href: "/profile",
      icon: "👤",
    },
  ];

  const cards = role === "client" ? clientCards : providerCards;

  return (
    <main className="min-h-screen bg-slate-50">
      
      {/* HEADER */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-14 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="mb-2 text-blue-100">
            {role === "client" ? "Client Workspace" : "Provider Workspace"}
          </p>

          <h1 className="text-4xl font-extrabold">
            {role === "client"
              ? "Manage your work"
              : "Find work opportunities"}
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">

        {/* ✅ LOGIN SUCCESS MESSAGE */}
        {loginSuccess && (
          <p className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
            ✅ Welcome back! Login successful.
          </p>
        )}

        {/* INFO CARDS */}
        <div className="mb-8 rounded-3xl border bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Your Role</p>
              <h2 className="text-2xl font-bold capitalize">{role}</h2>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Flow</p>
              <h2 className="text-2xl font-bold">
                {role === "client" ? "Post → Hire" : "Browse → Apply"}
              </h2>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Next</p>
              <h2 className="text-2xl font-bold">
                {role === "client" ? "Post Need" : "Apply"}
              </h2>
            </div>
          </div>
        </div>

        {/* ACTION CARDS */}
        <h2 className="mb-6 text-2xl font-bold">Quick Actions</h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <a
              key={card.href}
              href={card.href}
              className="group rounded-3xl border bg-white p-6 shadow-sm hover:-translate-y-1 hover:shadow-xl transition"
            >
              <div className="text-4xl mb-4">{card.icon}</div>
              <h3 className="text-xl font-bold">{card.title}</h3>
              <p className="text-slate-600 mt-2">{card.desc}</p>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}