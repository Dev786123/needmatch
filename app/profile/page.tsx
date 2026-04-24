"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("provider");
  const [skill, setSkill] = useState("");
  const [bio, setBio] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");

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
      .single();

    if (data) {
      setName(data.name || "");
      setRole(data.role || "provider");
      setSkill(data.skill || "");
      setBio(data.bio || "");
      setCompanyName(data.company_name || "");
      setBusinessType(data.business_type || "");
      setCity(data.city || "");
      setPhone(data.phone || "");
    }
  };
  if (!name || !city || !phone) {
  console.log("Please fill name, city and phone");
  return;
}

  const saveProfile = async () => {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      console.log("Please login first");
      window.location.href = "/login";
      return;
    }

    const { error } = await supabase.from("profiles").upsert([
      {
        user_id: userData.user.id,
        name,
        role,
        skill: role === "provider" ? skill : "",
        bio: role === "provider" ? bio : "",
        company_name: role === "client" ? companyName : "",
        business_type: role === "client" ? businessType : "",
        city,
        phone,
      },
    ]);

    if (error) {
      console.log(error.message);
    } else {
      console.log("Profile saved successfully!");
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">My Profile</h1>

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
          <>
            <input
              type="text"
              placeholder="Skill e.g. Web Developer"
              className="w-full border p-2 mb-4 rounded"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
            />

            <textarea
              placeholder="Short Bio"
              className="w-full border p-2 mb-4 rounded h-24"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </>
        )}

        {role === "client" && (
          <>
            <input
              type="text"
              placeholder="Company Name"
              className="w-full border p-2 mb-4 rounded"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Business Type"
              className="w-full border p-2 mb-4 rounded"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
            />
          </>
        )}

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