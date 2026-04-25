"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useParams } from "next/navigation";

export default function ApplyPage() {
  const params = useParams();
  const needId = params.id as string;

  const [need, setNeed] = useState<any>(null);
  const [proposal, setProposal] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    const checkUserRoleAndApplication = async () => {
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

      const profile =
        profileRows && profileRows.length > 0 ? profileRows[0] : null;

      if (profile?.role !== "provider") {
        window.location.href = "/dashboard";
        return;
      }

      const { data: needData, error: needError } = await supabase
        .from("needs")
        .select("*")
        .eq("id", needId)
        .limit(1);

      if (needError) {
        setMessage(needError.message);
        setLoading(false);
        return;
      }

      const currentNeed =
        needData && needData.length > 0 ? needData[0] : null;

      if (!currentNeed) {
        setMessage("Need not found.");
        setLoading(false);
        return;
      }

      if (currentNeed.status !== "open") {
        setMessage("This need is closed.");
        setLoading(false);
        return;
      }

      setNeed(currentNeed);

      const { data: existingRows } = await supabase
        .from("applications")
        .select("*")
        .eq("need_id", needId)
        .eq("provider_id", userData.user.id)
        .limit(1);

      const existingApplication =
        existingRows && existingRows.length > 0 ? existingRows[0] : null;

      if (existingApplication) {
        setAlreadyApplied(true);
        setMessage("You have already applied to this need.");
      }

      setLoading(false);
    };

    checkUserRoleAndApplication();
  }, [needId]);

  const handleApply = async () => {
    setMessage("");

    if (!proposal.trim() || !price.trim()) {
      setMessage("Please fill proposal and price");
      return;
    }

    setSubmitting(true);

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      window.location.href = "/login";
      return;
    }

    const { data: profileRows } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userData.user.id)
      .limit(1);

    const profile =
      profileRows && profileRows.length > 0 ? profileRows[0] : null;

    if (profile?.role !== "provider") {
      window.location.href = "/dashboard";
      return;
    }

    const { data: existingRows } = await supabase
      .from("applications")
      .select("id")
      .eq("need_id", needId)
      .eq("provider_id", userData.user.id)
      .limit(1);

    if (existingRows && existingRows.length > 0) {
      setAlreadyApplied(true);
      setMessage("You have already applied to this need.");
      setSubmitting(false);
      return;
    }

    const { data: insertedRows, error } = await supabase
      .from("applications")
      .insert([
        {
          need_id: needId,
          proposal,
          price,
          provider_id: userData.user.id,
          status: "pending",
          ai_score: null,
          ai_reason: "AI score not available",
        },
      ])
      .select("id")
      .limit(1);

    if (error) {
      setMessage(error.message);
      setSubmitting(false);
      return;
    }

    const applicationId =
      insertedRows && insertedRows.length > 0 ? insertedRows[0].id : null;

    try {
      if (applicationId) {
        const aiResponse = await fetch("/api/ai-match", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            needTitle: need?.title || "",
            needBudget: need?.budget || "",
            needCity: need?.city || "",
            providerSkill: profile?.skill || "",
            providerBio: profile?.bio || "",
            proposal,
            bid: price,
          }),
        });

        const aiData = await aiResponse.json();

        await supabase
          .from("applications")
          .update({
            ai_score: aiData?.ai_score ?? null,
            ai_reason: aiData?.ai_reason || "AI score not available",
          })
          .eq("id", applicationId);
      }
    } catch (aiError) {
      console.log("AI match failed:", aiError);
    }

    setMessage("Application submitted successfully!");
    setProposal("");
    setPrice("");
    setAlreadyApplied(true);
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
            Send a clear proposal and price amount to increase your chances.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-8">
        {need && (
          <div className="mb-6 bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-2xl font-bold text-slate-900">
              {need.title}
            </h2>

            <p className="mt-2 text-slate-600">{need.description}</p>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Category</p>
                <p className="font-bold text-slate-900">
                  {need.category || "Not mentioned"}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Budget</p>
                <p className="font-bold text-slate-900">
                  {need.budget || "Not mentioned"}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-500">City</p>
                <p className="font-bold text-slate-900">
                  {need.city || "Not mentioned"}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border p-6">
          {message && (
            <p className="mb-4 text-sm text-blue-600 bg-blue-50 border border-blue-200 p-3 rounded-lg">
              {message}
            </p>
          )}

          {!alreadyApplied && need && need.status === "open" && (
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
                Your Price
              </label>

              <input
                type="text"
                placeholder="Example: ₹4000"
                className="w-full border p-3 mb-6 rounded-lg"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />

              <button
                onClick={handleApply}
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
              >
                {submitting
                  ? "Submitting and generating AI score..."
                  : "Submit Application"}
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
