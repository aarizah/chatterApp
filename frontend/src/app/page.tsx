// DASHBOARD PAGE
"use client";

import CreateChannel from "@/components/newChannel";
import ChannelsList from "@/components/channelsList";
import { useState, useEffect } from "react";
import MessagesList from "@/components/messagesList";
import { useRouter } from "next/navigation";
import axios from "axios";
import type { Channel } from "@/components/types";


export default function Home() {
  const router = useRouter();
  useEffect(() => {
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await axios.get("http://localhost:4000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data;
      console.log("Usuario autenticado:", data);
      // Aquí puedes setear usuario en estado/contexto si lo necesitas

    } catch (error: any) {
      console.error("Error de autenticación:", error);
      // Si el backend devuelve 401 o la petición falla, redirige al login
      router.push("/login");
    }
  };

  checkAuth();
}, [router]);



  const [refreshKey, setRefreshKey] = useState(0); // To trigger refresh of channels list
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null); // To store the selected channel
  

  // Function to refresh channels list after creating a new channel
  function refreshChannels() {
    setRefreshKey(oldKey => oldKey + 1);
  }

  return (
    <>
      <div className="flex flex-row p-2 h-screen overflow-hidden">
        {/* Columna izquierda */}
        <div className="basis-2/5 p-2 min-h-0">
          <div className="h-full bg-white/5 backdrop-blur-md rounded-xl border border-white/3 p-6 flex flex-col min-h-0">
            {/* Cabecera fija */}
            <div className="shrink-0">
              
            </div>
            {/* Lista con scroll oculto */}
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide scroll-smooth">
              <h2 className="py-5 text-xl font-bold">Channels</h2>
              <p>Create a new channel</p>
              <CreateChannel refreshChannels={refreshChannels}/>  {/*Create channel: -> function to refresh the channel list*/}
              <p className="py-5">Take a Look: List of channels</p>
              <ChannelsList
                refreshKey={refreshKey}
                selectedChannel={selectedChannel}
                setSelectedChannel={setSelectedChannel}
              />
            </div>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="basis-3/5 p-2 min-h-0">
          <div className="h-full bg-white/5 backdrop-blur-md rounded-xl border border-white/3 p-6 flex flex-col min-h-0">
            {/* Cabecera fija */}
            <div className="shrink-0">
              <h2 className="text-xl font-bold">Messages</h2>
              <p>Component of messages</p>
            </div>
            {/* Lista con scroll oculto */}
            <div className="flex-1 min-h-0 ">
              <MessagesList selectedChannel={selectedChannel} /> {/* Messages's section: -> value selected channel */}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
