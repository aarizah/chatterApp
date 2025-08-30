"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function FormRegister() {
  const [form, setForm] = useState({ name:"", email: "", password: ""});
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("http://localhost:4000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
    console.log(res);
    const data = await res.json();
    console.log(data);


  }
   const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 shadow-sm " +
    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 " +
    "disabled:cursor-not-allowed disabled:bg-gray-100 " +
    "dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 dark:placeholder:text-gray-500";


 return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white/90 dark:bg-slate-900/80 backdrop-blur shadow-xl border border-slate-200 dark:border-slate-800 p-6 md:p-8"
      >
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Start your journey in a few seconds.
          </p>
        </div>

        {/* Campos */}
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Your name"
              autoComplete="name"
              required
              value={form.name}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              value={form.email}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              autoComplete="new-password"
              minLength={8}
              required
              value={form.password}
              onChange={handleChange}
              className={inputClass}
            />
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Any password.</p>
          </div>
        </div>

        {/* CTA */}
        <button
          type="submit"
          className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-white font-medium shadow hover:bg-blue-700 active:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:hover:bg-blue-600"
        >
          Register
        </button>

        {/* Footer */}
        <div className="mt-6 text-center text-sm">
          <span className="text-slate-600 dark:text-slate-400">Already have an account? </span>
          <Link href="/login" className="font-medium text-blue-600 hover:underline">
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
}
