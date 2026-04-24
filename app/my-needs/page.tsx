"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function MyNeedsPage() {
  const [needs, setNeeds] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchNeeds = async () => {
    setLoading(true);
    setMessage("");

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      window.location.href = "/login";
      return;
    }

    const { data: needsData } = await supabase
      .from("needs")
      .select("*")
      .eq("client_id", userData.user.id)
      .order("created_at", { ascending: false });

    setNeeds(needsData || []);
    setLoading(false);
  };

  // 🔥 CLOSE NEED FUNCTION
  const handleCloseNeed = async (needId: string) => {
    setMessage("");

    const { error } = await supabase
      .from("needs")
      .update({ status: "closed" })
      .eq("id", needId);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Need closed successfully!");
    fetchNeeds();
  };

  useEffect(() => {
    fetchNeeds();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">My Needs</h1>

      {message && (
        <p className="mb-4 bg-blue-50 p-3 rounded">{message}</p>
      )}

      {needs.map((need) => (
        <div
          key={need.id}
          className="bg-white border rounded-xl p-5 mb-5"
        >
          <h2 className="text-xl font-bold">{need.title}</h2>

          <p className="text-slate-600 mt-2">
            {need.description}
          </p>

          <p className="mt-2 text-sm">
            Status:{" "}
            <span className="font-bold capitalize">
              {need.status}
            </span>
          </p>

          {/* 🔥 CLOSE BUTTON */}
          {need.status === "open" && (
            <button
              onClick={() => handleCloseNeed(need.id)}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Close Need
            </button>
          )}
        </div>
      ))}
    </main>
  );
}