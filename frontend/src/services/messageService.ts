import apiClient from "../utils/apiClient";

export type Message = {
    _id: string;
    conversation: string;
    sender: {
        id: string;        // ✅ changed from _id to id (PostgreSQL)
        username: string;
    };
    content: string;
    read: boolean;
    createdAt: string;
};

interface MessagesResponse {
    messages: Message[];
    nextCursor: string | undefined;
    hasNext: boolean;
}

export const messageService = {
    fetchMessages: async (conversationId: string, cursor?: string): Promise<MessagesResponse> => {
        const result = await apiClient.get(`/conversations/${conversationId}/messages`, {
            params: { cursor }
        });
        return result.data;
    }
};