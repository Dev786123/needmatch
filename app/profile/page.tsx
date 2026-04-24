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

    if (error) {
      setMessage(error.message);
    }

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
      setMessage("Please login first");
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
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Loading profile...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">My Profile</h1>

        {message && (
          <p className="mb-4 text-center text-sm text-blue-600">{message}</p>
        )}

        <input
          type="text"
          placeholder="Full Name"
          className="w-full border p-2 mb-4 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          className="w-full border p-2 mb-4 rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="client">Client</option>
          <option value="provider">Provider</option>
        </select>

        {role === "provider" && (
          <input
            type="text"
            placeholder="Skill e.g. Web Developer"
            className="w-full border p-2 mb-4 rounded"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
          />
        )}

        <textarea
          placeholder="Short Bio"
          className="w-full border p-2 mb-4 rounded h-24"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <input
          type="text"
          placeholder="City"
          className="w-full border p-2 mb-4 rounded"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <input
          type="text"
          placeholder="WhatsApp / Phone"
          className="w-full border p-2 mb-4 rounded"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button
          onClick={saveProfile}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Save Profile
        </button>
      </div>
    </main>
  );
}