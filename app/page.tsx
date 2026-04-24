export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">NeedMatch 🚀</h1>

      <p className="text-lg text-gray-600 mb-6">
        Post your needs. Find the right people.
      </p>

      <div className="flex gap-4">
  <a
    href="/login"
    className="bg-blue-600 text-white px-6 py-2 rounded-lg"
  >
    Get Started
  </a>

  <a href="/needs" className="border px-6 py-2 rounded-lg">
  Browse Needs
</a>
</div>
    </main>
  );
}