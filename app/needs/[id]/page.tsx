"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function NeedDetailPage() {
  const params = useParams();
  const needId = params.id;

  const [need, setNeed] = useState<any>(null);
  const [message, setMessage] = useState("");

  const fetchNeed = async () => {
    const { data, error } = await supabase
      .from("needs")
      .select("*")
      .eq("id", needId)
      .maybeSingle();

    if (error) {
      setMessage(error.message);
    } else {
      setNeed(data);
    }
  };

  useEffect(() => {
    fetchNeed();
  }, []);

  if (!need && !message) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Loading need...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-white border-b px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <a href="/needs" className="text-blue-600 font-medium">
            ← Back to Needs
          </a>

          <h1 className="text-4xl font-bold text-slate-900 mt-4 mb-3">
            {need?.title || "Need not found"}
          </h1>

          <p className="text-slate-600">
            Review this requirement and apply if it matches your skills.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-8">
        {message && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">
            {message}
          </p>
        )}

        {need && (
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border rounded-xl p-4">
                <p className="text-sm text-slate-500">Budget</p>
                <h2 className="text-2xl font-bold text-slate-900">
                  {need.budget}
                </h2>
              </div>

              <div className="border rounded-xl p-4">
                <p className="text-sm text-slate-500">City</p>
                <h2 className="text-2xl font-bold text-slate-900">
                  {need.city}
                </h2>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-slate-500 mb-1">Posted At</p>
              <p className="text-slate-700">{need.created_at}</p>
            </div>

            <div className="flex gap-3 flex-wrap">
              <a
                href={`/apply/${need.id}`}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
              >
                Apply Now
              </a>

              <a
                href="/needs"
                className="border px-5 py-2 rounded-lg text-slate-700 hover:bg-slate-50"
              >
                Browse More
              </a>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}