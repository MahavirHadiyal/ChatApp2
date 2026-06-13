import jwt from "jsonwebtoken";
import cookie from "cookie";
import prisma from "../lib/prisma.js";

export const socketAuthMiddleware = async (socket, next) => {
  try {
    const cookies = socket.handshake.headers.cookie;

    if (!cookies) {
      return next(new Error("No Cookies Found"));
    }

    const parsed = cookie.parse(cookies);

    const token = parsed.jwt;

    if (!token) {
      return next(new Error("No Token Provided"));
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    if (!user) {
      return next(new Error("No user found"));
    }

    socket.userId = user.id; // keep as NUMBER (Prisma Int)
    socket.user = user;

    next();

  } catch (error) {
    console.error("socket auth error", error);
    next(new Error("Authentication failed"));
  }
};