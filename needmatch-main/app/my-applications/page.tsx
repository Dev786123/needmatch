"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [needs, setNeeds] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      window.location.href = "/login";
      return;
    }

    const { data: appsData, error } = await supabase
      .from("applications")
      .select("*")
      .eq("provider_id", userData.user.id);

    const { data: needsData } = await supabase.from("needs").select("*");

    if (error) {
      setMessage(error.message);
    } else {
      setApplications(appsData || []);
      setNeeds(needsData || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getNeed = (needId: number) => {
    return needs.find((need) => need.id === needId);
  };

  const getStatusClass = (status: string) => {
    if (status === "ACCEPTED") return "bg-green-50 text-green-700 border-green-200";
    if (status === "REJECTED") return "bg-red-50 text-red-700 border-red-200";
    return "bg-yellow-50 text-yellow-700 border-yellow-200";
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Loading your applications...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-white border-b px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <p className="text-blue-600 font-medium mb-2">Provider Workspace</p>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            My Applications
          </h1>
          <p className="text-slate-600">
            Track your proposals, bids, and application status in one place.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-8">
        {message && (
          <p className="mb-4 text-sm text-blue-600 bg-blue-50 border border-blue-200 p-3 rounded-lg">
            {message}
          </p>
        )}

        {applications.length === 0 && (
          <div className="bg-white rounded-2xl border p-8 text-center">
            <h2 className="text-xl font-bold mb-2">No applications found</h2>
            <p className="text-slate-600 mb-4">
              Browse available needs and submit your first proposal.
            </p>
            <a
              href="/needs"
              className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg"
            >
              Browse Needs
            </a>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((app) => {
            const need = getNeed(app.need_id);
            const status = app.status || "PENDING";

            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {need?.title || "Need not found"}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Need ID: {app.need_id}
                    </p>
                  </div>

                  <span
                    className={`border text-xs font-medium px-3 py-1 rounded-full ${getStatusClass(
                      status
                    )}`}
                  >
                    {status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-50 border rounded-xl p-3">
                    <p className="text-sm text-slate-500">Budget</p>
                    <p className="font-bold text-slate-900">
                      {need?.budget || "Not available"}
                    </p>
                  </div>

                  <div className="bg-slate-50 border rounded-xl p-3">
                    <p className="text-sm text-slate-500">City</p>
                    <p className="font-bold text-slate-900">
                      {need?.city || "Not available"}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 border rounded-xl p-3 mb-3">
                  <p className="text-sm text-slate-500">Your Proposal</p>
                  <p className="text-slate-800">{app.proposal}</p>
                </div>

                <div className="bg-slate-50 border rounded-xl p-3">
                  <p className="text-sm text-slate-500">Your Bid</p>
                  <p className="text-slate-900 font-bold">{app.bid}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}