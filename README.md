# Mini Social Media App

A full-stack mini social media application with user profiles, posts, comments, likes, and follow system.

**Stack:** React (frontend) + Express.js + MongoDB (backend)

---

## Project Structure

```
social-media-app/
├── backend/      ← Express + MongoDB API (runs on port 5001)
└── frontend/     ← React + Vite (runs on port 5174)
```

**Note:** These ports are different from the E-commerce project (which uses 5000/5173), so both projects can run at the same time without conflicts.

---

## 1. Backend Setup

```bash
cd backend
npm install
```

`.env` is already configured to use your **local MongoDB** (same one installed for the e-commerce project):

```
PORT=5001
MONGO_URI=mongodb://localhost:27017/social-media-app
JWT_SECRET=socialmediasecretkey12345
```

Make sure your local MongoDB service is running (it usually runs automatically in the background after installation).

### Seed sample data (recommended)

```bash
npm run seed
```

This creates 2 sample users (Alice and Bob) who already follow each other, with sample posts and a comment.

Sample login credentials:
- `alice@example.com` / `password123`
- `bob@example.com` / `password123`

### Run the backend

```bash
npm run dev
```

Backend runs at `http://localhost:5001`. Test it: open `http://localhost:5001/api/health`.

---

## 2. Frontend Setup

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5174`.

---

## Features Implemented

- **User registration/login** — JWT-based auth, password hashing with bcrypt
- **User profiles** — name, username, bio, profile picture, editable bio
- **Posts** — create, view feed (from people you follow), explore (all posts)
- **Comments** — add and view comments on any post
- **Like system** — like/unlike posts
- **Follow/unfollow system** — follow other users, see follower/following counts
- **Database** — MongoDB with Mongoose models: `User`, `Post`, `Comment`

## API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/users/:username` | Get a user's public profile + posts |
| PUT | `/api/users/profile` | Update own bio/profile picture |
| POST | `/api/users/:id/follow` | Follow a user |
| POST | `/api/users/:id/unfollow` | Unfollow a user |
| GET | `/api/users?search=` | Search users |
| GET | `/api/posts/feed` | Posts from people you follow (+ your own) |
| GET | `/api/posts` | All posts (explore) |
| POST | `/api/posts` | Create a post |
| DELETE | `/api/posts/:id` | Delete own post |
| POST | `/api/posts/:id/like` | Like a post |
| POST | `/api/posts/:id/unlike` | Unlike a post |
| GET | `/api/comments/post/:postId` | Get comments for a post |
| POST | `/api/comments/post/:postId` | Add a comment |

## Troubleshooting

- **"Could not load feed"** → backend isn't running, or local MongoDB service isn't running.
- **Port already in use** → make sure nothing else is using ports 5001 or 5174.
- Built as part of the **CodeAlpha Full Stack Development Internship**.
