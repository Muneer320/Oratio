const WS_BASE_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8000";

class WebSocketService {
  constructor() {
    this.ws = null;
  }

  connect(endpoint, onMessage) {
    this.ws = new WebSocket(`${WS_BASE_URL}${endpoint}`);

    this.ws.onopen = () => {
      console.log("WebSocket connected");
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.ws.onclose = () => {
      console.log("WebSocket disconnected");
    };
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

export default new WebSocketService();
