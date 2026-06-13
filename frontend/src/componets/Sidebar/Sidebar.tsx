
import { ConversationsProvider } from "../../contexts/ConversationsContext"
import Conversation from "./Conversations"
import Header from "./Header"
import SearchBar from "./SearchBar"
import UserProfile from "./UserProfile"

const Sidebar: React.FC = () => {
    return <div className="min-h-screen bg-white border-r border-green-200 flex flex-col justify-between ">
        <Header />
        <ConversationsProvider>
            <SearchBar />
            <Conversation />
        </ConversationsProvider>
        <UserProfile />

    </div>
}

export default Sidebar