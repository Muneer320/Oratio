# Oratio API Documentation

## Your Questions - Answered

### ROOMS

**1. `room_code` vs `room_id`:**

- **`room_code`**: A 6-character code (e.g., "A3F21C") used by users to **join** rooms. User-facing.
- **`room_id`**: Internal database ID (integer) for **managing** rooms. Used in GET/UPDATE/DELETE.

**2. What is `status` in `/api/rooms/list`:**

- Optional query parameter to filter rooms by debate status
- Values: `"UPCOMING"`, `"ONGOING"`, `"COMPLETED"`
- Example: `/api/rooms/list?status=ONGOING`

---

### PARTICIPANTS

**1. Required JSON for `/api/participants/join`:**

```json
{
  "room_code": "A3F21C",
  "team": "Team A" // Optional, for team debates
}
```

**2. Where is `participant_id`:**

- Generated when you call `/api/participants/join`
- Returned in the response as `id` field
- Use it for: submitting turns, rewarding participants, leaving rooms

---

### SPECTATORS

**✅ FIXED - 500 Errors Resolved**

**Problem**: Schema mismatch - database returned `created_at` but schema expected `joined_at`

**Solution**: Updated `ParticipantResponse` schema to use `created_at` instead of `joined_at`

All spectator endpoints now work:

- POST `/api/spectators/join`
- POST `/api/spectators/{room_id}/reward`
- GET `/api/spectators/{room_id}/stats`
- DELETE `/api/spectators/{spectator_id}/leave`

---

### UPLOADS

**✅ FIXED - 500 Errors Resolved**

**Problem**: Same schema mismatch - `uploaded_at` vs `created_at`

**Solution**: Updated `UploadResponse` schema to use `created_at`

Files upload correctly now:

- POST `/api/uploads/pdf`
- POST `/api/uploads/audio`
- POST `/api/uploads/url`
- GET `/api/uploads/{room_id}`
- DELETE `/api/uploads/{file_id}`

---

## Authentication

### How It Works:

1. User registers or logs in
2. Backend returns JWT token
3. Frontend stores token in localStorage
4. Token sent in `Authorization: Bearer <token>` header for protected endpoints

### Protected Routes:

- All `/host`, `/join`, `/debate`, `/trainer` pages require authentication
- Unauthenticated users redirected to `/login`

### API Endpoints:

- POST `/api/auth/register` - Create account
- POST `/api/auth/login` - Get access token
- GET `/api/auth/me` - Get current user (requires auth)
- PUT `/api/auth/update` - Update profile (requires auth)
- DELETE `/api/auth/logout` - Logout

---

## Complete API Endpoints

### Utilities

- GET `/api/utils/health` - Health check
- GET `/api/utils/config` - Get configuration
- POST `/api/utils/feedback` - Submit feedback
- GET `/api/utils/leaderboard?limit=10` - Get leaderboard
- GET `/api/utils/search-topics?query=AI&limit=10` - Search topics

### Rooms

- POST `/api/rooms/create` - Create room (auth)
- GET `/api/rooms/list?status=ONGOING` - List public rooms
- GET `/api/rooms/{room_id}` - Get room details
- PUT `/api/rooms/{room_id}/update` - Update room (host only, auth)
- DELETE `/api/rooms/{room_id}` - Delete room (host only, auth)

### Participants

- POST `/api/participants/join` - Join as participant (auth)
- GET `/api/participants/{participant_id}` - Get participant
- PUT `/api/participants/{participant_id}/ready` - Mark ready (auth)
- DELETE `/api/participants/{participant_id}/leave` - Leave room (auth)

### Debate

- POST `/api/debate/{room_id}/submit-turn` - Submit argument (auth)
- POST `/api/debate/{room_id}/submit-audio` - Submit audio (auth)
- GET `/api/debate/{room_id}/transcript` - Get transcript
- POST `/api/debate/{room_id}/end` - End debate (auth)
- GET `/api/debate/{room_id}/status` - Get status

### AI Features

- POST `/api/ai/analyze-turn` - Analyze turn (auth)
- POST `/api/ai/fact-check` - Fact check statement (auth)
- POST `/api/ai/final-score` - Calculate final scores (auth)
- GET `/api/ai/summary/{room_id}` - Get summary
- GET `/api/ai/report/{room_id}` - Get report

### AI Trainer

- POST `/api/trainer/analyze` - Analyze performance (auth)
- GET `/api/trainer/recommendations/{user_id}` - Get recommendations (auth)
- POST `/api/trainer/challenge/start` - Start challenge (auth)
- POST `/api/trainer/challenge/submit` - Submit challenge (auth)
- GET `/api/trainer/progress/{user_id}` - Get progress (auth)

---

## Architecture Overview

### Multi-Tier Fallback System

**Database Tier:**

- **Tier 1**: Replit DB (persistent, on Replit platform)
- **Tier 2**: In-Memory Dict (non-persistent, local development)

**AI Provider Tier:**

- **Tier 1**: Gemini AI (gemini-2.5-pro) - Best quality, requires `GEMINI_API_KEY`
- **Tier 2**: Replit AI (chat-bison) - Good quality, auto-available on Replit
- **Tier 3**: Static Responses - Demo mode for testing without API keys

**Authentication:**

- **Replit Auth** - Auto-detected on Replit platform
- **Simple JWT** - Fallback for local development

---

## Features Status

✅ **Core Features - Complete:**

- Multi-tier database fallback (Replit DB → In-Memory)
- Multi-tier AI provider fallback (Gemini → Replit AI → Static)
- All 9 router modules implemented
- All 3 WebSocket handlers implemented
- Authentication & authorization
- File upload handling
- Real-time debate updates

✅ **API Endpoints - All Working:**

- Authentication (register, login, profile)
- Room management (create, list, update, delete)
- Participant flow (join, ready, leave)
- Debate flow (submit turns, get transcript, end debate)
- AI judging & analysis
- AI trainer & gamification
- Spectator interactions
- File uploads (PDF, audio, URL)
- Utility endpoints

✅ **Fixed Issues:**

- Spectator endpoints (schema mismatch resolved)
- Upload endpoints (schema mismatch resolved)
- Authentication flow stabilized
- Protected routes configured

� **Ready for:**

- Production deployment on Replit
- Local development
- Docker containerized deployment
- Frontend integration
