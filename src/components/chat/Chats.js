import React, { useEffect, useState } from "react";
import Axios from "../../utils/Axios";
import { useSelector } from "react-redux";
import { ChatState } from "../../context/ChatProvider";
import { getSender, getSenderFull } from "../../utils/chatLogics";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signOut } from "../../redux-state/userSlice";
import { Avatar, AvatarGroup } from "@mui/material";
import Badge from "@mui/material/Badge";

const Chats = ({ fetchAgain, setFetchAgain }) => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const {
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
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
    fetchChats();
    setSelectedChat(chat);

    notification.map((notif) => {
      if (notif.chat._id === chat._id) {
        setNotification(notification.filter((n) => n.chat._id !== chat._id));
      }
    });
  };

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
              <Badge
                badgeContent={
                  notification.filter((notif) => notif.chat._id === chat._id)
                    .length
                }
                color='error'
                overlap='circular'
                max={99}
                sx={{ padding: "0px 4px" }}
              >
                <AvatarGroup max={3} spacing='small'>
                  {chat.users
                    .filter((u) => u._id !== user.id)
                    .map((member) => (
                      <Avatar
                        className='userAvatars'
                        key={member._id}
                        style={{
                          border: "2px solid white",
                          backgroundColor:
                            member.profilePicture === "" ? "pink" : "",
                        }}
                        alt={member.name}
                        src={
                          member.profilePicture === ""
                            ? member.name[0]
                            : member.profilePicture
                        }
                      />
                    ))}
                </AvatarGroup>
              </Badge>

              <div className='userChatInfo'>
                <span>
                  {!chat.isGroupChat
                    ? getSender(user, chat.users)
                    : chat.chatName}
                </span>
                {chat.latestMessage &&
                  (chat.latestMessage.content.includes("giphy.com/media") ? (
                    <p>GIF</p>
                  ) : (
                    <p>
                      {chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + "..."
                        : chat.latestMessage.content}
                    </p>
                  ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Chats;
