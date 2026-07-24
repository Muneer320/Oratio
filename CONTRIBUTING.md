# Contributing to Oratio

Oratio is a debate room prototype. Please open an issue before a large change and describe how it affects rooms, judging, and persistence.

## Local checks

- Use Python 3.11+ and Node.js 22+.
- Install backend dependencies from `backend/requirements.txt` and frontend dependencies with `npm ci` in `frontend`.
- Run `python -m unittest discover -s tests -v` from `backend`.
- Run `npm run build` and `npm audit` from `frontend`.

See the [README](README.md) for setup, current behavior, and storage limits. Do not commit API keys or user data.
