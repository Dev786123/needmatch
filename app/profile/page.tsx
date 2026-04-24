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
    setLoading(true);

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
      setLoading(false);
      return;
    }

    if (data) {
      setProfile(data);
      setName(data.name || "");
      setRole(data.role || "provider");
      setSkill(data.skill || "");
      setBio(data.bio || "");
      setCity(data.city || "");
      setPhone(data.phone || "");

      const isComplete = data.name && data.city && data.phone;
      setEditMode(!isComplete);
    } else {
      setProfile(null);
      setEditMode(true);
    }

    setLoading(false);
  };

  const saveProfile = async () => {
    setMessage("");

    if (!name || !city || !phone) {
      setMessage("Please fill name, city and phone");
      return;
    }

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      setMessage("User not found. Please login again.");
      return;
    }

    const finalRole = profile?.role || role;

    const profileData = {
      user_id: userData.user.id,
      name,
      role: finalRole,
      skill: finalRole === "provider" ? skill : "",
      bio,
      city,
      phone,
    };

    let error;

    if (profile?.id) {
      const result = await supabase
        .from("profiles")
        .update(profileData)
        .eq("id", profile.id);

      error = result.error;
    } else {
      const result = await supabase.from("profiles").insert([profileData]);
      error = result.error;
    }

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Profile saved successfully!");
    await loadProfile();
    setEditMode(false);
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
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="text-4xl font-black text-slate-950">My Profile</h1>
          <p className="mt-2 text-slate-600">
            Manage your public details. Your role is fixed from signup.
          </p>
        </div>

        <div className="rounded-3xl border bg-white p-8 shadow-sm">
          {message && (
            <p className="mb-5 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
              {message}
            </p>
          )}

          {!editMode && profile && (
            <>
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-950">
                    {profile.name || "No name added"}
                  </h2>
                  <p className="mt-1 capitalize text-slate-600">
                    {profile.role}
                  </p>
                </div>

                <button
                  onClick={() => setEditMode(true)}
                  className="rounded-xl bg-blue-600 px-5 py-2 font-bold text-white hover:bg-blue-700"
                >
                  Edit Profile
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Role</p>
                  <p className="mt-1 font-bold capitalize text-slate-950">
                    {profile.role}
                  </p>
                </div>

                {profile.role === "provider" && (
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Skill</p>
                    <p className="mt-1 font-bold text-slate-950">
                      {profile.skill || "Not added"}
                    </p>
                  </div>
                )}

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">City</p>
                  <p className="mt-1 font-bold text-slate-950">
                    {profile.city || "Not added"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Phone</p>
                  <p className="mt-1 font-bold text-slate-950">
                    {profile.phone || "Not added"}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Bio</p>
                <p className="mt-1 text-slate-800">
                  {profile.bio || "Not added"}
                </p>
              </div>
            </>
          )}

          {editMode && (
            <>
              <div className="mb-5 rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Role</p>
                <p className="mt-1 font-bold capitalize text-slate-950">
                  {role}
                </p>
              </div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Full Name"
                className="mb-4 w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              {role === "provider" && (
                <>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Skill
                  </label>
                  <input
                    type="text"
                    placeholder="Example: Web Developer"
                    className="mb-4 w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)}
                  />
                </>
              )}

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Bio
              </label>
              <textarea
                placeholder="Short bio"
                className="mb-4 h-28 w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                City
              </label>
              <input
                type="text"
                placeholder="City"
                className="mb-4 w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Phone
              </label>
              <input
                type="text"
                placeholder="Phone"
                className="mb-6 w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <div className="flex gap-3">
                <button
                  onClick={saveProfile}
                  className="flex-1 rounded-xl bg-green-600 py-3 font-bold text-white hover:bg-green-700"
                >
                  Save Profile
                </button>

                {profile && (
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setMessage("");
                    }}
                    className="rounded-xl border px-5 py-3 font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}