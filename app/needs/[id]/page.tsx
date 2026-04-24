"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function NeedDetailPage() {
  const params = useParams();
  const needId = params.id;

  const [need, setNeed] = useState<any>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchNeed = async () => {
      const { data, error } = await supabase
        .from("needs")
        .select("*")
        .eq("id", needId)
        .maybeSingle();

      if (error) setMessage(error.message);
      else setNeed(data);
    };

    fetchNeed();
  }, [needId]);

  if (!need && !message) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Loading need...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-white border-b px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <a href="/needs" className="font-semibold text-blue-600 hover:underline">
            ← Back to Browse Needs
          </a>

          <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                Open Requirement
              </span>

              <h1 className="mt-4 text-4xl font-extrabold text-slate-950">
                {need?.title || "Need not found"}
              </h1>

              <p className="mt-3 text-slate-600">
                Review the requirement and submit your proposal if it matches your skills.
              </p>
            </div>

            {need && (
              <a
                href={`/apply/${need.id}`}
                className="rounded-xl bg-blue-600 px-6 py-3 text-center font-semibold text-white hover:bg-blue-700"
              >
                Apply Now
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-10">
        {message && (
          <p className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
            {message}
          </p>
        )}

        {need && (
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-xs font-medium text-slate-500">Budget</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-950">
                  {need.budget || "Not mentioned"}
                </h2>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-xs font-medium text-slate-500">City</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-950">
                  {need.city || "Not mentioned"}
                </h2>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-xs font-medium text-slate-500">Status</p>
                <h2 className="mt-1 text-2xl font-bold text-green-700">
                  Open
                </h2>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border p-5">
              <p className="text-sm font-semibold text-slate-500">Posted At</p>
              <p className="mt-1 text-slate-700">{need.created_at}</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`/apply/${need.id}`}
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Apply Now
              </a>

              <a
                href="/needs"
                className="rounded-xl border bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-100"
              >
                Browse More Needs
              </a>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}