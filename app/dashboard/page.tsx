"use client";

import { useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function DashboardPage() {

  useEffect(() => {
  const checkUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      window.location.href = "/login";
    }
  };
  checkUser();
}, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">NeedMatch Dashboard</h1>
        <p className="text-gray-600 mb-8">
          Manage your needs and applications from one place.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a href="/post-need" className="bg-white p-6 rounded-xl shadow hover:shadow-md">
            <h2 className="text-xl font-bold mb-2">Post a Need</h2>
            <p className="text-gray-600">Create a new work requirement.</p>
          </a>

          <a href="/needs" className="bg-white p-6 rounded-xl shadow hover:shadow-md">
            <h2 className="text-xl font-bold mb-2">Browse Needs</h2>
            <p className="text-gray-600">Find available work opportunities.</p>
          </a>

          <a href="/my-needs" className="bg-white p-6 rounded-xl shadow hover:shadow-md">
            <h2 className="text-xl font-bold mb-2">My Needs</h2>
            <p className="text-gray-600">View your posted needs and applicants.</p>
          </a>

          <a href="/my-applications" className="bg-white p-6 rounded-xl shadow hover:shadow-md">
            <h2 className="text-xl font-bold mb-2">My Applications</h2>
            <p className="text-gray-600">Track the needs you applied to.</p>
          </a>
          <a href="/profile" className="bg-white p-6 rounded-xl shadow hover:shadow-md">
  <h2 className="text-xl font-bold mb-2">My Profile</h2>
  <p className="text-gray-600">Add your skills and contact details.</p>
</a>
          <a href="/credits" className="bg-white p-6 rounded-xl shadow hover:shadow-md">
  <h2 className="text-xl font-bold mb-2">Credits</h2>
  <p className="text-gray-600">Buy credits to unlock contacts.</p>
</a>
        </div>
      </div>
    </main>
  );
}