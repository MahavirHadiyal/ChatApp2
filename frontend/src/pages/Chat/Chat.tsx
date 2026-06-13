

import ChatWindow from "../../componets/ChatWindow/ChatWindow";
import Sidebar from "../../componets/Sidebar/Sidebar";
import type React from "react";
import { SocketProvider } from "../../contexts/SocketContext";
import { useConversationStore } from "../../stores/conversationStore";

const Chat: React.FC = () => {

    const {selectedConversation} = useConversationStore();
    

    return <SocketProvider>
        <div className="min-h-screen flex bg-gray-100 ">
            <div className={`w-full sm:block sm:w-1/3 sm:max-w-[450px] min-h-screen ${selectedConversation ? 'hidden':'sm:block'} `}>
                <Sidebar />
            </div>
            <div className={` ${selectedConversation ? 'flex':'hidden'} sm:flex flex-1 min-h-screen `}>
                <ChatWindow />
            </div>
        </div>
    </SocketProvider>

}


export default Chat;