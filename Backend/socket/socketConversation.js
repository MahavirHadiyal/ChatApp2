import prisma from "../lib/prisma.js";
import RedisService from "../services/RedisService.js";
import { getChatRoom } from "./helpers.js";

export const notifyConversationOnlineStatus = async (io, socket, online) => {
  try {
    const userId = socket.userId;
    const user = socket.user;

    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { requesterId: Number(userId) },
          { recipientId: Number(userId) },
        ],
      },
      include: {
        requester: true,
        recipient: true,
      },
    });

    friendships.forEach((friendship) => {
      const friend =
        friendship.requesterId === Number(userId)
          ? friendship.recipient
          : friendship.requester;

      io.to(friend.id.toString()).emit("conversation:online-status", {
        friendId: userId,
        username: user.username,
        online,
      });
    });
  } catch (error) {
    console.error("notifyConversationOnlineStatus", error);
  }
};

export const conversationRequest = async (io, socket, data) => {
  try {
    const userId = socket.userId;
    const { connectCode } = data;

    const friend = await prisma.user.findUnique({
      where: { connectCode }
    });

    if (!friend || friend.id === userId) {
      return socket.emit("conversation:request:error", {
        error: "Invalid user"
      });
    }

    const existing = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: userId, recipientId: friend.id },
          { requesterId: friend.id, recipientId: userId }
        ]
      }
    });

    if (existing) {
      return socket.emit("conversation:request:error", {
        error: "Already exists"
      });
    }

    const friendship = await prisma.friendship.create({
      data: {
        requesterId: userId,
        recipientId: friend.id
      }
    });

    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          create: [
            { userId },
            { userId: friend.id }
          ]
        }
      }
    });

    io.to(userId.toString()).emit("conversation:accept", {
      conversationId: conversation.id,
      friend
    });

    io.to(friend.id.toString()).emit("conversation:accept", {
      conversationId: conversation.id,
      friend: socket.user
    });

  } catch (err) {
    console.error(err);
  }
};

export const conversationSendMessage = async (io, socket, data) => {
  try {
    const userId = socket.userId;
    const { conversationId, friendId, content } = data;

    const message = await prisma.message.create({
      data: {
        conversationId: Number(conversationId),
        senderId: userId,
        content,
      },
      include: {
        sender: true
      }
    });

    const room = getChatRoom(userId, friendId);

    io.to(room).emit("conversation:new-message", {
      conversationId,
      message: {
        _id: message.id,
        content: message.content,
        createdAt: message.createdAt,
        sender: {
          id: message.senderId,
          username: socket.user.username
        }
      }
    });

  } catch (err) {
    console.error(err);
  }
};

export const conversationTyping = (io, socket, data) => {
  const { friendId, isTyping } = data;

  socket.to(friendId.toString()).emit("conversation:update-typing", {
    userId: socket.userId.toString(),
    isTyping,
  });
};