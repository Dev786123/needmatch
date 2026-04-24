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

  // 🔒 Route protection
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
      setMessage("Please login first");
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

  // ⏳ Loading screen
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Checking login...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Post Your Need
        </h2>

        {message && (
          <p className="mb-4 text-center text-sm text-blue-600">
            {message}
          </p>
        )}

        <input
          type="text"
          placeholder="Title"
          className="w-full border p-2 mb-4 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Budget"
          className="w-full border p-2 mb-4 rounded"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />

        <input
          type="text"
          placeholder="City"
          className="w-full border p-2 mb-4 rounded"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {submitting ? "Posting..." : "Post Need"}
        </button>
      </div>
    </main>
  );
}