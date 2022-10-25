import React, { createContext, useContext, useState } from "react";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState({});
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);
  const [error, setError] = useState({ status: false, message: "" });
  const [chatSelectRefresh, setChatSelectRefresh] = useState(true);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        notification,
        setNotification,
        chats,
        setChats,
        error,
        setError,
        chatSelectRefresh,
        setChatSelectRefresh,
        messages,
        setMessages,
        typing,
        setTyping,
        isTyping,
        setIsTyping,
        newMessage,
        setNewMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
