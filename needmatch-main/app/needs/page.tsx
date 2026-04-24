"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function NeedsPage() {
  const [needs, setNeeds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchNeeds = async () => {
    const { data, error } = await supabase
      .from("needs")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      setMessage(error.message);
    } else {
      setNeeds(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    const checkUserAndFetchNeeds = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        window.location.href = "/login";
        return;
      }

      fetchNeeds();
    };

    checkUserAndFetchNeeds();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Loading needs...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Browse Needs</h1>

      {message && (
        <p className="mb-4 text-sm text-red-600">{message}</p>
      )}

      {needs.length === 0 && (
        <p className="text-gray-500">No needs found</p>
      )}

      {needs.map((need) => (
        <div key={need.id} className="bg-white p-4 rounded-lg shadow mb-4">
          <h2 className="text-xl font-semibold">{need.title}</h2>

          <p className="text-gray-600">Budget: {need.budget}</p>

          <p className="text-gray-600">City: {need.city}</p>

          <a
            href={`/needs/${need.id}`}
            className="inline-block mt-3 mr-3 text-blue-600"
          >
            View Details
          </a>

          <a
            href={`/apply/${need.id}`}
            className="mt-3 inline-block bg-blue-600 text-white px-4 py-1 rounded"
          >
            Apply
          </a>
        </div>
      ))}
    </main>
  );
}