export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Post Needs. Find Talent. Get Work Done.
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          NeedMatch helps clients post work requirements and connect with
          skilled providers, freelancers, and service experts.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <a
            href="/signup"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
          >
            Get Started
          </a>

          <a
            href="/needs"
            className="bg-white border px-6 py-3 rounded-lg font-medium"
          >
            Browse Needs
          </a>
        </div>
      </section>

      <section className="px-6 py-12 bg-white">
        <h2 className="text-3xl font-bold text-center mb-10">
          How NeedMatch Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="p-6 rounded-xl border bg-gray-50">
            <h3 className="text-xl font-bold mb-2">1. Post a Need</h3>
            <p className="text-gray-600">
              Clients describe what they need, their budget, and city.
            </p>
          </div>

          <div className="p-6 rounded-xl border bg-gray-50">
            <h3 className="text-xl font-bold mb-2">2. Providers Apply</h3>
            <p className="text-gray-600">
              Skilled providers submit proposals and bid amounts.
            </p>
          </div>

          <div className="p-6 rounded-xl border bg-gray-50">
            <h3 className="text-xl font-bold mb-2">3. Hire & Connect</h3>
            <p className="text-gray-600">
              Clients review applicants, accept them, and unlock contact.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">
          Built for Fast Hiring
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-bold mb-2">For Clients</h3>
            <p className="text-gray-600">
              Post work requirements and find suitable service providers without
              wasting time.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-bold mb-2">For Providers</h3>
            <p className="text-gray-600">
              Browse real needs, apply with proposals, and track your
              applications.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-bold mb-2">Credits System</h3>
            <p className="text-gray-600">
              Use credits to unlock contacts and create a simple monetization
              flow.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-bold mb-2">Profile Based Trust</h3>
            <p className="text-gray-600">
              Providers can add skills, bio, city, and phone details for better
              trust.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 bg-blue-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Start matching needs with talent today.
        </h2>

        <p className="mb-8 text-blue-100">
          Build your profile, post your requirement, or apply to available work.
        </p>

        <a
          href="/signup"
          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium"
        >
          Create Free Account
        </a>
      </section>
    </main>
  );
}