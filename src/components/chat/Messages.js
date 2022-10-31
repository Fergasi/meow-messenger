import React, { useEffect } from "react";
// import Message from "./Message";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import {
  isLastMessage,
  isSameSender,
  isLastMessageFromSender,
} from "../../utils/chatLogics";
import LoadingPaws from "../../animations/LoadingPaws";
import { ChatState } from "../../context/ChatProvider";
import { Avatar } from "@mui/material";

const Messages = ({ messages }) => {
  const user = useSelector((state) => state.user);
  const { isTyping, typing, setIsTyping } = ChatState();
  const updateScroll = () => {
    var element = document.getElementById("messageBox");
    element.scrollTop = element.scrollHeight;
  };

  useEffect(() => {
    updateScroll();
  }, [messages]);

  return (
    <div id='messageBox' className='messages'>
      {messages.length > 0 &&
        Array.from(new Set(messages.map((m) => m._id)))
          .map((id) => {
            return { _id: id, ...messages.find((s) => s._id === id) };
          })
          .map((message, i) => (
            <div
              key={message._id}
              className={
                message.sender._id === user.id ? "message owner" : "message"
              }
              style={{
                marginBottom:
                  isLastMessageFromSender(messages, message, i) === true
                    ? "30px"
                    : "0px",
              }}
            >
              {message.sender._id !== user.id && (
                <div className='messageInfo'>
                  {message.chat.isGroupChat ? (
                    <>
                      {(isSameSender(messages, message, i, user.id) && (
                        <span
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-end",
                          }}
                        >
                          ~{message.sender.name.split(" ")[0]}
                          {message.sender.profilePicture === "" ? (
                            <Avatar
                              sx={{
                                bgcolor: "pink",
                                border: "2px solid white",
                                marginTop: "4px",
                              }}
                              fontSize='large'
                            >
                              {message.sender.name[0]}
                            </Avatar>
                          ) : (
                            <img
                              style={{ marginTop: "4px" }}
                              src={message.sender.profilePicture}
                              alt=''
                            />
                          )}
                        </span>
                      )) ||
                        (isLastMessage(messages, i, user.id) && (
                          <span
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "flex-end",
                            }}
                          >
                            ~{message.sender.name.split(" ")[0]}
                            {message.sender.profilePicture === "" ? (
                              <Avatar
                                sx={{
                                  bgcolor: "pink",
                                  border: "2px solid white",
                                  marginTop: "4px",
                                }}
                                fontSize='large'
                              >
                                {message.sender.name[0]}
                              </Avatar>
                            ) : (
                              <img
                                style={{ marginTop: "4px" }}
                                src={message.sender.profilePicture}
                                alt=''
                              />
                            )}
                          </span>
                        ))}
                    </>
                  ) : (
                    (isLastMessage(messages, i, user.id) ||
                      isSameSender(messages, message, i, user.id)) && (
                      <span
                        //   className='messageInfo'
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-end",
                        }}
                      >
                        {/* ~{message.sender.name.split(" ")[0]} */}
                        {message.sender.profilePicture === "" ? (
                          <Avatar
                            sx={{
                              bgcolor: "pink",
                              border: "2px solid white",
                            }}
                            fontSize='large'
                          >
                            {message.sender.name[0]}
                          </Avatar>
                        ) : (
                          <img src={message.sender.profilePicture} alt='' />
                        )}
                      </span>
                    )
                  )}
                </div>
              )}
              <div className='messageContent'>
                <p className='messageText'>
                  <span
                    style={{
                      marginBottom: "2px",
                      display: "flex",
                      flexDirection: "column",
                      textAlign:
                        message.sender._id === user.id ? "end" : "start",
                    }}
                  >
                    {format(new Date(message.createdAt), "H:mma")}
                  </span>
                  {message.content.includes("giphy.com/media") ? (
                    <img src={message.content} style={{ width: "100%" }}></img>
                  ) : (
                    <span style={{ fontSize: "medium", fontWeight: "400" }}>
                      {message.content}
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}
      {!typing && isTyping === true ? (
        <LoadingPaws
          style={{
            position: "relative",
            background: "transparent",

            zIndex: "5",
            height: "70px",
            width: "70px",
            display: "flex",
          }}
        />
      ) : (
        <div
          style={{
            height: "70px",
            width: "70px",
            display: "flex",
          }}
        ></div>
      )}
    </div>
  );
};

export default Messages;
