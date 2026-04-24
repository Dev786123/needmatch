export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 px-6 py-20 text-white">
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl"></div>

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <div>
            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-blue-50">
              NeedMatch SaaS Platform
            </span>

            <h1 className="mt-6 text-5xl font-black leading-tight md:text-6xl">
              Post needs. Find providers. Get work done faster.
            </h1>

            <p className="mt-6 text-lg leading-8 text-blue-100">
              NeedMatch connects clients with skilled providers through a clean
              role-based workflow: post requirements, apply with proposals, and
              unlock contact details using credits.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/signup"
                className="rounded-xl bg-white px-7 py-3 font-bold text-blue-700 shadow-lg hover:bg-blue-50"
              >
                Get Started
              </a>

              <a
                href="/login"
                className="rounded-xl border border-white/30 px-7 py-3 font-bold text-white hover:bg-white/10"
              >
                Login
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur">
            <div className="rounded-2xl bg-white p-5 text-slate-900">
              <p className="text-sm font-semibold text-blue-600">
                Live Workflow
              </p>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border bg-slate-50 p-4">
                  <h3 className="font-black">1. Client posts a need</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Website, design, marketing, local work, or service request.
                  </p>
                </div>

                <div className="rounded-2xl border bg-slate-50 p-4">
                  <h3 className="font-black">2. Providers apply</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Providers send proposal and price.
                  </p>
                </div>

                <div className="rounded-2xl border bg-slate-50 p-4">
                  <h3 className="font-black">3. Client unlocks contact</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Credit-based unlock system for monetization.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-black text-slate-950">
            Built for two simple roles
          </h2>
          <p className="mt-3 text-slate-600">
            Client and provider flows stay separate, clean, and easy to use.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border bg-white p-8 shadow-sm">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
              🧑‍💼
            </div>

            <h3 className="text-2xl font-black text-slate-950">
              For Clients
            </h3>

            <p className="mt-3 text-slate-600">
              Post your need, review applications, accept or reject providers,
              and unlock contact details when ready.
            </p>

            <a
              href="/signup"
              className="mt-6 inline-block rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700"
            >
              Join as Client
            </a>
          </div>

          <div className="rounded-3xl border bg-white p-8 shadow-sm">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-3xl">
              🛠️
            </div>

            <h3 className="text-2xl font-black text-slate-950">
              For Providers
            </h3>

            <p className="mt-3 text-slate-600">
              Browse open needs, apply with proposal and price, then track your
              application status from your dashboard.
            </p>

            <a
              href="/signup"
              className="mt-6 inline-block rounded-xl bg-slate-900 px-5 py-3 font-bold text-white hover:bg-slate-800"
            >
              Join as Provider
            </a>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <h2 className="text-4xl font-black text-slate-950">
              Why NeedMatch works
            </h2>
            <p className="mt-3 text-slate-600">
              A focused SaaS workflow without extra confusion.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                title: "Role-based dashboard",
                desc: "Client and provider each get their own clean workspace.",
              },
              {
                title: "Application tracking",
                desc: "Providers can track pending, accepted, and rejected applications.",
              },
              {
                title: "Credit unlock system",
                desc: "Clients use credits to unlock provider contact details.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border bg-slate-50 p-6"
              >
                <h3 className="text-xl font-black text-slate-950">
                  {item.title}
                </h3>
                <p className="mt-3 text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-br from-slate-900 to-blue-900 p-10 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-black">
            Start your NeedMatch workspace today
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-blue-100">
            Create an account, choose your role, complete your profile, and
            start using the platform.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <a
              href="/signup"
              className="rounded-xl bg-white px-7 py-3 font-bold text-blue-700 hover:bg-blue-50"
            >
              Create Account
            </a>

            <a
              href="/login"
              className="rounded-xl border border-white/30 px-7 py-3 font-bold text-white hover:bg-white/10"
            >
              Login
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}