import RedisService from "./services/RedisService.js";
import { getChatRoom, leaveAllRooms } from "./socket/helpers.js";
import {
  conversationRequest,
  conversationSendMessage,
  conversationTyping,
  notifyConversationOnlineStatus,
} from "./socket/socketConversation.js";

export const intializeSocket = async (io) => {
  io.on("connection", async (socket) => {
    try {
      const user = socket.user;

      console.log("User connected", user.id);

      socket.join(user.id.toString());

      await RedisService.addUserSession(user.id, socket.id);

      await notifyConversationOnlineStatus(io, socket, true);

      socket.on("conversation:request", (data) =>
        conversationRequest(io, socket, data)
      );

      socket.on("conversation:send-message", (data) =>
        conversationSendMessage(io, socket, data)
      );

      socket.on("conversation:typing", (data) =>
        conversationTyping(io, socket, data)
      );

      socket.on("conversation:join-room", ({ friendId }) => {
        const room = getChatRoom(socket.userId, friendId);
        socket.join(room);
      });

      socket.on("disconnect", async () => {
        await notifyConversationOnlineStatus(io, socket, false);

        await RedisService.removeAllUserSessions(user.id);

        const isOnline = await RedisService.isUserOnline(user.id);

        if (!isOnline) {
          leaveAllRooms(socket);
        }
      });
    } catch (error) {
      console.error("Socket error", error);
    }
  });
};