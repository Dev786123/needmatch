"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function MyNeedsPage() {
  const [needs, setNeeds] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [unlocks, setUnlocks] = useState<any[]>([]);

  const fetchData = async () => {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      console.log("Please login first");
      window.location.href = "/login";
      return;
    }

    const { data: needsData } = await supabase
      .from("needs")
      .select("*")
      .eq("user_id", userData.user.id);

    const { data: appsData } = await supabase
      .from("applications")
      .select("*");

    const { data: profilesData } = await supabase
      .from("profiles")
      .select("*");

    const { data: unlocksData } = await supabase
      .from("contact_unlocks")
      .select("*");

    setNeeds(needsData || []);
    setApplications(appsData || []);
    setProfiles(profilesData || []);
    setUnlocks(unlocksData || []);
  };

  const updateApplicationStatus = async (appId: number, status: string) => {
    const { error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", appId);

    if (error) {
      console.log(error.message);
    } else {
      console.log(`Application ${status}`);
      fetchData();
    }
  };

  const handleUnlock = async (app: any) => {
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    console.log("Please login first");
    window.location.href = "/login";
    return;
  }

  // 🔥 1. Get current credits
  const { data: creditData } = await supabase
    .from("credits")
    .select("*")
    .eq("user_id", userData.user.id)
    .single();

  const currentCredits = creditData?.balance || 0;

  // ❌ Not enough credits
  if (currentCredits <= 0) {
    console.log("No credits left! Buy credits first.");
    window.location.href = "/credits";
    return;
  }

  // 🔥 2. Deduct 1 credit
  const { error: creditError } = await supabase
    .from("credits")
    .update({ balance: currentCredits - 1 })
    .eq("user_id", userData.user.id);

  if (creditError) {
    console.log(creditError.message);
    return;
  }

  // 🔥 3. Save unlock
  const { error } = await supabase.from("contact_unlocks").insert([
    {
      need_id: app.need_id,
      application_id: app.id,
      client_id: userData.user.id,
      provider_id: app.provider_id,
    },
  ]);

  if (error) {
    console.log(error.message);
  } else {
    console.log("Contact unlocked!");
    fetchData();
  }
};

  useEffect(() => {
    fetchData();
  }, []);

  const getProviderProfile = (providerId: string) => {
    return profiles.find((profile) => profile.user_id === providerId);
  };

  const isUnlocked = (applicationId: number) => {
    return unlocks.some((unlock) => unlock.application_id === applicationId);
  };

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">My Needs</h1>

      {needs.length === 0 && (
        <p className="text-gray-500">No needs found.</p>
      )}

      {needs.map((need) => {
        const needApplications = applications.filter(
          (app) => app.need_id === need.id
        );

        return (
          <div key={need.id} className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="text-xl font-bold">{need.title}</h2>
            <p>Budget: {need.budget}</p>
            <p>City: {need.city}</p>

            <h3 className="mt-4 font-semibold">Applications:</h3>

            {needApplications.length === 0 && (
              <p className="text-gray-500 mt-2">No applications yet.</p>
            )}

            {needApplications.map((app) => {
              const provider = getProviderProfile(app.provider_id);
              const unlocked = isUnlocked(app.id);

              return (
                <div key={app.id} className="border p-3 mt-3 rounded">
                  <p>
                    <strong>Provider:</strong>{" "}
                    {provider?.name || "Profile not completed"}
                  </p>

                  <p>
                    <strong>Skill:</strong> {provider?.skill || "Not added"}
                  </p>

                  <p>
                    <strong>City:</strong> {provider?.city || "Not added"}
                  </p>

                  {unlocked ? (
                    <p>
                      <strong>Phone:</strong>{" "}
                      {provider?.phone || "Phone not added"}
                    </p>
                  ) : (
                    <button
                      onClick={() => handleUnlock(app)}
                      className="bg-purple-600 text-white px-3 py-1 rounded mt-2"
                    >
                      Unlock Contact
                    </button>
                  )}

                  <hr className="my-2" />

                  <p>
                    <strong>Proposal:</strong> {app.proposal}
                  </p>

                  <p>
                    <strong>Bid:</strong> {app.bid}
                  </p>

                  <p>
                    <strong>Status:</strong> {app.status || "PENDING"}
                  </p>

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() =>
                        updateApplicationStatus(app.id, "ACCEPTED")
                      }
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() =>
                        updateApplicationStatus(app.id, "REJECTED")
                      }
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </main>
  );
}