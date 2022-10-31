import React, { useState, useEffect, useCallback, useRef } from "react";
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
import { debounce } from "lodash";
import io from "socket.io-client";
const ENDPOINT = "http://localhost:3020";
var socket, selectedChatCompare;

const Chat = ({ fetchAgain, setFetchAgain }) => {
  const user = useSelector((state) => state.user);
  const {
    error,
    setError,
    selectedChat,
    messages,
    setMessages,
    setTyping,
    typing,
    setIsTyping,
    newMessage,
    setNewMessage,
    notification,
    setNotification,
    newNotif,
    setNewNotif,
  } = ChatState();
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  const fetchMessages = async () => {
    if (!selectedChat.users) return;

    try {
      setLoading(true);

      const { data } = await Axios.get(`/api/message/${selectedChat._id}`);

      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
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

  const sendGif = async (gif) => {
    try {
      const { data } = await Axios.post("/api/message", {
        content: gif,
        chatId: selectedChat._id,
      });

      setNewMessage("");
      setMessages([...messages, data]);
      socket.emit("new message", data);
      setFetchAgain(!fetchAgain);
    } catch (e) {
      setError({ status: true, message: "Failed to send messages" });
      setTimeout(() => {
        setError({ status: false, message: "" });
      }, 5000);
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user.id);
    socket.on("connected", () => setSocketConnected(true));
  }, []);

  useEffect(() => {
    fetchMessages();
    setFetchAgain(!fetchAgain);
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("typing", (roomId) => {
      if (roomId === selectedChatCompare._id) {
        setIsTyping(true);
      }
    });
    socket.on("stop typing", () => setIsTyping(false));
  });

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
        }
        setNewNotif(!newNotif);
        setFetchAgain(!fetchAgain);
      } else {
        setMessages([...messages, newMessageRecieved]);
        setFetchAgain(!fetchAgain); //might be where random bug lives
      }
    });
  });

  const handleIncomingTyping = (roomId) => {
    if (roomId === selectedChat._id) {
      setIsTyping(true);
    }
  };

  const pawsHandler = () => {
    socket.emit("stop typing", selectedChat._id);
    setTyping(false);
  };

  const debouncedFunctionRef = useRef();
  debouncedFunctionRef.current = () => pawsHandler();

  const debouncedPawsOff = useCallback(
    debounce((...args) => debouncedFunctionRef.current(...args), 2000),
    []
  );

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) {
      return;
    }

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    debouncedPawsOff();
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

          {messages &&
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
            setNewMessage={setNewMessage}
            sendGif={sendGif}
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
