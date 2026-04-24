"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function CreditsPage() {
  const [balance, setBalance] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const loadCredits = async () => {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      window.location.href = "/login";
      return;
    }

    const { data, error } = await supabase
      .from("credits")
      .select("*")
      .eq("user_id", userData.user.id)
      .maybeSingle();

    if (error) {
      setMessage(error.message);
    }

    if (data) {
      setBalance(data.balance || 0);
    }

    setLoading(false);
  };

  const addCredits = async () => {
    setAdding(true);

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      window.location.href = "/login";
      return;
    }

    const newBalance = balance + 5;

    const { error } = await supabase.from("credits").upsert([
      {
        user_id: userData.user.id,
        balance: newBalance,
      },
    ]);

    if (error) {
      setMessage(error.message);
    } else {
      setBalance(newBalance);
      setMessage("5 demo credits added!");
    }

    setAdding(false);
  };

  useEffect(() => {
    loadCredits();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Loading credits...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">Credits</h1>

        {message && (
          <p className="mb-4 text-center text-sm text-blue-600">
            {message}
          </p>
        )}

        <p className="text-lg mb-6">
          Current Balance: <strong>{balance}</strong>
        </p>

        <button
          onClick={addCredits}
          disabled={adding}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {adding ? "Adding..." : "Add 5 Demo Credits"}
        </button>

        <p className="text-sm text-gray-500 mt-4">
          Later this button will connect with Razorpay payment.
        </p>
      </div>
    </main>
  );
}