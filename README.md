# Real-Time Chat Application

A full-stack real-time chat application built with PostgreSQL, Prisma, Redis, Docker, Node.js, Express.js, React, TypeScript, and Socket.IO. The application enables users to connect with friends, exchange messages instantly, view online status, and receive real-time updates.

---

## 🚀 Tech Stack

### Frontend

* React.js
* TypeScript
* Vite
* Tailwind CSS
* Zustand
* TanStack Query (React Query)
* Socket.IO Client
* Axios

### Backend

* Node.js
* Express.js
* Prisma ORM
* PostgreSQL
* Redis
* Socket.IO
* JWT Authentication
* Cookie-based Authentication

### DevOps

* Docker
* Docker Compose

---

## ✨ Features

### Authentication & Authorization

* User Registration
* User Login
* JWT-based Authentication
* Protected Routes
* Secure HTTP-only Cookies
* Persistent Sessions

### User Management

* Unique Username System
* Connect Code for Adding Friends
* User Profile Information
* Online/Offline Presence Tracking

### Friend System

* Add Friends Using Connect Code
* Friendship Validation
* Real-Time Friend Status Updates

### Real-Time Messaging

* One-to-One Private Conversations
* Instant Message Delivery
* Socket.IO Powered Communication
* Real-Time Typing Indicators
* Automatic Room Management

### Conversation Management

* Create Conversations Automatically
* Last Message Preview
* Unread Message Counters
* Mark Messages as Read
* Conversation Synchronization

### Message Features

* Real-Time Message Updates
* Message History Storage
* Infinite Scroll Pagination
* Read Status Tracking
* Message Timestamps

### Redis Integration

* User Presence Management
* Online Status Tracking
* Fast Real-Time State Updates
* Socket Session Handling

### Database Features

* PostgreSQL Relational Database
* Prisma ORM
* Optimized Relationships
* Structured Data Modeling

---

## 📂 Project Structure

```bash
chat-app/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── stores/
│   │   └── utils/
│   │
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── middlewares/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   │
│   ├── routes/
│   ├── socket/
│   ├── services/
│   ├── utils/
│   └── package.json
│
└── docker-compose.yml
```

---

## 🗄️ Database Schema

### User

Stores user account information.

### Friendship

Manages friend relationships between users.

### Conversation

Stores chat conversations.

### ConversationParticipant

Tracks conversation members.

### ConversationUnread

Stores unread message counts.

### Message

Stores chat messages.

### MessageRead

Tracks read status of messages.

---

## 🔌 Socket Events

### Connection Events

```javascript
connect
disconnect
```

### Conversation Events

```javascript
conversation:request
conversation:accept
conversation:join-room
conversation:new-message
conversation:send-message
conversation:mark-as-read
conversation:update-conversation
conversation:update-unread-counts
conversation:online-status
conversation:update-typing
```

---

## ⚙️ Environment Variables

### Backend (.env)

```env
PORT=4000

CLIENT_ORIGIN=http://localhost:5173

DATABASE_URL="postgresql://postgres:root@localhost:5432/CHATAPP?schema=public"

JWT_SECRET=your_jwt_secret

REDIS_URI=redis://localhost:6379
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:4000/api
```

---

## 🐳 Docker Setup

### Start Redis

```bash
docker compose up -d
```

Verify:

```bash
docker ps
```

Expected containers:

```bash
chat_redis
```

---

## 🛠️ Installation

### Clone Repository

```bash
git clone <repository-url>
cd chat-app
```

### Backend Setup

```bash
cd backend

npm install
```

### Generate Prisma Client

```bash
npx prisma generate
```

### Run Database Migration

```bash
npx prisma migrate dev
```

### Start Backend

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## Prisma Commands

### Create Migration

```bash
npx prisma migrate dev --name migration_name
```

### Generate Client

```bash
npx prisma generate
```

### Open Prisma Studio

```bash
npx prisma studio
```

### Reset Database

```bash
npx prisma migrate reset
```

---

## API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Conversations

```http
GET /api/conversations
GET /api/conversations/:conversationId/messages
```

---

## Security Features

* JWT Authentication
* HTTP-only Cookies
* Password Hashing
* Protected API Routes
* User Validation
* Friendship Validation
* Socket Authentication Middleware

---

## Future Enhancements

* Group Chats
* Media Sharing
* Voice Messages
* Message Reactions
* Push Notifications
* User Profiles
* Video Calling
* End-to-End Encryption

---

## Resume Highlights

* Built a production-ready real-time chat platform using React, TypeScript, Node.js, PostgreSQL, Prisma, Redis, and Socket.IO.
* Implemented JWT authentication, friend management, online presence tracking, unread message counters, and typing indicators.
* Designed a scalable relational database schema with Prisma ORM and PostgreSQL supporting conversations, friendships, messages, and read receipts.
* Integrated Redis for fast online-user tracking and Socket.IO for low-latency real-time communication.
* Containerized services using Docker and managed database operations with Prisma migrations and Studio.
