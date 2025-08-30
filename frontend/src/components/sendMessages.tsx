import { useState } from "react";
import axios from "axios";
import type { Channel } from "./types";

type Props = {
    selectedChannel: Channel | null;
    refreshMessages: () => void;
};



export default function SendMessages({ selectedChannel, refreshMessages}: Props) {
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!message.trim()) return;
        
    try {
        if (!selectedChannel) {
            alert("Please select a channel first");
            return;
        }
        const res = await axios.post(`http://localhost:4000/api/channels/${selectedChannel._id}/messages`, {message}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        const data = res.data;
        console.log("Message sent:", data);
        setMessage("");
        refreshMessages();

    } catch (err) {
        console.error("Sending message failed:", err);
        alert("Sending message failed");
        return;
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 p-3"
    >
      <input
        type="text"
        value={message}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setMessage(e.target.value)
        }
        placeholder="Escribe un mensaje..."
        className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
      >
        Enviar
      </button>
    </form>
  );
}
