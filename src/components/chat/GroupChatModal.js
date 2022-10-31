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
import CloseIcon from "@mui/icons-material/Close";

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

const GroupChatModal = ({ children }) => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedUsers([]);
    setSearch("");
  };
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const user = useSelector((state) => state.user);
  const { chats, setChats } = ChatState();

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

  const handleSelect = (userToAdd) => {
    setSearch("");
    if (selectedUsers.includes(userToAdd)) {
      setError({ status: true, message: "User already add" });
      setTimeout(() => {
        setError({ status: false, message: "" });
      }, 5000);
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (deleteUser) => {
    setSelectedUsers(
      selectedUsers.filter((selected) => selected._id !== deleteUser._id)
    );
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      setError({ status: true, message: "Please enter all fields" });
      setTimeout(() => {
        setError({ status: false, message: "" });
      }, 5000);
      return;
    } else if (selectedUsers.length < 2) {
      setError({
        status: true,
        message: "Minimum of 3 users required for Group Chat ",
      });
      setTimeout(() => {
        setError({ status: false, message: "" });
      }, 5000);
      return;
    }
    try {
      setLoading(true);

      const { data } = await Axios.post("api/chat/group", {
        name: groupChatName,
        users: JSON.stringify(selectedUsers.map((u) => u._id)),
      });

      setChats([data, ...chats]);
      setLoading(false);
      handleClose();
    } catch (e) {
      setError({
        status: true,
        message: "Failed to create group chat, please try again...",
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
              Create Group Chat
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
            <FormControl sx={{ m: 1, width: "100%" }} variant='outlined'>
              <InputLabel>Chat Name</InputLabel>
              <OutlinedInput
                id='input-name'
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                required
                label='Chat Name'
                autoComplete='off'
                sx={{ backgroundColor: "#FFFFFF" }}
              />
            </FormControl>
            <FormControl sx={{ m: 1, width: "100%" }} variant='outlined'>
              <InputLabel>Search Users...</InputLabel>
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
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                marginBottom: "10px",
              }}
            >
              {selectedUsers &&
                selectedUsers.map((u) => (
                  <Box
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "3px 2px",
                      paddingLeft: "5px",
                      borderRadius: "5px",
                      margin: "1px",
                      marginBottom: "2px",
                      fontSize: "14px",
                      fontWeight: "500",
                      backgroundColor: "pink",
                      cursor: "pointer",
                    }}
                  >
                    <Avatar
                      key={u._id}
                      style={{
                        height: "18px",
                        width: "18px",
                        marginRight: "5px",
                        backgroundColor: u.profilePicture === "" ? "pink" : "",
                      }}
                      alt={u.name}
                      src={
                        u.profilePicture === "" ? u.name[0] : u.profilePicture
                      }
                    />
                    {u.name}
                    {user._id === u._id ? (
                      <span style={{ color: "grey" }}>&nbsp;(admin)</span>
                    ) : (
                      <CloseIcon
                        sx={{ padding: "2px", height: "15px" }}
                        onClick={() => handleDelete(u)}
                      />
                    )}
                  </Box>
                ))}
            </Box>

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
                    onClick={() => handleSelect(result)}
                  >
                    <div className='userChat'>
                      <Avatar
                        key={result._id}
                        style={{
                          height: "44px",
                          width: "44px",
                          border: "2px solid white",
                          objectFit: "cover",
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
            <LoadingButton
              type='submit'
              variant='contained'
              color='success'
              onClick={handleSubmit}
              loading={loading}
              sx={{ width: "100%" }}
            >
              Create Chat
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
                marginTop: "26px",
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

export default GroupChatModal;
