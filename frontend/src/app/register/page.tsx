"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function FormRegister() {
  const [form, setForm] = useState({ name:"", email: "", password: ""});
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await axios.post("http://localhost:4000/api/auth/register", form);
    const data = await res.data;

    if (res.status !== 201) {
      alert(data.message || "Something went wrong");
      return;
    }

    alert("Registration successful! Please log in.");
    router.push("/");

  }

  return (
    <div className="flex items-center justify-center min-h-screen">
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
        <input
        type="text"
        name="name"
        placeholder="Your name"
        value={form.name}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        />
      <input
        type="email"
        name="email"
        placeholder="Your email"
        value={form.email}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="password"
        name="password"
        placeholder="Your Password"
        value={form.password}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
    <div className="flex justify-between items-center">
        <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded "
        >
        Register
        </button>

              <Link 
          href="/" 
          className="text-blue-600 hover:underline"
        >
        Already have an account?
        </Link>
      </div>
    </form>
    </div>
  );
}
