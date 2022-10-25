import React, { useEffect } from "react";
// import Message from "./Message";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { isLastMessage, isSameSender } from "../../utils/chatLogics";
import LoadingPaws from "../../animations/LoadingPaws";
import { ChatState } from "../../context/ChatProvider";

const Messages = ({ messages }) => {
  const user = useSelector((state) => state.user);
  const { isTyping, typing } = ChatState();
  const updateScroll = () => {
    var element = document.getElementById("messageBox");
    element.scrollTop = element.scrollHeight;
  };

  useEffect(() => {
    updateScroll();
  }, [messages]);

  console.log("messages: ", messages);

  return (
    <div id='messageBox' className='messages'>
      {messages &&
        messages.map((message, i) => (
          <div
            key={message._id}
            className={
              message.sender._id === user.id ? "message owner" : "message"
            }
          >
            <div className='messageInfo'>
              <span style={{ marginTop: "2px" }}>
                {format(new Date(message.createdAt), "H:mma")}
                {/* format(date, "MMMM do, yyyy H:mma"); */}
              </span>
              {(isSameSender(messages, message, i, user.id) ||
                isLastMessage(messages, i, user.id)) && (
                <img src={message.sender.profilePicture} alt='' />
              )}
            </div>
            <div className='messageContent'>
              <p>{message.content}</p>
            </div>
          </div>
        ))}
      {!typing && isTyping ? (
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
