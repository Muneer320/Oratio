# API documentation

The live OpenAPI reference is at `/docs` on the backend. Start it with `uvicorn app.main:socket_app --reload` from `backend`.

| Area | Routes | Notes |
| --- | --- | --- |
| Authentication | `/api/auth/register`, `/login`, `/me`, `/update`, `/logout` | Bearer tokens expire after seven days. |
| Rooms | `/api/rooms/create`, `/list`, `/code/{code}`, `/{id}` | Create and update require a session. |
| Participants | `/api/participants/join`, `/{id}/ready`, `/{id}/leave` | Join before accessing debate data. |
| Spectators | `/api/spectators/join`, `/{room_id}/reward`, `/{room_id}/stats` | Rewards are broadcast to the room. |
| Debate | `/api/debate/{room_id}/submit-turn`, `/submit-audio`, `/audio/{turn_id}`, `/transcript`, `/status`, `/end` | Transcript, audio, and status require membership. End requires the host. |
| AI | `/api/ai/analyze-turn`, `/fact-check`, `/final-score`, `/summary/{room_id}`, `/report/{room_id}` | `final-score` reads the stored result; it does not change scores. |
| Trainer | `/api/trainer/*` | Prototype API; limited frontend integration. |
| Uploads | `/api/uploads/*` | Prototype resource uploads. |

Socket.IO is mounted at `/socket.io/`. Pass `{token: "<bearer token>"}` in the Socket.IO connection auth payload, then emit `join_room` with `{room_id: "<id>"}`. The server checks membership before joining. Events include `new_turn`, `round_scored`, `reward`, and `debate_ended`. `/ws/*` is not implemented.

A final result has `room_id`, `judged`, `winner_id`, `scores`, `feedback`, `summary`, and `spectator_influence`. When judging is incomplete, `judged` is false and `winner_id` is null.
