import React, { useEffect, useState } from "react";
import Axios from "../../utils/Axios";
import { useSelector } from "react-redux";
import { ChatState } from "../../context/ChatProvider";
import { getSender, getSenderFull } from "../../utils/chatLogics";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signOut } from "../../redux-state/userSlice";
import { Avatar, AvatarGroup } from "@mui/material";

const Chats = ({ fetchAgain }) => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const {
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    setChatSelectRefresh,
  } = ChatState();

  const fetchChats = async () => {
    try {
      const { data } = await Axios.get("/api/chat/");

      setChats(data);
    } catch (e) {
      if (e.response.status === 401) {
        dispatch(signOut());
        navigate("/sign-in");
      }
    }
  };

  useEffect(() => {
    fetchChats();
  }, [fetchAgain]);

  const handleSelect = async (chat) => {
    setChatSelectRefresh(false);
    setSelectedChat(chat);
    setTimeout(() => {
      setChatSelectRefresh(true);
    }, 1);
  };
  console.log("chats: ", chats);

  return (
    <div className='chats'>
      {user && (
        <>
          {chats.map((chat) => (
            <div
              key={chat._id}
              className='userChat'
              onClick={() => handleSelect(chat)}
              style={{
                backgroundColor: selectedChat._id === chat._id && "#b26362",
              }}
            >
              <AvatarGroup max={3} spacing='small' className='userAvatars'>
                {chat.users
                  .filter((u) => u._id !== user.id)
                  .map((member) => (
                    <Avatar
                      key={member._id}
                      style={{ border: "2px solid white" }}
                      alt={member.name}
                      src={member.profilePicture}
                    />
                  ))}
              </AvatarGroup>

              <div className='userChatInfo'>
                <span>
                  {!chat.isGroupChat
                    ? getSender(user, chat.users)
                    : chat.chatName}
                </span>
                {chat.latestMessage && (
                  <p>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </p>
                )}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Chats;
