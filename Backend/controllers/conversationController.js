import prisma from "../lib/prisma.js";
import RedisService from "../services/RedisService.js";

class ConversationController {

  static async checkConnectcode(req, res) {
    try {
      const userId = req.user.id;
      const { connectCode } = req.query;

      const friend = await prisma.user.findUnique({
        where: {
          connectCode,
        },
      });

      if (!friend || friend.id === userId) {
        return res.status(400).json({
          message: "Invalid Connect Id",
        });
      }

      const existingFriendship =
        await prisma.friendship.findFirst({
          where: {
            OR: [
              {
                requesterId: userId,
                recipientId: friend.id,
              },
              {
                requesterId: friend.id,
                recipientId: userId,
              },
            ],
          },
        });

      if (existingFriendship) {
        return res.status(400).json({
          message: "Friendship Already Exists",
        });
      }

      return res.json({
        success: true,
        message: "Connect ID is valid",
      });

    } catch (error) {
      console.error(
        "Error checking connect code",
        error
      );

      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }

  static async getConversation(req, res) {
    try {
      const userId = req.user.id;

      const friendships =
        await prisma.friendship.findMany({
          where: {
            OR: [
              { requesterId: userId },
              { recipientId: userId },
            ],
          },
          include: {
            requester: true,
            recipient: true,
          },
        });

      if (!friendships.length) {
        return res.json({
          data: [],
        });
      }

      const conversationsData =
        await Promise.all(
          friendships.map(async (friendship) => {

            const friend =
              friendship.requesterId === userId
                ? friendship.recipient
                : friendship.requester;

            const conversation =
              await prisma.conversation.findFirst({
                where: {
                  participants: {
                    some: {
                      userId: friend.id,
                    },
                  },
                },
                include: {
                  unreadCounts: true,
                },
              });

            if (!conversation) {
              return null;
            }

            const unreadCounts = {};

            conversation.unreadCounts.forEach(
              (item) => {
                unreadCounts[item.userId] =
                  item.unreadCount;
              }
            );

            return {
              conversationId: conversation.id,

              lastMessage: conversation
                .lastMessageContent
                ? {
                    content:
                      conversation.lastMessageContent,
                    timestamp:
                      conversation.lastMessageTimestamp,
                  }
                : null,

              unreadCounts,

              friend: {
                id: friend.id,
                username: friend.username,
                fullName: friend.fullName,
                connectCode:
                  friend.connectCode,
                online:
                  await RedisService.isUserOnline(
                    friend.id.toString()
                  ),
              },
            };
          })
        );

      res.json({
        data: conversationsData.filter(Boolean),
      });

    } catch (error) {
      console.error(
        "Error fetching conversation",
        error
      );

      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
}

export default ConversationController;