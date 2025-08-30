"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import SendMessages from "./sendMessages";
import type { Channel } from "./types";
import type { Message } from "./types";


type Props = {
    selectedChannel: Channel | null;
};


export default function MessagesList({ selectedChannel}: Props) {

    const [messages, setMessages] = useState<Message[]>([]);

    const [isMember, setIsMember] = useState<boolean>(true);

    const [refreshNewMessages, setRefreshNewMessages] = useState(0);

     function refreshMessages() {
        setRefreshNewMessages(oldKey => oldKey + 1);
      }



    async function fetchMessages() {
        
        if (!selectedChannel) return [];
        try {
            console.log(`http://localhost:4000/api/channels/${selectedChannel._id}/messages`);
            const res = await axios.get(`http://localhost:4000/api/channels/${selectedChannel._id}/messages`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            const data = res.data;
            setIsMember(true);
            console.log("Messages fetched:", data);
            return data.messages;
        } catch (err) {
                if (typeof err === "object" && err !== null && "status" in err) {
                const status = err.status;

                if (status === 403) {
                    setIsMember(false);
                    return;
                }
                if (status === 401) {
                    alert("You are not authorized. Please log in again");
                    return;
                }
            }

            console.error(err);
        }

    }


useEffect(() => {
  async function loadMessages() {
    const data = await fetchMessages();

    if (data) {
      // evita re-render si es el mismo contenido
      setMessages(prev => {
        const prevStr = JSON.stringify(prev);
        const newStr = JSON.stringify(data);
        return prevStr === newStr ? prev : data;
      });
    }
  }

  loadMessages();

  const interval = setInterval(loadMessages, 5000);

  return () => clearInterval(interval);
}, [selectedChannel, refreshNewMessages]);


    



    async function handleJoinChannel() {
        setIsMember(true);
        // Aquí podrías agregar la lógica para unirte al canal, como hacer una solicitud a la API
        if (!selectedChannel) return;
        try {
            const res = await axios.post(`http://localhost:4000/api/channels/${selectedChannel._id}/join`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            const data = res.data;
            console.log("Joined channel:", data);
            // Después de unirte, intenta cargar los mensajes nuevamente
            const messages = await fetchMessages(); // aquí sí usas await
            if (messages) setMessages(messages);
        } catch (err) {
            console.error("Joining channel failed:", err);
            alert("Joining channel failed");
            return;
        }
    }

    
  return (
  <>
    {isMember ? (
      <div className="p-5 flex flex-col h-full min-h-0">
        {/* Zona scrolleable de mensajes */}
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide scroll-smooth pr-1">
          <ul className="flex flex-col space-y-4">
            {messages.map((messageObject, index) => {
              const isCurrentUser =
                localStorage.getItem("name") === messageObject.username;
              let name = isCurrentUser ? "You" : messageObject.username;

              return (
                <li
                  key={index}
                  className={`flex ${
                    isCurrentUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg text-sm shadow break-words
                      ${
                        isCurrentUser
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-gray-700 text-gray-100 rounded-bl-none"
                      }`}
                  >
                    {/* Cabecera: nombre + timestamp */}
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs opacity-75">
                        {name}
                      </span>

                      {(() => {
                        const ts = new Date(messageObject.timestamp);
                        const formatted = new Intl.DateTimeFormat("es-CO", {
                          dateStyle: "short",
                          timeStyle: "short",
                          timeZone: "America/Bogota",
                        }).format(ts);

                        return (
                          <time
                            className="text-[10px] opacity-60 ml-auto"
                            dateTime={ts.toISOString()}
                            title={formatted}
                          >
                            {formatted}
                          </time>
                        );
                      })()}
                    </div>

                    {/* Contenido del mensaje */}
                    <p className="mt-1">{messageObject.content}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Caja de envío fija (no scrollea) */}
        <div className="shrink-0 pt-3 border-t border-white/10">
          {selectedChannel ? (
            <SendMessages
              selectedChannel={selectedChannel}
              refreshMessages={refreshMessages}
            />
          ) : null}
        </div>
      </div>
    ) : (
      <div className="p-5">
        <p>
          You are not a member of this channel. Please join the channel to view
          messages.
        </p>
        <button
          onClick={handleJoinChannel}
          className="mt-5 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Join Channel
        </button>
      </div>
    )}
  </>
);

}