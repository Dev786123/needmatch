"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useParams } from "next/navigation";

export default function ApplyPage() {
  const params = useParams();
  const needId = params.id;

  const [proposal, setProposal] = useState("");
  const [bid, setBid] = useState("");
  const [message, setMessage] = useState("");

  const handleApply = async () => {
    if (!proposal || !bid) {
      setMessage("Please fill proposal and bid");
      return;
    }

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      setMessage("Please login first");
      window.location.href = "/login";
      return;
    }

    const { error } = await supabase.from("applications").insert([
      {
        need_id: needId,
        proposal,
        bid,
        provider_id: userData.user.id,
      },
    ]);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Application submitted successfully!");
      setProposal("");
      setBid("");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Apply to Need
        </h2>

        {message && (
          <p className="mb-4 text-center text-sm text-blue-600">
            {message}
          </p>
        )}

        <textarea
          placeholder="Write your proposal"
          className="w-full border p-2 mb-4 rounded h-32"
          value={proposal}
          onChange={(e) => setProposal(e.target.value)}
        />

        <input
          type="text"
          placeholder="Your bid amount"
          className="w-full border p-2 mb-4 rounded"
          value={bid}
          onChange={(e) => setBid(e.target.value)}
        />

        <button
          onClick={handleApply}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Submit Application
        </button>
      </div>
    </main>
  );
}