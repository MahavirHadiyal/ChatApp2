import type React from "react";
import type { Message } from "../../services/messageService";
import { useAuthStore } from "../../stores/authStore";

const MessageItem: React.FC<Message> = ({
  _id,
  sender,
  content,
  read,
  createdAt
}) => {
  const { user } = useAuthStore();

  if (!sender) return null;

  const userIsSender = String(sender.id) === String(user?.id); // ✅ fix: type-safe comparison

  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  const time = created.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const date = created.toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" });
  const displayTime = diffDays > 1 ? `${date} ${time}` : time;

  if (userIsSender) {
    return (
      <div className="flex justify-end mb-4">
        <div className="bg-sky-500 text-white p-3 max-w-xs lg:max-w-md rounded-2xl">
          <p className="text-sm">{content}</p>
          <span className="text-xs flex items-center gap-1 text-blue-100 mt-1">{displayTime}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex mb-4">
      <img
        src="data:image/png;base64,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"
        alt={sender.username || "User"}
        className="rounded-full object-cover size-8 mr-2"
      />
      <div className="bg-white p-3 max-w-xs lg:max-w-md rounded-2xl">
        <p className="text-sm">{content}</p>
        <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">{displayTime}</span>
      </div>
    </div>
  );
};

export default MessageItem;