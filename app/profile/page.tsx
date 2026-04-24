"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("provider");
  const [skill, setSkill] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      window.location.href = "/login";
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userData.user.id)
      .maybeSingle();

    if (error) setMessage(error.message);

    if (data) {
      setName(data.name || "");
      setRole(data.role || "provider");
      setSkill(data.skill || "");
      setBio(data.bio || "");
      setCity(data.city || "");
      setPhone(data.phone || "");
    }

    setLoading(false);
  };

  const saveProfile = async () => {
    if (!name || !city || !phone) {
      setMessage("Please fill name, city and phone");
      return;
    }

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      window.location.href = "/login";
      return;
    }

    const { error } = await supabase.from("profiles").upsert([
      {
        user_id: userData.user.id,
        name,
        role,
        skill: role === "provider" ? skill : "",
        bio,
        city,
        phone,
      },
    ]);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Profile saved successfully!");
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Loading profile...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-white border-b px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            My Profile
          </h1>
          <p className="text-slate-600">
            Update your details to build trust and get more responses.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm border p-6">

          {message && (
            <p className="mb-4 text-sm text-blue-600 bg-blue-50 border border-blue-200 p-3 rounded-lg">
              {message}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Full Name"
              className="border p-3 rounded-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <select
              className="border p-3 rounded-lg"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="client">Client</option>
              <option value="provider">Provider</option>
            </select>
          </div>

          {role === "provider" && (
            <input
              type="text"
              placeholder="Skill (e.g. Web Developer)"
              className="w-full border p-3 rounded-lg mb-4"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
            />
          )}

          <textarea
            placeholder="Short Bio"
            className="w-full border p-3 rounded-lg h-28 mb-4"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input
              type="text"
              placeholder="City"
              className="border p-3 rounded-lg"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />

            <input
              type="text"
              placeholder="WhatsApp / Phone"
              className="border p-3 rounded-lg"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <button
            onClick={saveProfile}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Save Profile
          </button>
        </div>
      </section>
    </main>
  );
}