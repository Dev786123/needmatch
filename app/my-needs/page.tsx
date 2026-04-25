"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function MyNeedsPage() {
  const [needs, setNeeds] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [unlocks, setUnlocks] = useState<any[]>([]);
  const [myProfile, setMyProfile] = useState<any>(null);
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

    const userId = userData.user.id;

    const { data: profileRows, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .limit(1);

    if (profileError) {
      setMessage(profileError.message);
      setLoading(false);
      return;
    }

    const profile = profileRows?.[0];

    if (!profile) {
      setMessage("Profile not found. Please create profile first.");
      setLoading(false);
      return;
    }

    if (profile.role !== "client") {
      window.location.href = "/dashboard";
      return;
    }

    setMyProfile(profile);

    const { data: needsData, error: needsError } = await supabase
      .from("needs")
      .select("*")
      .eq("client_id", userId)
      .order("created_at", { ascending: false });

    if (needsError) {
      setMessage(needsError.message);
      setLoading(false);
      return;
    }

    const needIds = (needsData || []).map((need) => need.id);

    let appsData: any[] = [];
    let profilesData: any[] = [];
    let unlockRows: any[] = [];

    if (needIds.length > 0) {
      const { data: appRows, error: appsError } = await supabase
        .from("applications")
        .select("*")
        .in("need_id", needIds)
        .order("created_at", { ascending: false });

      if (appsError) {
        setMessage(appsError.message);
        setLoading(false);
        return;
      }

      appsData = appRows || [];

      const providerIds = [...new Set(appsData.map((app) => app.provider_id))];

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

      const { data: unlockData } = await supabase
        .from("unlocks")
        .select("*")
        .eq("client_id", userId);

      unlockRows = unlockData || [];
    }

    setNeeds(needsData || []);
    setApplications(appsData);
    setProfiles(profilesData);
    setUnlocks(unlockRows);
    setLoading(false);
  };

  const getApplicationsForNeed = (needId: string) => {
    return applications.filter((app) => app.need_id === needId);
  };

  const getProviderProfile = (providerId: string) => {
    return profiles.find((profile) => profile.user_id === providerId);
  };

  const isUnlocked = (providerId: string, needId: string) => {
    return unlocks.some(
      (unlock) => unlock.provider_id === providerId && unlock.need_id === needId
    );
  };

  const maskEmail = (email?: string) => {
    if (!email) return "Email not added";
    const [name, domain] = email.split("@");
    return `${name.slice(0, 2)}****@${domain}`;
  };

  const handleUnlock = async (app: any) => {
    setMessage("");

    if (!myProfile) return;

    if ((myProfile.credits || 0) < 5) {
      setMessage("Not enough credits. Please buy more credits.");
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;

    if (!userId) {
      window.location.href = "/login";
      return;
    }

    const { error: unlockError } = await supabase.from("unlocks").insert({
      client_id: userId,
      provider_id: app.provider_id,
      need_id: app.need_id,
      application_id: app.id,
    });

    if (unlockError) {
      setMessage(unlockError.message);
      return;
    }

    const { error: creditError } = await supabase
      .from("profiles")
      .update({ credits: (myProfile.credits || 0) - 5 })
      .eq("user_id", userId);

    if (creditError) {
      setMessage(creditError.message);
      return;
    }

    setMessage("Contact unlocked successfully!");
    fetchNeeds();
  };

  const handleCloseNeed = async (needId: string) => {
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
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-blue-600 font-semibold">Client Workspace</p>
            <h1 className="text-4xl font-bold text-slate-900">My Needs</h1>
            <p className="text-slate-600 mt-2">
              Manage your posted needs and provider applications.
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-slate-500">Credits</p>
            <p className="text-2xl font-bold text-blue-600">
              {myProfile?.credits || 0}
            </p>
          </div>
        </div>

        {message && (
          <p className="mb-5 text-sm text-blue-700 bg-blue-50 border border-blue-200 p-3 rounded-xl">
            {message}
          </p>
        )}

        {needs.length === 0 ? (
          <div className="bg-white rounded-2xl border p-10 text-center">
            <h2 className="text-2xl font-bold mb-2">No needs posted yet</h2>
            <p className="text-slate-600 mb-5">
              Post your first need to receive provider applications.
            </p>
            <Link
              href="/post-need"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Post Need
            </Link>
          </div>
        ) : (
          needs.map((need) => {
            const needApplications = getApplicationsForNeed(need.id);

            return (
              <div key={need.id} className="bg-white border rounded-2xl p-6 mb-6">
                <div className="flex justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {need.title}
                    </h2>
                    <p className="text-slate-600 mt-2">{need.description}</p>

                    <div className="flex flex-wrap gap-2 mt-4">
                      <span className="text-xs bg-slate-100 px-3 py-1 rounded-full">
                        {need.category || "No category"}
                      </span>
                      <span className="text-xs bg-slate-100 px-3 py-1 rounded-full">
                        Budget: {need.budget || "Not added"}
                      </span>
                      <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full capitalize">
                        {need.status || "open"}
                      </span>
                    </div>
                  </div>

                  {need.status === "open" && (
                    <button
                      onClick={() => handleCloseNeed(need.id)}
                      className="h-fit bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                      Close
                    </button>
                  )}
                </div>

                <div className="mt-6 border-t pt-5">
                  <h3 className="text-lg font-bold mb-4">
                    Applicants ({needApplications.length})
                  </h3>

                  {needApplications.length === 0 ? (
                    <p className="text-slate-600 bg-slate-50 border rounded-xl p-4">
                      No provider has applied yet.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {needApplications.map((app) => {
                        const provider = getProviderProfile(app.provider_id);
                        const unlocked =
                          isUnlocked(app.provider_id, need.id) ||
                          app.status === "accepted";

                        return (
                          <div
                            key={app.id}
                            className="border rounded-xl p-5 bg-slate-50"
                          >
                            <h4 className="font-bold text-slate-900">
                              {provider?.name || "Provider"}
                            </h4>

                            <p className="text-sm text-slate-500 mt-1">
                              {provider?.skill || "Skill not added"}
                            </p>

                            <div className="bg-white border rounded-lg p-3 mt-4">
                              <p className="text-xs text-slate-500">Email</p>
                              <p
                                className={`font-semibold ${
                                  unlocked ? "text-slate-900" : "blur-sm select-none"
                                }`}
                              >
                                {unlocked
                                  ? provider?.email || "Email not added"
                                  : maskEmail(provider?.email)}
                              </p>
                            </div>

                            <div className="bg-white border rounded-lg p-3 mt-3">
                              <p className="text-xs text-slate-500">Proposal</p>
                              <p className="text-sm text-slate-800">
                                {app.proposal || "No proposal added"}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-3">
                              <div className="bg-white border rounded-lg p-3">
                                <p className="text-xs text-slate-500">Bid</p>
                                <p className="font-bold">
                                  {app.price || app.bid || "Not added"}
                                </p>
                              </div>

                              <div className="bg-white border rounded-lg p-3">
                                <p className="text-xs text-slate-500">Status</p>
                                <p className="font-bold capitalize">
                                  {app.status || "pending"}
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-3 mt-4">
                              {!unlocked && (
                                <button
                                  onClick={() => handleUnlock(app)}
                                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg"
                                >
                                  Unlock 5 Credits
                                </button>
                              )}

                              <button
                                onClick={() =>
                                  updateApplicationStatus(app.id, "accepted")
                                }
                                disabled={app.status === "accepted"}
                                className="flex-1 bg-green-600 text-white py-2 rounded-lg disabled:bg-green-300"
                              >
                                Accept
                              </button>

                              <button
                                onClick={() =>
                                  updateApplicationStatus(app.id, "rejected")
                                }
                                disabled={app.status === "rejected"}
                                className="flex-1 bg-red-600 text-white py-2 rounded-lg disabled:bg-red-300"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </section>
    </main>
  );
}
