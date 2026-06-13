import type React from "react";
import type { Conversation } from "../../contexts/ConversationsContext";
import { useAuthStore } from "../../stores/authStore";
import { useConversationStore } from "../../stores/conversationStore";
import { useSocketContext } from "../../contexts/SocketContext";

const ConversationItem: React.FC<Conversation> = ({
    conversationId,
    friend,
    unreadCounts,
    lastMessage
}) => {

    const { user } = useAuthStore();
    const { selectedConversation, setSelectedConversation } = useConversationStore();
    const { socket } = useSocketContext();

    const userId = user?.id;

    const hasUnreadMessages =
        userId != null &&
        (unreadCounts?.[userId] ?? 0) > 0;

    const isSelected =
        selectedConversation?.conversationId === conversationId;

    let displayTime = "";

    if (lastMessage?.timestamp) {
        const createdAt = new Date(lastMessage.timestamp);
        const now = new Date();

        const diffInMs = now.getTime() - createdAt.getTime();
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

        const time = createdAt.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

        const date = createdAt.toLocaleDateString([], {
            year: "numeric",
            month: "short",
            day: "numeric"
        });

        displayTime = diffInDays >= 1 ? `${date} ${time}` : time;
    }

    const handleClick = () => {
        if (isSelected) {
            setSelectedConversation(null);
            return;
        }

        setSelectedConversation({
            conversationId,
            friend,
            lastMessage,
            unreadCounts
        });

        if (socket && friend?.id) {
            socket.emit("conversation:join-room", {
                friendId: friend.id
            });
        }
    };

    return (
        <div
            className={`p-4 border-b border-gray-200 flex items-center space-x-3 cursor-pointer transition-colors ${
                isSelected ? "bg-blue-100" : "bg-gray-50"
            }`}
            onClick={handleClick}
        >
            <div className="relative">
                <img
                    src="data:image/png;base64,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"
                    alt="User"
                    className="size-10 rounded-full object-cover"
                />
                <div
                    className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-white ${
                        friend.online ? "bg-green-400" : "bg-gray-400"
                    }`}
                />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold truncate text-sm">
                        {friend.username}
                    </h2>

                    {lastMessage?.timestamp && (
                        <span className="text-xs text-gray-500">
                            {displayTime}
                        </span>
                    )}
                </div>

                <div className="flex items-center">
                    <p
                        className={`text-sm truncate min-h-[20px] ${
                            hasUnreadMessages
                                ? "text-gray-500"
                                : "text-sky-500"
                        }`}
                    >
                        {lastMessage?.content ?? ""}
                    </p>

                    {userId &&
                        (unreadCounts?.[userId] ?? 0) > 0 && (
                            <div className="bg-sky-500 ml-2 text-xs text-white rounded-full size-5 flex items-center justify-center flex-shrink-0">
                                {unreadCounts[userId]}
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
};

export default ConversationItem;