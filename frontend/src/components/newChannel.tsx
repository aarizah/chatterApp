"use client";
import axios from "axios";
import { useState } from "react";

type Props = { refreshChannels: () => void };

export default function CreateChannel({refreshChannels}: Props) {


  const [form, setForm] = useState({ name: "", topic: "",description:""});

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try{
      const res= await axios.post("http://localhost:4000/api/channels", {
      name: form.name,
      topic: form.topic,
      description: form.description
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    const data= await res.data;
    console.log("Channel created:", data);
    setForm({ name: "", topic: "", description: "" });
    refreshChannels();

    }

    catch(err){
      console.error("Channel creation failed:", err);
      alert("Channel creation failed");
      return;
    }
    
  }

  return (
    <div className="p-5">
    <form onSubmit={handleSubmit} className=" space-y-6 max-w-md mx-auto">
      <input
        type="text"
        name="name"
        placeholder="Channel Name"
        value={form.name}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="topic"
        placeholder="Channel Topic"
        value={form.topic}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="description"
        placeholder="Channel Description"
        value={form.description}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <div className="flex justify-between items-center">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded "
          >
          Create Channel
        </button>

      </div>
    </form>
    </div>
    
  );

}
