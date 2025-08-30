"use client";

import axios from "axios";
import { useState, useEffect } from "react";

type ChannelsListProps = {
    selectedChannel: Channel | null;
    setSelectedChannel: React.Dispatch<React.SetStateAction<Channel | null>>;
    refreshKey: number;
};

interface Channel {
    _id: string;
    name: string;
}

async function fetchChannels() {
    try {
        const res = await axios.get("http://localhost:4000/api/channels", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        const data = await res.data;
        console.log("Channels fetched:", data);
        return data.channels;
    } catch (err) {
        console.error("Fetching channels failed:", err);
        return;
    }
}


export default function ChannelsList({ selectedChannel,setSelectedChannel,refreshKey}: ChannelsListProps) {

    const [channels, setChannels] = useState<Channel[]>([]);

    useEffect(() => {
        async function loadChannels() {
            const data = await fetchChannels(); // aquí sí usas await
            if (data) setChannels(data);
        }
        loadChannels();
        console.log("Refresh key:", refreshKey);
    }, [refreshKey]);


  return (
    <div>
        <ul>
            {channels.map((channel, index) => (
                
                <li key={index} onClick={() => setSelectedChannel(channel)} className= {`h-full m-5 cursor-pointer bg-black/60 backdrop-blur-md rounded-xl border p-6 transition-all duration-300 hover:scale-102  ${selectedChannel === channel ? "border-blue-500" : "border-white/30"}`}>
                    <p className="text-center">{channel.name}</p>
                </li>
                
            ))}
        </ul>
    </div>
  )
}