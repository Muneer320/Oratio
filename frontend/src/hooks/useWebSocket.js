import { useState, useEffect } from "react";
import wsService from "../services/websocket";

export function useWebSocket(endpoint) {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    wsService.connect(endpoint, (data) => {
      setMessages((prev) => [...prev, data]);
    });

    setIsConnected(true);

    return () => {
      wsService.disconnect();
      setIsConnected(false);
    };
  }, [endpoint]);

  const sendMessage = (data) => {
    wsService.send(data);
  };

  return { messages, isConnected, sendMessage };
}
