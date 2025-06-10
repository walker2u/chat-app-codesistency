import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";

function HomePage() {
  const { getUsers, getMessages, sendMessage } = useChatStore();
  useEffect(() => {
    getUsers();
    getMessages("684317b522f00d256732c356");
    sendMessage("684317b522f00d256732c356", "Hiii", "");
  }, []);
  return <div>HomePage</div>;
}

export default HomePage;
