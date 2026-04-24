"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function NeedDetailPage() {
  const params = useParams();
  const needId = params.id as string;

  const [need, setNeed] = useState<any>(null);
  const [application, setApplication] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNeedDetail = async () => {
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

      const { data: needRows, error: needError } = await supabase
        .from("needs")
        .select("*")
        .eq("id", needId)
        .limit(1);

      if (needError) {
        setMessage(needError.message);
        setLoading(false);
        return;
      }

      const currentNeed = needRows && needRows.length > 0 ? needRows[0] : null;

      if (!currentNeed) {
        setMessage("Need not found.");
        setLoading(false);
        return;
      }

      setNeed(currentNeed);

      const { data: appRows, error: appError } = await supabase
        .from("applications")
        .select("*")
        .eq("need_id", needId)
        .eq("provider_id", userData.user.id)
        .limit(1);

      if (appError) {
        setMessage(appError.message);
        setLoading(false);
        return;
      }

      const currentApplication =
        appRows && appRows.length > 0 ? appRows[0] : null;

      setApplication(currentApplication);
      setLoading(false);
    };

    loadNeedDetail();
  }, [needId]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Loading need...</p>
      </main>
    );
  }

  const isOpen = need?.status === "open";
  const alreadyApplied = !!application;

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-white border-b px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <a
            href="/needs"
            className="font-semibold text-blue-600 hover:underline"
          >
            ← Back to Browse Needs
          </a>

          <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                  isOpen
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {need?.status || "closed"} Requirement
              </span>

              <h1 className="mt-4 text-4xl font-extrabold text-slate-950">
                {need?.title || "Need not found"}
              </h1>

              <p className="mt-3 text-slate-600">
                Review the requirement and submit your proposal if it matches
                your skills.
              </p>
            </div>

            {need && isOpen && !alreadyApplied && (
              <a
                href={`/apply/${need.id}`}
                className="rounded-xl bg-blue-600 px-6 py-3 text-center font-semibold text-white hover:bg-blue-700"
              >
                Apply Now
              </a>
            )}

            {need && alreadyApplied && (
              <a
                href="/my-applications"
                className="rounded-xl bg-slate-900 px-6 py-3 text-center font-semibold text-white hover:bg-slate-800"
              >
                View Application
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-10">
        {message && (
          <p className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
            {message}
          </p>
        )}

        {need && (
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-xs font-medium text-slate-500">Budget</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-950">
                  {need.budget || "Not mentioned"}
                </h2>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-xs font-medium text-slate-500">City</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-950">
                  {need.city || "Not mentioned"}
                </h2>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-xs font-medium text-slate-500">Status</p>
                <h2
                  className={`mt-1 text-2xl font-bold capitalize ${
                    isOpen ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {need.status || "closed"}
                </h2>
              </div>
            </div>

            {need.category && (
              <div className="mt-6 rounded-2xl border p-5">
                <p className="text-sm font-semibold text-slate-500">
                  Category
                </p>
                <p className="mt-1 text-slate-700">{need.category}</p>
              </div>
            )}

            {need.description && (
              <div className="mt-6 rounded-2xl border p-5">
                <p className="text-sm font-semibold text-slate-500">
                  Description
                </p>
                <p className="mt-1 text-slate-700">{need.description}</p>
              </div>
            )}

            <div className="mt-6 rounded-2xl border p-5">
              <p className="text-sm font-semibold text-slate-500">Posted At</p>
              <p className="mt-1 text-slate-700">
                {need.created_at
                  ? new Date(need.created_at).toLocaleString()
                  : "Not available"}
              </p>
            </div>

            {alreadyApplied && (
              <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-5">
                <p className="text-sm font-semibold text-blue-700">
                  Your Application Status
                </p>
                <p className="mt-1 font-bold capitalize text-blue-900">
                  {application.status || "pending"}
                </p>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              {isOpen && !alreadyApplied && (
                <a
                  href={`/apply/${need.id}`}
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  Apply Now
                </a>
              )}

              {alreadyApplied && (
                <a
                  href="/my-applications"
                  className="rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-800"
                >
                  View My Application
                </a>
              )}

              <a
                href="/needs"
                className="rounded-xl border bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-100"
              >
                Browse More Needs
              </a>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}