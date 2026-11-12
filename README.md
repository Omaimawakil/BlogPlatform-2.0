# ThoughtsArchive

A full-stack blogging platform for sharing stories and ideas. Anyone can read, post and comment, **with or without an account**. Anonymous writers can still edit or delete their own posts and comments from the browser they wrote them in.

## Features

- **User accounts:** register and log in with JWT authentication (7-day sessions) and bcrypt-hashed passwords
- **Anonymous posting:** write stories and leave comments without logging in
- **Secure anonymous ownership:** anonymous posts and comments get a secret edit token. Only its SHA-256 hash is stored on the server, and the token itself is kept in the writer's browser
- **Create, edit and delete stories**, with comments removed automatically when a story is deleted
- **Comments** on every story, with delete permissions for the commenter, the story's author, and admins
- **Admin role:** the account matching `ADMIN_EMAIL` can moderate any post or comment
- **Search** stories by title, content or author name
- **Timestamps** showing when each story was published
- **Responsive design** with an editorial look (Playfair Display, DM Sans, Lora)

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router 7, Axios, Vite |
| Backend | Node.js, Express 5 |
| Database | MongoDB with Mongoose |
| Auth | JSON Web Tokens, bcryptjs |
| Hosting | Netlify (frontend), Render (backend) |

## Project Structure

```
.
├── backend/
│   ├── controllers/      # authController, postController, commentController
│   ├── middleware/       # auth.js, optionalAuth.js
│   ├── models/           # User, Post, Comment
│   ├── routes/           # authRoutes, postRoutes, commentRoutes
│   └── server.js
└── frontend/
    ├── public/           # favicon, _redirects (Netlify SPA fix)
    └── src/
        ├── components/   # SiteLayout
        ├── pages/        # Home, Login, Register, CreatePost, PostDetails, EditPost
        ├── services/     # api.js, editTokens.js, formatDate.js
        ├── App.jsx
        └── main.jsx
```

## Getting Started

### Prerequisites

- Node.js **20.19 or newer**
- A MongoDB database (local, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd <your-repo-folder>
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `backend/.env` file:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=a_long_random_secret_string
ADMIN_EMAIL=the_email_of_the_admin_account
```

Start the server (runs on port 5000):

```bash
npm start
# or, to auto-restart on changes:
npx nodemon server.js
```

### 3. Set up the frontend

In a second terminal:

```bash
cd frontend
npm install
```

Create a `frontend/.env.local` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the dev server:

```bash
npm run dev
```

Open http://localhost:5173.

## Environment Variables

| Variable | Where | Description |
|---|---|---|
| `MONGO_URI` | backend | MongoDB connection string |
| `JWT_SECRET` | backend | Secret used to sign login tokens |
| `ADMIN_EMAIL` | backend | Email of the account that gets admin rights (optional) |
| `VITE_API_URL` | frontend | Base URL of the API, e.g. `http://localhost:5000/api` |

> Never commit `.env` or `.env.local` files. They are listed in `.gitignore`.


## Live Demo
https://blogsbyomaima.netlify.app/

## Future Improvements

- Restrict CORS to the production frontend domain
- Add pagination for the story list
- Rate limiting on posting, comments and login
- Rich text or Markdown support in stories
- Show dates and times on comments


