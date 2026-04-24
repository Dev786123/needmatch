"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);

  const fetchApplications = async () => {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      console.log("Please login first");
      window.location.href = "/login";
      return;
    }

    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("provider_id", userData.user.id);

    if (error) {
      console.log(error.message);
    } else {
      setApplications(data || []);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">My Applications</h1>

      {applications.length === 0 && (
        <p className="text-gray-500">No applications found.</p>
      )}

      {applications.map((app) => (
        <div key={app.id} className="bg-white p-4 rounded-lg shadow mb-4">
          <p>
            <strong>Need ID:</strong> {app.need_id}
          </p>
          <p>
            <strong>Proposal:</strong> {app.proposal}
          </p>
          <p>
            <strong>Bid:</strong> {app.bid}
          </p>
        </div>
      ))}
    </main>
  );
}