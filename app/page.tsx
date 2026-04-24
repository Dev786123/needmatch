export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          
          <div>
            <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              Need → Match → Hire
            </span>

            <h1 className="mt-6 text-5xl font-extrabold leading-tight text-slate-950">
              Post your need. Find the right talent faster.
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              NeedMatch helps clients post work requirements and connect with
              providers, freelancers, and service experts through a simple
              application and contact unlock flow.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              
              {/* ✅ Signup button */}
              <a
                href="/signup"
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Get Started
              </a>

              {/* 🔥 FIX: browse needs → login */}
              <a
                href="/login"
                className="rounded-xl border bg-white px-6 py-3 font-semibold text-slate-800 hover:bg-slate-100"
              >
                Login to Browse
              </a>

            </div>
          </div>

          {/* RIGHT CARD */}
          <div className="rounded-3xl border bg-white p-6 shadow-xl">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-semibold text-blue-600">
                Live workflow
              </p>

              <div className="mt-5 space-y-4">
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <h3 className="font-bold">Client posts a need</h3>
                  <p className="text-sm text-slate-600">
                    Website, design, marketing or any service requirement.
                  </p>
                </div>

                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <h3 className="font-bold">Providers apply</h3>
                  <p className="text-sm text-slate-600">
                    Proposals and bids are submitted directly.
                  </p>
                </div>

                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <h3 className="font-bold">Client unlocks contact</h3>
                  <p className="text-sm text-slate-600">
                    Credits create the monetization flow.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="border-y bg-white px-6 py-14">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">

          <div className="rounded-2xl border p-6">
            <h3 className="text-xl font-bold">For Clients</h3>
            <p className="mt-2 text-slate-600">
              Post requirements and review applicants from one dashboard.
            </p>
          </div>

          <div className="rounded-2xl border p-6">
            <h3 className="text-xl font-bold">For Providers</h3>
            <p className="mt-2 text-slate-600">
              Browse real needs and apply with proposals and bids.
            </p>
          </div>

          <div className="rounded-2xl border p-6">
            <h3 className="text-xl font-bold">Credit Unlock</h3>
            <p className="mt-2 text-slate-600">
              Unlock contact details using credits for monetization.
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}