import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { ChatState } from "../../context/ChatProvider";
import { useSelector } from "react-redux";
import Axios from "../../utils/Axios";
import { useDispatch } from "react-redux";
import { signOut } from "../../redux-state/userSlice";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import { Alert, Avatar } from "@mui/material";
import UserBadgeItem from "../badges/UserBadgeItem";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  backgroundColor: "#f0dada",
  border: "1px solid white",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
  paddingTop: "20px",
};

const UpdateGroupChatModal = ({
  children,
  fetchAgain,
  setFetchAgain,
  fetchMessages,
}) => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const { chats, setChats, setSelectedChat, selectedChat } = ChatState();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedUsers(selectedChat.users);
    setSearch("");
  };
  const [groupChatName, setGroupChatName] = useState(selectedChat.chatName);
  const [selectedUsers, setSelectedUsers] = useState(selectedChat.users);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const [error, setError] = useState(false);

  const user = useSelector((state) => state.user);

  const handleSearch = async (search, cb) => {
    if (!search) {
      return;
    }

    try {
      const { data } = await Axios.get(`/api/chat/search?search=${search}`);
      cb(data);
    } catch (e) {
      setError({ status: true, message: "Network Error" });
      setTimeout(() => {
        setError({ status: false, message: "" });
      }, 5000);

      if (e.response.status === 401) {
        dispatch(signOut());
        navigate("/sign-in");
      }
    }
  };

  const debouncedFetchData = debounce((search, cb) => {
    handleSearch(search, cb);
  }, 1000);

  const handleRename = async () => {
    if (!groupChatName) {
      return;
    }

    try {
      setRenameLoading(true);
      const { data } = await Axios.put("/api/chat/rename", {
        chatId: selectedChat._id,
        chatName: groupChatName,
      });

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (e) {
      setError({
        status: true,
        message: "Error renaming the group, please try again",
      });
      setTimeout(() => {
        setError({ status: false, message: "" });
      }, 5000);
      setRenameLoading(false);
    }
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      setError({ status: true, message: "User already in the group" });
      setTimeout(() => {
        setError({ status: false, message: "" });
      }, 5000);
      return;
    }

    if (selectedChat.groupAdmin._id !== user.id) {
      setError({
        status: true,
        message: "Only Group Creator can add new users",
      });
      setTimeout(() => {
        setError({ status: false, message: "" });
      }, 5000);
      return;
    }

    try {
      setLoading(true);

      const { data } = await Axios.put("/api/chat/groupadd", {
        chatId: selectedChat._id,
        userId: user1._id,
      });

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setSearch("");
      setLoading(false);
    } catch (e) {
      setError({
        status: true,
        message: "Error adding new user to the chat, please try again",
      });
      setTimeout(() => {
        setError({ status: false, message: "" });
      }, 5000);
      setLoading(false);
    }
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user.id) {
      setError({
        status: true,
        message: "Only Group Creator can remove users",
      });
      setTimeout(() => {
        setError({ status: false, message: "" });
      }, 5000);
      return;
    }

    try {
      setLoading(true);

      const { data } = await Axios.put("/api/chat/groupremove", {
        chatId: selectedChat._id,
        userId: user1._id,
      });

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (e) {
      setError({
        status: true,
        message: "Error removing user from the chat, please try again",
      });
      setTimeout(() => {
        setError({ status: false, message: "" });
      }, 5000);
      setLoading(false);
    }
  };

  const handleLeave = async (userSelf) => {
    try {
      setLoading(true);

      const { data } = await Axios.put("/api/chat/groupremove", {
        chatId: selectedChat._id,
        userId: userSelf.id,
      });

      setSelectedChat({});
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (e) {
      setError({
        status: true,
        message: "Error removing user from the chat, please try again",
      });
      setTimeout(() => {
        setError({ status: false, message: "" });
      }, 5000);
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    debouncedFetchData(search, (res) => {
      setSearchResult(res);
      setLoading(false);
    });
  }, [search]);

  useEffect(() => {
    setSearchResult([]);
    setLoading(false);
  }, [search.length === 0]);

  useEffect(() => {
    setOpen(false);
  }, [!selectedChat.users]);

  return (
    <>
      <span
        style={{ height: "24px" }}
        className='groupChatModalButton'
        onClick={handleOpen}
      >
        {children}
      </span>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
        className='modalCreateChat'
      >
        <Box sx={style}>
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Typography
              id='modal-modal-title'
              fontWeight='bold'
              fontSize='larger'
            >
              Edit Group Chat
            </Typography>
            <br />
          </Box>
          <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            width='100%'
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                margin: "0px",
                marginBottom: "8px",
              }}
            >
              <FormControl sx={{ m: 1, width: "100%" }} variant='outlined'>
                <InputLabel>Chat Name</InputLabel>
                <OutlinedInput
                  id='input-name'
                  onChange={(e) => setGroupChatName(e.target.value)}
                  value={groupChatName}
                  label='Chat Name'
                  autoComplete='off'
                  sx={{ backgroundColor: "#FFFFFF", width: "310px" }}
                />
              </FormControl>
              <LoadingButton
                loading={renameLoading}
                onClick={handleRename}
                variant='contained'
              >
                Update
              </LoadingButton>
            </Box>

            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                marginBottom: "10px",
              }}
            >
              {selectedChat.users &&
                selectedChat.users.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    admin={selectedChat.groupAdmin}
                    handleFunction={() => handleRemove(u)}
                  />
                ))}
            </Box>
            <FormControl
              sx={{
                m: 1,
                width: "100%",
              }}
              variant='outlined'
            >
              <InputLabel>Add Users</InputLabel>
              <OutlinedInput
                id='input-name'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                required
                label='Add Users'
                autoComplete='off'
                sx={{ backgroundColor: "#FFFFFF" }}
              />
            </FormControl>

            {search &&
              searchResult.length > 0 &&
              searchResult
                .filter((u) => {
                  if (selectedUsers.length === 0) {
                    return u;
                  } else {
                    return selectedUsers.some((f) => {
                      return f._id !== u._id;
                    });
                  }
                })
                .slice(0, 3)

                .map((result) => (
                  <div
                    key={result._id}
                    className='searchedChats'
                    onClick={() => handleAddUser(result)}
                  >
                    <div className='userChat'>
                      <Avatar
                        key={result._id}
                        style={{
                          border: "2px solid white",
                          backgroundColor:
                            result.profilePicture === "" ? "pink" : "",
                        }}
                        alt={result.name}
                        src={
                          result.profilePicture === ""
                            ? result.name[0]
                            : result.profilePicture
                        }
                      />
                      <div className='userChatInfo'>
                        <span>{result.name}</span>
                      </div>
                    </div>
                  </div>
                ))}
            <br />
            <br />
            <LoadingButton
              variant='contained'
              color='error'
              onClick={() => handleLeave(user)}
              loading={loading}
              sx={{ width: "40%" }}
            >
              Leave Group
            </LoadingButton>
          </Box>
          {error.status && (
            <Alert
              severity='error'
              variant='filled'
              style={{
                width: "calc(100% - 10px)",
                position: "absolute",
                padding: "2px 6px",
                paddingTop: "0px",
                paddingBottom: "0px",
                borderTopLeftRadius: "0px",
                borderTopRightRadius: "0px",
                marginLeft: "-33px",
                marginTop: "20px",
              }}
            >
              {error.message}
            </Alert>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
