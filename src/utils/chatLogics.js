import { format } from "date-fns";

export const isSameSenderMargin = (messages, m, i, userId) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};

export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

export const isLastMessageFromSender = (messages, message, i) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== message.sender._id ||
      messages[i + 1].sender._id === undefined)
  );
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

export const getSender = (loggedUser, users) => {
  return users[0]._id === loggedUser.id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser.id ? users[1] : users[0];
};

export const isSameTimestamp = (messages, m, i) => {
  return (
    i <= messages.length - 1 &&
    (format(new Date(m.sender.createdAt), "H") ===
      format(new Date(messages[i + 1].sender.createdAt), "H") ||
      messages[i + 1] === undefined) &&
    (format(new Date(m.sender.createdAt), "mm") ===
      format(new Date(messages[i + 1].sender.createdAt), "mm") ||
      messages[i + 1] === undefined)
  );
};
