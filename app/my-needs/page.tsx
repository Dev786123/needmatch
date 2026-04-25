"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function MyNeedsPage() {
  const [needs, setNeeds] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchNeeds = async () => {
    setLoading(true);
    setMessage("");

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      window.location.href = "/login";
      return;
    }

    const { data: profileRows } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", userData.user.id)
      .limit(1);

    const profile = profileRows && profileRows.length > 0 ? profileRows[0] : null;

    if (profile?.role !== "client") {
      window.location.href = "/dashboard";
      return;
    }

    const { data: needsData, error: needsError } = await supabase
      .from("needs")
      .select("*")
      .eq("client_id", userData.user.id)
      .order("created_at", { ascending: false });

    if (needsError) {
      setMessage(needsError.message);
      setLoading(false);
      return;
    }

    const needIds = (needsData || []).map((need) => need.id);

    let appsData: any[] = [];
    let profilesData: any[] = [];

    if (needIds.length > 0) {
      const { data: appRows, error: appsError } = await supabase
        .from("applications")
        .select("*")
        .in("need_id", needIds)
        .order("ai_score", { ascending: false, nullsFirst: false });

      if (appsError) {
        setMessage(appsError.message);
        setLoading(false);
        return;
      }

      appsData = appRows || [];

      const providerIds = appsData.map((app) => app.provider_id);

      if (providerIds.length > 0) {
        const { data: providerRows, error: providerError } = await supabase
          .from("profiles")
          .select("*")
          .in("user_id", providerIds);

        if (providerError) {
          setMessage(providerError.message);
          setLoading(false);
          return;
        }

        profilesData = providerRows || [];
      }
    }

    setNeeds(needsData || []);
    setApplications(appsData);
    setProfiles(profilesData);
    setLoading(false);
  };

  const getApplicationsForNeed = (needId: string) => {
    return applications.filter((app) => app.need_id === needId);
  };

  const getProviderProfile = (providerId: string) => {
    return profiles.find((profile) => profile.user_id === providerId);
  };

  const handleCloseNeed = async (needId: string) => {
    setMessage("");

    const { error } = await supabase
      .from("needs")
      .update({ status: "closed" })
      .eq("id", needId);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Need closed successfully!");
    fetchNeeds();
  };

  const updateApplicationStatus = async (
    applicationId: string,
    status: "accepted" | "rejected"
  ) => {
    setMessage("");

    const { error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", applicationId);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage(`Application ${status} successfully!`);
    fetchNeeds();
  };

  const getScoreColor = (score: number | null) => {
    if (score === null || score === undefined) {
      return "bg-slate-100 text-slate-600 border-slate-200";
    }

    if (score >= 75) {
      return "bg-green-50 text-green-700 border-green-200";
    }

    if (score >= 50) {
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    }

    return "bg-red-50 text-red-700 border-red-200";
  };

  useEffect(() => {
    fetchNeeds();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Loading your needs...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-white border-b px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <p className="text-blue-600 font-medium mb-2">Client Workspace</p>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">My Needs</h1>
          <p className="text-slate-600">
            Review provider applications and compare them using AI Match Score.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-8">
        {message && (
          <p className="mb-4 text-sm text-blue-600 bg-blue-50 border border-blue-200 p-3 rounded-lg">
            {message}
          </p>
        )}

        {needs.length === 0 && (
          <div className="bg-white rounded-2xl border p-8 text-center">
            <h2 className="text-xl font-bold mb-2">No needs posted yet</h2>
            <p className="text-slate-600 mb-4">
              Post your first need to start receiving provider applications.
            </p>
            <a
              href="/post-need"
              className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg"
            >
              Post Need
            </a>
          </div>
        )}

        {needs.map((need) => {
          const needApplications = getApplicationsForNeed(need.id);

          return (
            <div key={need.id} className="bg-white border rounded-2xl p-6 mb-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {need.title}
                  </h2>
                  <p className="text-slate-600 mt-2">{need.description}</p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                      {need.category || "No category"}
                    </span>
                    <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                      Budget: {need.budget || "Not added"}
                    </span>
                    <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                      City: {need.city || "Not added"}
                    </span>
                    <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full capitalize">
                      Status: {need.status || "open"}
                    </span>
                  </div>
                </div>

                {need.status === "open" && (
                  <button
                    onClick={() => handleCloseNeed(need.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    Close
                  </button>
                )}
              </div>

              <div className="mt-6 border-t pt-5">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Applicants ({needApplications.length})
                </h3>

                {needApplications.length === 0 && (
                  <div className="bg-slate-50 border rounded-xl p-4">
                    <p className="text-slate-600">
                      No provider has applied yet.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {needApplications.map((app) => {
                    const provider = getProviderProfile(app.provider_id);
                    const aiScore =
                      app.ai_score === null || app.ai_score === undefined
                        ? null
                        : Number(app.ai_score);

                    return (
                      <div
                        key={app.id}
                        className="border rounded-xl p-5 bg-slate-50"
                      >
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div>
                            <h4 className="font-bold text-slate-900">
                              {provider?.name || "Provider"}
                            </h4>
                            <p className="text-sm text-slate-500">
                              {provider?.skill || "Skill not added"}
                            </p>
                          </div>

                          <span
                            className={`border text-xs font-bold px-3 py-1 rounded-full capitalize ${getScoreColor(
                              aiScore
                            )}`}
                          >
                            AI Match:{" "}
                            {aiScore !== null ? `${aiScore}%` : "N/A"}
                          </span>
                        </div>

                        <div className="bg-white border rounded-lg p-3 mb-3">
                          <p className="text-xs text-slate-500 mb-1">
                            AI Reason
                          </p>
                          <p className="text-sm text-slate-800">
                            {app.ai_reason || "AI score not available"}
                          </p>
                        </div>

                        <div className="bg-white border rounded-lg p-3 mb-3">
                          <p className="text-xs text-slate-500 mb-1">
                            Proposal
                          </p>
                          <p className="text-sm text-slate-800">
                            {app.proposal || "No proposal added"}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="bg-white border rounded-lg p-3">
                            <p className="text-xs text-slate-500">Bid</p>
                            <p className="font-bold text-slate-900">
                              {app.price || app.bid || "Not added"}
                            </p>
                          </div>

                          <div className="bg-white border rounded-lg p-3">
                            <p className="text-xs text-slate-500">Status</p>
                            <p className="font-bold capitalize text-slate-900">
                              {app.status || "pending"}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() =>
                              updateApplicationStatus(app.id, "accepted")
                            }
                            disabled={app.status === "accepted"}
                            className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-green-300"
                          >
                            Accept
                          </button>

                          <button
                            onClick={() =>
                              updateApplicationStatus(app.id, "rejected")
                            }
                            disabled={app.status === "rejected"}
                            className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:bg-red-300"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
