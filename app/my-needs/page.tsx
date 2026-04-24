"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function MyNeedsPage() {
  const [needs, setNeeds] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [unlocks, setUnlocks] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    setMessage("");

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      window.location.href = "/login";
      return;
    }

    const { data: profilesData } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userData.user.id)
      .limit(1);

    const currentProfile =
      profilesData && profilesData.length > 0 ? profilesData[0] : null;

    if (currentProfile?.role !== "client") {
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

    if (needIds.length > 0) {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .in("need_id", needIds)
        .order("created_at", { ascending: false });

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      appsData = data || [];
    }

    const providerIds = Array.from(
      new Set(appsData.map((app) => app.provider_id).filter(Boolean))
    );

    let providerProfiles: any[] = [];

    if (providerIds.length > 0) {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .in("user_id", providerIds);

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      providerProfiles = data || [];
    }

    let unlocksData: any[] = [];

    if (needIds.length > 0) {
      const { data, error } = await supabase
        .from("contact_unlocks")
        .select("*")
        .eq("client_id", userData.user.id)
        .in("need_id", needIds);

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      unlocksData = data || [];
    }

    setNeeds(needsData || []);
    setApplications(appsData);
    setProfiles(providerProfiles);
    setUnlocks(unlocksData);
    setLoading(false);
  };

  const updateApplicationStatus = async (appId: string, status: string) => {
    setMessage("");

    const { error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", appId);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage(`Application ${status}`);
    fetchData();
  };

  const handleUnlock = async (app: any) => {
    setMessage("");

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      window.location.href = "/login";
      return;
    }

    const alreadyUnlocked = unlocks.some(
      (unlock) =>
        unlock.client_id === userData.user.id &&
        unlock.provider_id === app.provider_id &&
        unlock.need_id === app.need_id
    );

    if (alreadyUnlocked) {
      setMessage("Contact already unlocked.");
      return;
    }

    const { data: creditRows, error: creditFetchError } = await supabase
      .from("credits")
      .select("*")
      .eq("user_id", userData.user.id)
      .limit(1);

    if (creditFetchError) {
      setMessage(creditFetchError.message);
      return;
    }

    let creditData = creditRows && creditRows.length > 0 ? creditRows[0] : null;

    if (!creditData) {
      const { data: newCreditRows, error: creditCreateError } = await supabase
        .from("credits")
        .insert([
          {
            user_id: userData.user.id,
            balance: 5,
          },
        ])
        .select("*");

      if (creditCreateError) {
        setMessage(creditCreateError.message);
        return;
      }

      creditData =
        newCreditRows && newCreditRows.length > 0 ? newCreditRows[0] : null;
    }

    const currentCredits = creditData?.balance || 0;

    if (currentCredits <= 0) {
      setMessage("No credits left! Buy credits first.");
      window.location.href = "/credits";
      return;
    }

    const { error: unlockError } = await supabase
      .from("contact_unlocks")
      .insert([
        {
          need_id: app.need_id,
          client_id: userData.user.id,
          provider_id: app.provider_id,
        },
      ]);

    if (unlockError) {
      setMessage(unlockError.message);
      return;
    }

    const { error: creditUpdateError } = await supabase
      .from("credits")
      .update({
        balance: currentCredits - 1,
      })
      .eq("user_id", userData.user.id);

    if (creditUpdateError) {
      setMessage(creditUpdateError.message);
      return;
    }

    setMessage("Contact unlocked!");
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getProviderProfile = (providerId: string) => {
    return profiles.find((profile) => profile.user_id === providerId);
  };

  const isUnlocked = (app: any) => {
    return unlocks.some(
      (unlock) =>
        unlock.provider_id === app.provider_id && unlock.need_id === app.need_id
    );
  };

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
            Manage your posted requirements, review applicants, and unlock
            provider contacts.
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
            <h2 className="text-xl font-bold mb-2">No needs found</h2>
            <p className="text-slate-600 mb-4">
              Post your first requirement and start receiving applications.
            </p>
            <a
              href="/post-need"
              className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg"
            >
              Post a Need
            </a>
          </div>
        )}

        <div className="space-y-6">
          {needs.map((need) => {
            const needApplications = applications.filter(
              (app) => app.need_id === need.id
            );

            return (
              <div
                key={need.id}
                className="bg-white rounded-2xl shadow-sm border p-6"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b pb-4 mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {need.title}
                    </h2>

                    <p className="text-slate-600 mt-1">
                      Budget: <strong>{need.budget}</strong> · City:{" "}
                      <strong>{need.city}</strong>
                    </p>

                    {need.category && (
                      <p className="text-sm text-slate-500 mt-1">
                        Category: {need.category}
                      </p>
                    )}

                    {need.description && (
                      <p className="text-slate-700 mt-3">
                        {need.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-2">
                    <span className="bg-blue-50 text-blue-600 text-sm font-medium px-3 py-1 rounded-full">
                      {needApplications.length} Applications
                    </span>

                    <span className="bg-slate-100 text-slate-700 text-sm font-medium px-3 py-1 rounded-full capitalize">
                      {need.status || "open"}
                    </span>
                  </div>
                </div>

                {needApplications.length === 0 && (
                  <div className="bg-slate-50 rounded-xl p-4 text-slate-600">
                    No applications yet.
                  </div>
                )}

                <div className="space-y-4">
                  {needApplications.map((app) => {
                    const provider = getProviderProfile(app.provider_id);
                    const unlocked = isUnlocked(app);

                    return (
                      <div
                        key={app.id}
                        className="border rounded-xl p-4 bg-slate-50"
                      >
                        <div className="flex flex-col md:flex-row md:justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-bold text-slate-900">
                              {provider?.name || "Profile not completed"}
                            </h3>

                            <p className="text-sm text-slate-600">
                              {provider?.skill || "Skill not added"} ·{" "}
                              {provider?.city || "City not added"}
                            </p>
                          </div>

                          <span className="h-fit bg-white border text-slate-700 text-sm px-3 py-1 rounded-full capitalize">
                            {app.status || "pending"}
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white rounded-lg p-3 border">
                            <p className="text-sm text-slate-500">Proposal</p>
                            <p className="text-slate-800">
                              {app.proposal || "No proposal"}
                            </p>
                          </div>

                          <div className="bg-white rounded-lg p-3 border">
                            <p className="text-sm text-slate-500">Price</p>
                            <p className="text-slate-800 font-bold">
                              {app.price || app.bid || "Not added"}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4">
                          {unlocked ? (
                            <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg">
                              <p>
                                <strong>Phone:</strong>{" "}
                                {provider?.phone || "Phone not added"}
                              </p>
                              <p>
                                <strong>City:</strong>{" "}
                                {provider?.city || "City not added"}
                              </p>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleUnlock(app)}
                              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                            >
                              Unlock Contact · 1 Credit
                            </button>
                          )}
                        </div>

                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() =>
                              updateApplicationStatus(app.id, "accepted")
                            }
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                          >
                            Accept
                          </button>

                          <button
                            onClick={() =>
                              updateApplicationStatus(app.id, "rejected")
                            }
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}