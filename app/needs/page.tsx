"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function NeedsPage() {
  const [needs, setNeeds] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");

  const loadNeeds = async () => {
    setLoading(true);
    setMessage("");

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      window.location.href = "/login";
      return;
    }

    setCurrentUserId(userData.user.id);

    const { data: profileRows } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", userData.user.id)
      .limit(1);

    const profile =
      profileRows && profileRows.length > 0 ? profileRows[0] : null;

    if (profile?.role !== "provider") {
      window.location.href = "/dashboard";
      return;
    }

    const { data: needsData, error: needsError } = await supabase
      .from("needs")
      .select("*")
      .eq("status", "open")
      .order("created_at", { ascending: false });

    if (needsError) {
      setMessage(needsError.message);
      setLoading(false);
      return;
    }

    const { data: appsData, error: appsError } = await supabase
      .from("applications")
      .select("*")
      .eq("provider_id", userData.user.id);

    if (appsError) {
      setMessage(appsError.message);
      setLoading(false);
      return;
    }

    const cleanNeeds = (needsData || []).filter((need) => need.title);

    setNeeds(cleanNeeds);
    setApplications(appsData || []);
    setLoading(false);
  };

  useEffect(() => {
    loadNeeds();
  }, []);

  const getApplication = (needId: string) => {
    return applications.find(
      (app) => app.need_id === needId && app.provider_id === currentUserId
    );
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Loading needs...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-white border-b px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <p className="text-blue-600 font-semibold mb-2">Provider Workspace</p>
          <h1 className="text-4xl font-extrabold text-slate-950">
            Browse Needs
          </h1>
          <p className="mt-3 text-slate-600">
            Find real requirements and apply with your best proposal.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-10">
        {message && (
          <p className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
            {message}
          </p>
        )}

        {needs.length === 0 ? (
          <div className="rounded-3xl border bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-bold">No needs found</h2>
            <p className="mt-2 text-slate-600">
              New work opportunities will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {needs.map((need) => {
              const applied = getApplication(need.id);

              return (
                <div
                  key={need.id}
                  className="rounded-3xl border bg-white p-6 shadow-sm hover:-translate-y-1 hover:shadow-xl transition"
                >
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-slate-950">
                        {need.title}
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        {need.category || "Posted requirement"}
                      </p>
                    </div>

                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 capitalize">
                      {need.status || "open"}
                    </span>
                  </div>

                  {need.description && (
                    <p className="mb-4 line-clamp-3 text-sm text-slate-600">
                      {need.description}
                    </p>
                  )}

                  <div className="space-y-3">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-medium text-slate-500">
                        Budget
                      </p>
                      <p className="mt-1 font-bold text-slate-900">
                        {need.budget || "Not mentioned"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-medium text-slate-500">City</p>
                      <p className="mt-1 font-bold text-slate-900">
                        {need.city || "Not mentioned"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <a
                      href={`/needs/${need.id}`}
                      className="flex-1 rounded-xl border px-4 py-2 text-center font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      Details
                    </a>

                    {applied ? (
                      <div className="flex-1 rounded-xl bg-slate-100 px-4 py-2 text-center font-semibold text-slate-700 capitalize">
                        {applied.status || "pending"}
                      </div>
                    ) : (
                      <a
                        href={`/apply/${need.id}`}
                        className="flex-1 rounded-xl bg-blue-600 px-4 py-2 text-center font-semibold text-white hover:bg-blue-700"
                      >
                        Apply
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}