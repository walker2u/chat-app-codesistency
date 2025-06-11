import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore.js";
import ChatHeader from "../components/ChatHeader.jsx";
import ChatInput from "../components/ChatInput.jsx";
import MessageSkeleton from "./skeletons/MessageSkeleton.jsx";

function ChatContainer() {
  const { messages, selectedUser, isMessagesLoading, getMessages, users } =
    useChatStore();
  useEffect(() => {
    getMessages(selectedUser._id);
  }, []);

  if (isMessagesLoading)
    return (
      <div className="flex flex-1 flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <ChatInput />
      </div>
    );

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <ChatHeader />
      <p>messages...</p>
      <ChatInput />
    </div>
  );
}

export default ChatContainer;
