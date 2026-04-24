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

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Loading your applications...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">My Applications</h1>

      {message && (
        <p className="mb-4 text-sm text-blue-600">{message}</p>
      )}

      {applications.length === 0 && (
        <p className="text-gray-500">No applications found.</p>
      )}

      {applications.map((app) => {
        const need = getNeed(app.need_id);

        return (
          <div key={app.id} className="bg-white p-4 rounded-lg shadow mb-4">
            <h2 className="text-xl font-bold mb-2">
              {need?.title || "Need not found"}
            </h2>

            <p>
              <strong>Need ID:</strong> {app.need_id}
            </p>

            <p>
              <strong>Budget:</strong> {need?.budget || "Not available"}
            </p>

            <p>
              <strong>City:</strong> {need?.city || "Not available"}
            </p>

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
          </div>
        );
      })}
    </main>
  );
}