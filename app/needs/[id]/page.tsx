"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function NeedDetailPage() {
  const params = useParams();
  const needId = params.id;

  const [need, setNeed] = useState<any>(null);

  const fetchNeed = async () => {
    const { data, error } = await supabase
      .from("needs")
      .select("*")
      .eq("id", needId)
      .single();

    if (error) {
      console.log(error.message);
    } else {
      setNeed(data);
    }
  };

  useEffect(() => {
    fetchNeed();
  }, []);

  if (!need) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Loading need...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-4">{need.title}</h1>

        <p className="text-gray-700 mb-3">
          <strong>Budget:</strong> {need.budget}
        </p>

        <p className="text-gray-700 mb-3">
          <strong>City:</strong> {need.city}
        </p>

        <p className="text-gray-700 mb-6">
          <strong>Posted At:</strong> {need.created_at}
        </p>

        <a
          href={`/apply/${need.id}`}
          className="inline-block bg-blue-600 text-white px-5 py-2 rounded"
        >
          Apply Now
        </a>
      </div>
    </main>
  );
}