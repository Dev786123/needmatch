"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function PostNeedPage() {
  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState("");
  const [city, setCity] = useState("");

  const handleSubmit = async () => {
    if (!title || !budget || !city) {
      alert("Please fill all fields");
      return;
    }

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      alert("Please login first");
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
      alert(error.message);
    } else {
      alert("Need posted successfully!");
      setTitle("");
      setBudget("");
      setCity("");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Post Your Need
        </h2>

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
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Post Need
        </button>
      </div>
    </main>
  );
}
