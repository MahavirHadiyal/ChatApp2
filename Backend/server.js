import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";

import router from "./routes/authRoutes.js";
import conRouter from "./routes/conversationsRoutes.js";
import messRoute from "./routes/messageRoute.js";

import RedisService from "./services/RedisService.js";

import { Server } from "socket.io";
import { intializeSocket } from "./socket.js";
import { socketAuthMiddleware } from "./socket/socketAuthMiddlwware.js";

const app = express();
const httpServer = http.createServer(app);

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// Routes

app.use("/api/auth", router);
app.use("/api/conversations", conRouter);
app.use("/api/conversations", messRoute);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
    methods: ["GET", "POST"],
  },

  pingInterval: 25000,
  pingTimeout: 60000,
});

io.use(socketAuthMiddleware);

await intializeSocket(io);
await RedisService.intialize();

const port = process.env.PORT || 4000;

httpServer.listen(port, () => {
  console.log(`Running on port ${port}`);
});