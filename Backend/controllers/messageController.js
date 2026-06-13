import prisma from "../lib/prisma.js";

class MessageController {
  static async getMessage(req, res) {
    try {
      const conversationId = Number(req.params.conversationId);
      const { cursor } = req.query;

      const limit = 20;

      const messages = await prisma.message.findMany({
        where: {
          conversationId,
          ...(cursor && {
            createdAt: {
              lt: new Date(cursor),
            },
          }),
        },

        orderBy: {
          createdAt: "desc",
        },

        take: limit,

        include: {
          sender: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });

      const nextCursor =
        messages.length > 0
          ? messages[messages.length - 1].createdAt.toISOString()
          : null;

      const formattedMessages = messages
        .reverse()
        .map((message) => ({
          id: message.id,
          content: message.content,
          createdAt: message.createdAt,
          sender: {
            id: message.sender.id,
            username: message.sender.username,
          },
        }));

      res.json({
        messages: formattedMessages,
        nextCursor,
        hasNext: messages.length === limit,
      });

    } catch (error) {
      console.error(
        "Error fetching messages",
        error
      );

      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
}

export default MessageController;