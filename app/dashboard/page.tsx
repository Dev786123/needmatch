"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  useEffect(() => {
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
        .select("role, name, city, phone")
        .eq("user_id", userData.user.id)
        .maybeSingle();

      if (!profile?.role) {
        window.location.href = "/profile";
        return;
      }

      const isProfileComplete = profile.name && profile.city && profile.phone;

      setRole(profile.role);
      setName(profile.name || "there");
      setShowProfilePopup(!isProfileComplete);
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
      desc: "Create a new requirement and receive applications.",
      href: "/post-need",
      icon: "📝",
    },
    {
      title: "My Needs",
      desc: "Manage posted needs, applicants and contact unlocks.",
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
      desc: "Update your profile and contact details.",
      href: "/profile",
      icon: "👤",
    },
  ];

  const providerCards = [
    {
      title: "Browse Needs",
      desc: "Find available work opportunities from clients.",
      href: "/needs",
      icon: "🔍",
    },
    {
      title: "My Applications",
      desc: "Track proposals, bids and application status.",
      href: "/my-applications",
      icon: "📨",
    },
    {
      title: "My Profile",
      desc: "Update your skills, bio and contact details.",
      href: "/profile",
      icon: "👤",
    },
  ];

  const cards = role === "client" ? clientCards : providerCards;

  return (
    <main className="min-h-screen bg-slate-50">
      {showProfilePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-xl">
            <h2 className="text-2xl font-black text-slate-950">
              Complete your profile
            </h2>

            <p className="mt-3 text-slate-600">
              Please complete your profile details before using NeedMatch.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => (window.location.href = "/profile")}
                className="flex-1 rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-700"
              >
                Complete Profile
              </button>

              <button
                onClick={() => setShowProfilePopup(false)}
                className="rounded-xl border px-5 py-3 font-bold text-slate-700 hover:bg-slate-50"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 px-6 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-blue-100">
            {role === "client" ? "Client Workspace" : "Provider Workspace"}
          </p>

          <h1 className="text-4xl font-black md:text-5xl">
            Welcome {name},{" "}
            {role === "client" ? "manage your hiring." : "find your next work."}
          </h1>

          <p className="mt-4 max-w-2xl text-blue-100">
            {role === "client"
              ? "Post requirements, review applicants, and unlock the right provider contact."
              : "Browse available needs, apply with proposals, and track your application status."}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        {loginSuccess && (
          <p className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
            ✅ Welcome back! Login successful.
          </p>
        )}

        <div className="mb-10 grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Your Role</p>
            <h2 className="mt-2 text-3xl font-black capitalize text-slate-950">
              {role}
            </h2>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Main Flow</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">
              {role === "client" ? "Post → Hire" : "Browse → Apply"}
            </h2>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Recommended Next
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">
              {role === "client" ? "Post Need" : "Apply Now"}
            </h2>
          </div>
        </div>

        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-black text-slate-950">
              Quick Actions
            </h2>
            <p className="mt-1 text-slate-600">
              Choose the action that matches your role.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <a
              key={card.href}
              href={card.href}
              className="group rounded-3xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                {card.icon}
              </div>

              <h3 className="text-2xl font-black text-slate-950">
                {card.title}
              </h3>

              <p className="mt-3 text-slate-600">{card.desc}</p>

              <span className="mt-6 inline-block font-bold text-blue-600 group-hover:underline">
                Open →
              </span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}