"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function PostNeedPage() {
  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async () => {
    if (!title || !budget || !city) {
      setMessage("Please fill all fields");
      return;
    }

    setSubmitting(true);

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      window.location.href = "/login";
      return;
    }

    const { error } = await supabase.from("needs").insert([
      {
        title,
        budget,
        city,
        user_id: userData.user.id,
      },
    ]);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Need posted successfully!");
      setTitle("");
      setBudget("");
      setCity("");
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Checking login...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-white border-b px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <p className="text-blue-600 font-medium mb-2">Client Action</p>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Post Your Need
          </h1>
          <p className="text-slate-600">
            Describe your requirement clearly so providers can send better
            proposals.
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

          <label className="block mb-2 font-medium text-slate-700">
            Need Title
          </label>
          <input
            type="text"
            placeholder="Example: Need a Shopify website"
            className="w-full border p-3 mb-5 rounded-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label className="block mb-2 font-medium text-slate-700">
            Budget
          </label>
          <input
            type="text"
            placeholder="Example: ₹3000 - ₹5000"
            className="w-full border p-3 mb-5 rounded-lg"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />

          <label className="block mb-2 font-medium text-slate-700">
            City
          </label>
          <input
            type="text"
            placeholder="Example: Surat"
            className="w-full border p-3 mb-6 rounded-lg"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            {submitting ? "Posting..." : "Post Need"}
          </button>
        </div>
      </section>
    </main>
  );
}