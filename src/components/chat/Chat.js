import React, { useState, useEffect } from "react";
import Messages from "./Messages";
import Input from "./Input";
import ChatIcons from "./ChatIcons";
import { useSelector } from "react-redux";
import Alert from "@mui/material/Alert";
import { ChatState } from "../../context/ChatProvider";
import { getSender, getSenderFull } from "../../utils/chatLogics";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { FormControl, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import ProfileModal from "../miscellaneous/ProfileModal";
import UpdateGroupChatModal from "../miscellaneous/UpdateGroupChatModal";
import Axios from "../../utils/Axios";
import { CircularProgress } from "@mui/material";
import LoadingPaws from "../../animations/LoadingPaws";

import io from "socket.io-client";
const ENDPOINT = "http://localhost:3020";
var socket, selectedChatCompare;

const Chat = ({ fetchAgain, setFetchAgain }) => {
  const user = useSelector((state) => state.user);
  const {
    error,
    setError,
    selectedChat,
    setSelectedChat,
    chatSelectRefresh,
    messages,
    setMessages,
    setTyping,
    typing,
    isTyping,
    setIsTyping,
    newMessage,
    setNewMessage,
  } = ChatState();
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  const fetchMessages = async () => {
    if (!selectedChat.users) return;

    try {
      setLoading(true);

      const { data } = await Axios.get(`/api/message/${selectedChat._id}`);

      console.log("messages: ", messages);
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);

      //   socket.emit("join chat", selectedChat._id);
    } catch (error) {
      setError({ status: true, message: "Failed to load messages" });
      setTimeout(() => {
        setError({ status: false, message: "" });
      }, 5000);
      setLoading(false);
    }
  };

  const sendMessage = async (event) => {
    if (
      (event.key === "Enter" && newMessage) ||
      (event.type === "click" && newMessage)
    ) {
      socket.emit("stop typing", selectedChat._id);
      setTyping(false);
      try {
        const { data } = await Axios.post("/api/message", {
          content: newMessage,
          chatId: selectedChat._id,
        });

        setNewMessage("");
        setMessages([...messages, data]);
        console.log("data!!!: ", data);
        socket.emit("new message", data);
        setFetchAgain(!fetchAgain);
      } catch (e) {
        setError({ status: true, message: "Failed to send messages" });
        setTimeout(() => {
          setError({ status: false, message: "" });
        }, 5000);
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user.id);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();
    setFetchAgain(!fetchAgain);
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        //create notification
        setFetchAgain(!fetchAgain);
      } else {
        setMessages([...messages, newMessageRecieved]);
        setFetchAgain(!fetchAgain);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) {
      return;
    }

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <div className='chat'>
      <div className='chatInfo'>
        <span className='chatTitle'>
          <p>
            {selectedChat.users && !selectedChat.isGroupChat
              ? getSender(user, selectedChat.users)
              : selectedChat.chatName}
          </p>

          {chatSelectRefresh &&
            messages &&
            selectedChat.users &&
            (!selectedChat.isGroupChat ? (
              <IconButton>
                <ProfileModal user={getSenderFull(user, selectedChat.users)}>
                  <VisibilityIcon color='action' fontSize='small' />
                </ProfileModal>
              </IconButton>
            ) : (
              <IconButton>
                <UpdateGroupChatModal
                  setFetchAgain={setFetchAgain}
                  fetchAgain={fetchAgain}
                  fetchMessages={fetchMessages}
                >
                  <VisibilityIcon color='action' fontSize='small' />
                </UpdateGroupChatModal>
              </IconButton>
            ))}
        </span>
        <div className='chatIcons'>
          <ChatIcons />
        </div>
      </div>

      {error.status && (
        <Alert
          severity='error'
          variant='filled'
          style={{
            width: "98%",
            position: "absolute",
            padding: "1%",
            paddingTop: "0px",
            paddingBottom: "0px",
            borderTopLeftRadius: "0px",
            borderTopRightRadius: "0px",
          }}
        >
          {error.message}
        </Alert>
      )}
      {selectedChat.users ? (
        <>
          {loading ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "calc(100% - 65px)",
              }}
            >
              <CircularProgress color='secondary' sx={{}} />
            </div>
          ) : (
            <Messages messages={messages} />
          )}

          <Input
            sendMessage={sendMessage}
            typingHandler={typingHandler}
            newMessage={newMessage}
          />
        </>
      ) : (
        <Box className='chatPlaceholder'>
          <Typography
            variant='h3'
            component='div'
            fontFamily='brush script MT'
            color='white'
            fontWeight='100'
          >
            Select a user to start chatting
          </Typography>
        </Box>
      )}
    </div>
  );
};

export default Chat;
