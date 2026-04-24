"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function CreditsPage() {
  const [balance, setBalance] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const loadCredits = async () => {
    setLoading(true);
    setMessage("");

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      window.location.href = "/login";
      return;
    }

    const { data: profileRows } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", userData.user.id)
      .limit(1);

    const profile =
      profileRows && profileRows.length > 0 ? profileRows[0] : null;

    if (profile?.role !== "client") {
      window.location.href = "/dashboard";
      return;
    }

    const { data: creditRows, error } = await supabase
      .from("credits")
      .select("*")
      .eq("user_id", userData.user.id)
      .limit(1);

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    let creditData =
      creditRows && creditRows.length > 0 ? creditRows[0] : null;

    if (!creditData) {
      const { data: newCreditRows, error: createError } = await supabase
        .from("credits")
        .insert([
          {
            user_id: userData.user.id,
            balance: 5,
          },
        ])
        .select("*");

      if (createError) {
        setMessage(createError.message);
        setLoading(false);
        return;
      }

      creditData =
        newCreditRows && newCreditRows.length > 0 ? newCreditRows[0] : null;
    }

    setBalance(creditData?.balance || 0);
    setLoading(false);
  };

  const addCredits = async () => {
    setAdding(true);
    setMessage("");

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      window.location.href = "/login";
      return;
    }

    const { data: profileRows } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", userData.user.id)
      .limit(1);

    const profile =
      profileRows && profileRows.length > 0 ? profileRows[0] : null;

    if (profile?.role !== "client") {
      window.location.href = "/dashboard";
      return;
    }

    const newBalance = balance + 5;

    const { data: creditRows } = await supabase
      .from("credits")
      .select("*")
      .eq("user_id", userData.user.id)
      .limit(1);

    const creditData =
      creditRows && creditRows.length > 0 ? creditRows[0] : null;

    let error;

    if (creditData?.id) {
      const result = await supabase
        .from("credits")
        .update({
          balance: newBalance,
        })
        .eq("id", creditData.id);

      error = result.error;
    } else {
      const result = await supabase.from("credits").insert([
        {
          user_id: userData.user.id,
          balance: newBalance,
        },
      ]);

      error = result.error;
    }

    if (error) {
      setMessage(error.message);
      setAdding(false);
      return;
    }

    setBalance(newBalance);
    setMessage("5 demo credits added!");
    setAdding(false);
  };

  useEffect(() => {
    loadCredits();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Loading credits...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-white border-b px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <a href="/dashboard" className="text-blue-600 font-medium">
            ← Back to Dashboard
          </a>

          <p className="text-blue-600 font-medium mt-5 mb-2">
            Client Monetization
          </p>

          <h1 className="text-4xl font-bold text-slate-900 mb-3">Credits</h1>

          <p className="text-slate-600">
            Use credits to unlock provider contact details.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          {message && (
            <p className="mb-4 text-sm text-blue-600 bg-blue-50 border border-blue-200 p-3 rounded-lg">
              {message}
            </p>
          )}

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-6 mb-6">
            <p className="text-blue-100 mb-2">Current Balance</p>
            <h2 className="text-5xl font-bold">{balance}</h2>
            <p className="text-blue-100 mt-2">credits available</p>
          </div>

          <div className="border rounded-xl p-4 mb-6">
            <h3 className="font-bold text-slate-900 mb-2">
              Demo Credit Pack
            </h3>

            <p className="text-slate-600 mb-4">
              Add 5 demo credits for testing contact unlock flow.
            </p>

            <button
              onClick={addCredits}
              disabled={adding}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {adding ? "Adding..." : "Add 5 Demo Credits"}
            </button>
          </div>

          <div className="bg-slate-50 border rounded-xl p-4">
            <h3 className="font-bold text-slate-900 mb-2">
              Real Payment Later
            </h3>
            <p className="text-slate-600 text-sm">
              Later this will connect with Razorpay. For now, demo credits keep
              the unlock flow working.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}