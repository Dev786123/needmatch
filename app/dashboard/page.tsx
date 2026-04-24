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

      let { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userData.user.id)
        .limit(1);

      let profile = profiles && profiles.length > 0 ? profiles[0] : null;

      if (!profile) {
        const { data: newProfile } = await supabase
          .from("profiles")
          .insert([
            {
              user_id: userData.user.id,
              role: "provider",
            },
          ])
          .select("*");

        profile =
          newProfile && newProfile.length > 0 ? newProfile[0] : null;
      }

      const userRole = profile?.role || "provider";
      const isProfileComplete =
        profile?.name && profile?.city && profile?.phone;

      setRole(userRole);
      setName(profile?.name || "there");
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
      cta: "Post now",
    },
    {
      title: "My Needs",
      desc: "Manage posted needs, applicants, and contact unlocks.",
      href: "/my-needs",
      icon: "📌",
      cta: "Manage",
    },
    {
      title: "Credits",
      desc: "Use credits to unlock provider contact details.",
      href: "/credits",
      icon: "💳",
      cta: "View credits",
    },
  ];

  const providerCards = [
    {
      title: "Browse Needs",
      desc: "Find active client requirements and apply with proposals.",
      href: "/needs",
      icon: "🔍",
      cta: "Browse work",
    },
    {
      title: "My Applications",
      desc: "Track your submitted proposals and application status.",
      href: "/my-applications",
      icon: "📨",
      cta: "Track",
    },
    {
      title: "My Profile",
      desc: "Update your skills, bio, city, and contact details.",
      href: "/profile",
      icon: "👤",
      cta: "Update",
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
              Complete your profile to make your NeedMatch workspace ready.
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

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 px-6 py-16 text-white">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl"></div>

        <div className="relative mx-auto max-w-6xl">
          {loginSuccess && (
            <p className="mb-6 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-blue-50">
              ✅ Login successful
            </p>
          )}

          <p className="mb-3 text-blue-100">
            {role === "client" ? "Client Workspace" : "Provider Workspace"}
          </p>

          <h1 className="max-w-3xl text-4xl font-black leading-tight md:text-6xl">
            Welcome {name}, ready to{" "}
            {role === "client" ? "hire faster?" : "find work faster?"}
          </h1>

          <p className="mt-5 max-w-2xl text-lg text-blue-100">
            {role === "client"
              ? "Post your need, review providers, and unlock the right contact when you are ready."
              : "Browse real client needs, apply with a clear proposal, and track your applications."}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={role === "client" ? "/post-need" : "/needs"}
              className="rounded-xl bg-white px-6 py-3 font-bold text-blue-700 hover:bg-blue-50"
            >
              {role === "client" ? "Post a Need" : "Browse Needs"}
            </a>

            <a
              href="/profile"
              className="rounded-xl border border-white/30 px-6 py-3 font-bold text-white hover:bg-white/10"
            >
              Complete Profile
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Your Role</p>
            <h2 className="mt-2 text-3xl font-black capitalize text-slate-950">
              {role}
            </h2>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Main Flow</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">
              {role === "client" ? "Post → Review" : "Browse → Apply"}
            </h2>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Next Action</p>
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
              Start with the most important actions for your role.
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
                {card.cta} →
              </span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}