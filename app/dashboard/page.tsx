"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");

  useEffect(() => {
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
      desc: "Update your client profile and contact details.",
      href: "/profile",
      icon: "👤",
    },
  ];

  const providerCards = [
    {
      title: "Browse Needs",
      desc: "Find available work opportunities posted by clients.",
      href: "/needs",
      icon: "🔍",
    },
    {
      title: "My Applications",
      desc: "Track your proposals, bids, and application status.",
      href: "/my-applications",
      icon: "📨",
    },
    {
      title: "My Profile",
      desc: "Update your skills, bio, city, and contact details.",
      href: "/profile",
      icon: "👤",
    },
  ];

  const cards = role === "client" ? clientCards : providerCards;

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-14 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="mb-2 text-blue-100">
            {role === "client" ? "Client Workspace" : "Provider Workspace"}
          </p>

          <h1 className="text-4xl font-extrabold">
            {role === "client"
              ? "Manage your work requirements"
              : "Find work and track applications"}
          </h1>

          <p className="mt-3 max-w-2xl text-blue-100">
            {role === "client"
              ? "Post needs, review applicants, accept or reject proposals, and unlock provider contacts."
              : "Browse client needs, apply with proposals, and track your application status."}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 rounded-3xl border bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Your Role</p>
              <h2 className="mt-1 text-2xl font-bold capitalize text-slate-950">
                {role}
              </h2>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Main Flow</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-950">
                {role === "client" ? "Post → Hire" : "Browse → Apply"}
              </h2>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Next Action</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-950">
                {role === "client" ? "Post Need" : "Apply Now"}
              </h2>
            </div>
          </div>
        </div>

        <h2 className="mb-6 text-2xl font-bold text-slate-950">
          Quick Actions
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <a
              key={card.href}
              href={card.href}
              className="group rounded-3xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-4 text-4xl">{card.icon}</div>

              <h3 className="text-xl font-bold text-slate-950">
                {card.title}
              </h3>

              <p className="mt-2 text-slate-600">{card.desc}</p>

              <span className="mt-5 inline-block font-semibold text-blue-600 group-hover:underline">
                Open →
              </span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}