"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";


export default function Main() {
  const [form, setForm] = useState({ email: "", password: ""});
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log(form);
    try{
    const res = await axios.post("http://localhost:4000/api/auth/login", form);
    const data = await res.data;
    console.log(data);
    const token= data.token;
    const name= data.name;
    localStorage.setItem("token", token);
    localStorage.setItem("name", name);
    router.push("/");
    }
    catch(err){
      console.error("Login failed:", err);
      alert("Invalid email or password");
      return;
    }

  }

  return (
    <div className="flex items-center justify-center min-h-screen">
    <form onSubmit={handleSubmit} className=" space-y-6 max-w-md mx-auto">
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
          Log In
        </button>
        <Link 
          href="/register" 
          className="text-blue-600 hover:underline"
        >
          Don't have an account yet?
        </Link>

      </div>
    </form>
    </div>
    
  );
}

