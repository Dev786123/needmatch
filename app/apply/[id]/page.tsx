"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useParams } from "next/navigation";

export default function ApplyPage() {
  const params = useParams();
  const needId = params.id;

  const [proposal, setProposal] = useState("");
  const [bid, setBid] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    const checkUserRoleAndApplication = async () => {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        window.location.href = "/login";
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", userData.user.id)
        .maybeSingle();

      if (profile?.role !== "provider") {
        window.location.href = "/dashboard";
        return;
      }

      const { data: existingApplication } = await supabase
        .from("applications")
        .select("*")
        .eq("need_id", needId)
        .eq("provider_id", userData.user.id)
        .maybeSingle();

      if (existingApplication) {
        setAlreadyApplied(true);
        setMessage("You have already applied to this need.");
      }

      setLoading(false);
    };

    checkUserRoleAndApplication();
  }, [needId]);

  const handleApply = async () => {
    if (!proposal || !bid) {
      setMessage("Please fill proposal and bid");
      return;
    }

    setSubmitting(true);

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      window.location.href = "/login";
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", userData.user.id)
      .maybeSingle();

    if (profile?.role !== "provider") {
      window.location.href = "/dashboard";
      return;
    }

    const { error } = await supabase.from("applications").insert([
      {
        need_id: needId,
        proposal,
        bid,
        provider_id: userData.user.id,
      },
    ]);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Application submitted successfully!");
      setProposal("");
      setBid("");
      setAlreadyApplied(true);
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Checking application...</p>
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
            Apply to Need
          </h1>

          <p className="text-slate-600">
            Send a clear proposal and bid amount to increase your chances.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          {message && (
            <p className="mb-4 text-sm text-blue-600 bg-blue-50 border border-blue-200 p-3 rounded-lg">
              {message}
            </p>
          )}

          {!alreadyApplied && (
            <>
              <label className="block mb-2 font-medium text-slate-700">
                Your Proposal
              </label>

              <textarea
                placeholder="Example: I can build this website in 5 days with responsive design."
                className="w-full border p-3 mb-5 rounded-lg h-32"
                value={proposal}
                onChange={(e) => setProposal(e.target.value)}
              />

              <label className="block mb-2 font-medium text-slate-700">
                Your Bid Amount
              </label>

              <input
                type="text"
                placeholder="Example: ₹4000"
                className="w-full border p-3 mb-6 rounded-lg"
                value={bid}
                onChange={(e) => setBid(e.target.value)}
              />

              <button
                onClick={handleApply}
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            </>
          )}

          {alreadyApplied && (
            <a
              href="/my-applications"
              className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg"
            >
              View My Applications
            </a>
          )}
        </div>
      </section>
    </main>
  );
}