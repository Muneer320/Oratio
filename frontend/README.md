# 🎨 Oratio Frontend# Frontend (Vite + React)

**React 18 + Vite + TailwindCSS**This folder contains a minimal Vite + React skeleton for Oratio.

Modern, responsive UI for the Oratio AI-powered debate platform.How to run (Windows / PowerShell):

---1. Install Node.js (v18+ recommended) and npm

2. From the `frontend` folder:

## 🏗️ **Architecture**

npm install

Built with modern web technologies: npm run dev

- **React 18** - Latest React with concurrent featuresVite will start the dev server (default http://localhost:5173).

- **Vite** - Lightning-fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing
- **Web Speech API** - Built-in browser speech recognition
- **WebSockets** - Real-time debate updates

---

## 📁 **Project Structure**

```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── common/      # Buttons, inputs, cards, etc.
│   │   ├── debate/      # Debate-specific components
│   │   ├── layout/      # Headers, footers, sidebars
│   │   └── ...
│   ├── pages/           # Route-level page components
│   │   ├── Landing.jsx  # Home page
│   │   ├── Host.jsx     # Create debate room
│   │   ├── Join.jsx     # Join existing room
│   │   ├── Arena.jsx    # Active debate view
│   │   ├── Spectate.jsx # Watch debate as audience
│   │   ├── Results.jsx  # Post-debate results
│   │   └── Trainer.jsx  # AI training mode
│   ├── services/        # API and WebSocket clients
│   │   ├── api.js       # HTTP API client
│   │   └── websocket.js # WebSocket manager
│   ├── hooks/           # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useDebate.js
│   │   └── ...
│   ├── utils/           # Helper functions
│   │   ├── constants.js
│   │   ├── format.js
│   │   └── ...
│   ├── styles/          # Global styles
│   │   └── index.css    # Tailwind directives
│   ├── App.jsx          # Main app component
│   └── main.jsx         # React entry point
├── public/              # Static assets
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
├── package.json         # Dependencies
└── README.md           # This file
```

---

## 🚀 **Quick Start**

### Prerequisites

- **Node.js 18+**
- **npm** or **yarn**

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Access

- **Dev Server**: http://localhost:5173
- **Hot Reload**: ✅ Enabled (auto-refresh on file changes)

---

## 🛠️ **Available Scripts**

```bash
# Development (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

---

## 🎨 **Key Pages**

### Landing Page (`/`)

- **Purpose**: Home page with call-to-action
- **Features**: "Host Debate" / "Join Debate" / "Train with AI" buttons
- **Route**: `/`

### Host Dashboard (`/host`)

- **Purpose**: Create new debate room
- **Features**: Topic input, settings configuration, reference uploads
- **Route**: `/host`

### Join Page (`/join`)

- **Purpose**: Join existing debate via room code
- **Features**: 6-character code input, participant name entry
- **Route**: `/join`

### Debate Arena (`/arena/:roomId`)

- **Purpose**: Active debate interface
- **Features**: Split-screen participants, live scores, timer, submit arguments
- **Route**: `/arena/:roomId`

### Spectator View (`/spectate/:roomId`)

- **Purpose**: Watch debate as audience
- **Features**: View-only mode, send reward emojis, see live scores
- **Route**: `/spectate/:roomId`

### Results Page (`/results/:roomId`)

- **Purpose**: Post-debate analysis
- **Features**: Winner announcement, LCR breakdown, AI feedback, fact sources
- **Route**: `/results/:roomId`

### Trainer Page (`/trainer`)

- **Purpose**: AI-powered training exercises
- **Features**: Personalized training, XP tracking, badges, challenges
- **Route**: `/trainer`

---

## 🔌 **API Integration**

### HTTP API Client (`services/api.js`)

```javascript
// Example usage
import api from "./services/api";

// Create room
const room = await api.post("/api/rooms/create", {
  topic: "AI Ethics",
  duration: 10,
});

// Join room
const participant = await api.post("/api/participants/join", {
  room_code: "ABC123",
});
```

### WebSocket Manager (`services/websocket.js`)

```javascript
// Example usage
import WebSocketManager from "./services/websocket";

const ws = new WebSocketManager(`ws://localhost:8000/ws/debate/${roomId}`);

ws.connect();

ws.on("turn_submitted", (data) => {
  console.log("New turn:", data);
});

ws.send({ type: "submit_turn", content: "My argument..." });
```

---

## 🎨 **Styling with Tailwind**

### Example Component

```jsx
export default function DebateCard({ title, status }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <span
        className={`
        px-3 py-1 rounded-full text-sm font-medium
        ${
          status === "ongoing"
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-800"
        }
      `}
      >
        {status}
      </span>
    </div>
  );
}
```

### Tailwind Configuration

Customized in `tailwind.config.js`:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6", // Blue
        secondary: "#8B5CF6", // Purple
        success: "#10B981", // Green
        danger: "#EF4444", // Red
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in",
        "slide-up": "slideUp 0.3s ease-out",
      },
    },
  },
};
```

---

## 🎭 **Animations**

Using **Framer Motion** for smooth transitions:

```jsx
import { motion } from "framer-motion";

export default function ResultCard({ score }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="result-card"
    >
      <h2>Score: {score}</h2>
    </motion.div>
  );
}
```

---

## 🔊 **Web Speech API Integration**

### Voice Input Example

```jsx
import { useState, useEffect } from "react";

export default function VoiceInput({ onTranscript }) {
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      console.error("Speech recognition not supported");
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");

      onTranscript(transcript);
    };

    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => recognition.stop();
  }, [isListening]);

  return (
    <button onClick={() => setIsListening(!isListening)}>
      {isListening ? "🎤 Listening..." : "🎙️ Start Speaking"}
    </button>
  );
}
```

---

## 🧪 **Environment Variables**

Create `.env` file in frontend root:

```bash
# Backend API URL
VITE_API_URL=http://localhost:8000

# WebSocket URL
VITE_WS_URL=ws://localhost:8000

# Enable debug mode
VITE_DEBUG=true
```

**Note**: Vite requires `VITE_` prefix for environment variables.

---

## 📦 **Build for Production**

```bash
# Build optimized production bundle
npm run build

# Output directory: dist/
# - Minified JavaScript
# - Optimized CSS
# - Compressed assets
```

### Build Output

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [images/fonts...]
└── ...
```

---

## 🚀 **Deployment**

### Deploy to Replit

1. Push changes to GitHub
2. Import project to Replit
3. Replit auto-detects Vite configuration
4. Click ▶️ Run

### Deploy with Docker

Already configured in root `Dockerfile`:

```bash
# From project root
docker-compose up --build

# Frontend served at http://localhost
```

### Deploy to Vercel/Netlify

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel
```

---

## 🐛 **Common Issues**

### Module not found errors

**Solution**:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Port 5173 already in use

**Solution**:

```bash
# Change port in vite.config.js
export default {
  server: {
    port: 3000  // or any available port
  }
}
```

### CORS errors

**Solution**: Ensure backend CORS settings allow frontend origin:

```python
# backend/app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📚 **Resources**

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

---

## 🤝 **Contributing**

See [../CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines.

---

## 📧 **Contact**

- **Issues**: [GitHub Issues](https://github.com/muneer320/oratio/issues)
- **Email**: muneer.alam320@gmail.com

---

<div align="center">

**Built with ❤️ for better debates**

[⭐ Star on GitHub](https://github.com/muneer320/oratio)

</div>
