import userEvent from "@testing-library/user-event";
import React from "react";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { isLastMessage, isSameSender } from "../../utils/chatLogics";

const Message = ({ message, messages, i }) => {
  const user = useSelector((state) => state.user);

  return (
    <div
      className={message.sender._id === user.id ? "message owner" : "message"}
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
  );
};

export default Message;
