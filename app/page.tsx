"use client";

import { supabase } from "../lib/supabase";

export default function Home() {
  const handleBrowse = async () => {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      window.location.href = "/login";
    } else {
      window.location.href = "/needs";
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="absolute left-[-120px] top-[-120px] h-72 w-72 rounded-full bg-blue-200 blur-3xl opacity-50" />
        <div className="absolute bottom-[-120px] right-[-120px] h-72 w-72 rounded-full bg-indigo-300 blur-3xl opacity-40" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 md:grid-cols-2">
          <div>
            <span className="inline-flex rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-blue-700 shadow-sm">
              Need → Match → Hire faster
            </span>

            <h1 className="mt-6 text-5xl font-black leading-tight tracking-tight text-slate-950 md:text-7xl">
              Hire the right talent without wasting time.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              NeedMatch connects clients with skilled providers through work
              posts, proposals, applications, and credit-based contact unlocks.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/signup"
                className="rounded-2xl bg-blue-600 px-7 py-4 font-bold text-white shadow-xl shadow-blue-200 hover:bg-blue-700"
              >
                Get Started Free
              </a>

              <button
                onClick={handleBrowse}
                className="rounded-2xl border border-slate-300 bg-white px-7 py-4 font-bold text-slate-900 hover:bg-slate-100"
              >
                Browse Needs
              </button>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
              <div>
                <h3 className="text-3xl font-black text-slate-950">2</h3>
                <p className="text-sm text-slate-500">User roles</p>
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-950">1</h3>
                <p className="text-sm text-slate-500">Simple workflow</p>
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-950">Fast</h3>
                <p className="text-sm text-slate-500">Contact unlock</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border bg-white/80 p-5 shadow-2xl backdrop-blur">
            <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
              <div className="mb-5 flex items-center justify-between">
                <p className="font-bold">NeedMatch workflow</p>
                <span className="rounded-full bg-green-400/20 px-3 py-1 text-xs font-bold text-green-300">
                  Live
                </span>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl bg-white p-4 text-slate-900">
                  <p className="text-sm font-bold text-blue-600">Step 01</p>
                  <h3 className="mt-1 text-xl font-black">Client posts need</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Budget, city and requirement details are added.
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-4 text-slate-900">
                  <p className="text-sm font-bold text-blue-600">Step 02</p>
                  <h3 className="mt-1 text-xl font-black">Provider applies</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Proposal and bid are submitted directly.
                  </p>
                </div>

                <div className="rounded-2xl bg-blue-600 p-4 text-white">
                  <p className="text-sm font-bold text-blue-100">Step 03</p>
                  <h3 className="mt-1 text-xl font-black">Contact unlocked</h3>
                  <p className="mt-1 text-sm text-blue-100">
                    Client spends credits to unlock provider contact.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-white px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-sm font-bold text-blue-600">
            BUILT FOR TWO-SIDED MARKETPLACE FLOW
          </p>

          <h2 className="mx-auto mt-3 max-w-3xl text-center text-4xl font-black text-slate-950">
            Everything needed to move from requirement to connection.
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border bg-slate-50 p-8">
              <div className="mb-5 text-4xl">🧑‍💼</div>
              <h3 className="text-2xl font-black">For Clients</h3>
              <p className="mt-3 leading-7 text-slate-600">
                Post requirements, review applicants, accept or reject proposals,
                and unlock verified contact details.
              </p>
            </div>

            <div className="rounded-3xl border bg-slate-50 p-8">
              <div className="mb-5 text-4xl">🛠️</div>
              <h3 className="text-2xl font-black">For Providers</h3>
              <p className="mt-3 leading-7 text-slate-600">
                Browse real work needs, apply with proposals, submit bids, and
                track application status.
              </p>
            </div>

            <div className="rounded-3xl border bg-slate-50 p-8">
              <div className="mb-5 text-4xl">💳</div>
              <h3 className="text-2xl font-black">Credit Unlock</h3>
              <p className="mt-3 leading-7 text-slate-600">
                A simple monetization system where clients use credits to unlock
                provider contact information.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <div>
            <h2 className="text-4xl font-black">
              Ready to match needs with talent?
            </h2>
            <p className="mt-3 text-slate-300">
              Create your account and choose your role to get started.
            </p>
          </div>

          <a
            href="/signup"
            className="rounded-2xl bg-white px-7 py-4 font-bold text-slate-950 hover:bg-blue-50"
          >
            Create Free Account
          </a>
        </div>
      </section>
    </main>
  );
}