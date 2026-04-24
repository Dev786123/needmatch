"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);

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

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userData.user.id)
      .maybeSingle();

    if (data) {
      setProfile(data);

      setName(data.name || "");
      setRole(data.role || "provider");
      setSkill(data.skill || "");
      setBio(data.bio || "");
      setCity(data.city || "");
      setPhone(data.phone || "");

      setEditMode(false); // show view mode
    } else {
      setEditMode(true); // first time → open form
    }

    setLoading(false);
  };

  const saveProfile = async () => {
    if (!name || !city || !phone) {
      setMessage("Please fill required fields");
      return;
    }

const { data: userData } = await supabase.auth.getUser();

if (!userData?.user) {
  setMessage("User not found. Please login again.");
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
      setMessage("Profile saved!");
      loadProfile(); // reload and switch to view mode
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 flex justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow w-full max-w-md">

        <h1 className="text-2xl font-bold mb-6 text-center">
          My Profile
        </h1>

        {message && (
          <p className="mb-4 text-sm text-blue-600 text-center">
            {message}
          </p>
        )}

        {/* 🔥 VIEW MODE */}
        {!editMode && profile && (
          <>
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Role:</strong> {profile.role}</p>

            {profile.role === "provider" && (
              <p><strong>Skill:</strong> {profile.skill}</p>
            )}

            <p><strong>Bio:</strong> {profile.bio}</p>
            <p><strong>City:</strong> {profile.city}</p>
            <p><strong>Phone:</strong> {profile.phone}</p>

            <button
              onClick={() => setEditMode(true)}
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded"
            >
              Edit Profile
            </button>
          </>
        )}

        {/* 🔥 EDIT MODE */}
        {editMode && (
          <>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border p-2 mb-3 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <select
              className="w-full border p-2 mb-3 rounded"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="client">Client</option>
              <option value="provider">Provider</option>
            </select>

            {role === "provider" && (
              <input
                type="text"
                placeholder="Skill"
                className="w-full border p-2 mb-3 rounded"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
              />
            )}

            <textarea
              placeholder="Bio"
              className="w-full border p-2 mb-3 rounded"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />

            <input
              type="text"
              placeholder="City"
              className="w-full border p-2 mb-3 rounded"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />

            <input
              type="text"
              placeholder="Phone"
              className="w-full border p-2 mb-4 rounded"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <button
              onClick={saveProfile}
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              Save Profile
            </button>
          </>
        )}
      </div>
    </main>
  );
}