import React, { useState, useEffect, useCallback } from "react";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Tooltip from "@mui/material/Tooltip";
import SettingsIcon from "@mui/icons-material/Settings";
import Badge from "@mui/material/Badge";
import Logout from "@mui/icons-material/Logout";
import Login from "@mui/icons-material/Login";
import { signOut } from "../../redux-state/userSlice";
import Axios from "../../utils/Axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import NotificationsIcon from "@mui/icons-material/Notifications";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { ChatState } from "../../context/ChatProvider";
import GroupChatModal from "./GroupChatModal";
import { getSender } from "../../utils/chatLogics";
import Fade from "@mui/material/Fade";
import { format } from "date-fns";
import Snackbar from "@mui/material/Snackbar";
import { SnackbarContent } from "@mui/material";
import debounce from "lodash.debounce";

const ChatIcons = () => {
  const {
    setError,
    setSelectedChat,
    notification,
    setNotification,
    newNotif,
    setNewNotif,
  } = ChatState();
  const user = useSelector((state) => state.user);
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEll, setAnchorEll] = useState(null);
  const open = Boolean(anchorEl);
  const open1 = Boolean(anchorEll);
  const [snackbarState, setSnackbarState] = useState(false);
  const snackbarOpen = Boolean(snackbarState);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClick1 = (event) => {
    setAnchorEll(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClose1 = () => {
    setAnchorEll(null);
  };

  const onLogOut = async () => {
    try {
      await Axios.get("api/user/sign-out");
      setSelectedChat({});
      dispatch(signOut());
    } catch (e) {
      setError({ status: true, message: "Network error, please try again" });
      setTimeout(() => {
        setError({ status: false, message: "" });
      }, "4000");
    }
  };

  const onLogin = () => {
    navigate("/sign-in");
    return;
  };

  const handleSnackbarClick = () => {
    setSnackbarState(false);
    setSelectedChat(notification[0].chat);
    setTimeout(() => {
      setNotification(
        notification.filter((n) => n.chat._id !== notification[0].chat._id)
      );
    }, 500);
  };

  const snackBarExec = () => {
    setSnackbarState(false);
  };

  const debounceSnackbarFunc = useCallback(debounce(snackBarExec, 4000), []);

  useEffect(() => {
    setSnackbarState(true);
    debounceSnackbarFunc();
  }, [newNotif]);

  return (
    <>
      {notification.length > 0 && (
        <Snackbar
          anchorOrigin={{ horizontal: "right", vertical: "top" }}
          open={snackbarOpen}
          onClick={handleSnackbarClick}
          TransitionComponent={Fade}
        >
          <SnackbarContent
            sx={{
              backgroundColor: "#b26362",
              overflow: "hidden",
              padding: "0px 10px",
            }}
            message={
              <>
                <strong
                  style={{
                    maxWidth: "90%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {`${notification[0].sender.name}` +
                    (notification[0].chat.isGroupChat
                      ? ` - (${notification[0].chat.chatName})`
                      : "")}
                </strong>
                <div
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {notification[0].content.includes("giphy.com/media") ? (
                    <img
                      src={notification[0].content}
                      style={{ height: "50px", marginTop: "4px" }}
                    ></img>
                  ) : (
                    <>{notification[0].content}</>
                  )}
                </div>
              </>
            }
          />
        </Snackbar>
      )}
      <div>
        <IconButton
          aria-label='account of current user'
          aria-haspopup='true'
          color='inherit'
          style={{ marginRight: "10px" }}
        >
          <GroupChatModal>
            <GroupAddIcon color='action' />
          </GroupChatModal>
        </IconButton>
        <Tooltip title='Notifications'>
          <IconButton
            aria-label='notifications for current user'
            color='inherit'
            onClick={handleClick1}
            aria-controls={open1 ? "notifications-menu" : undefined}
            aria-haspopup='true'
            aria-expanded={open1 ? "true" : undefined}
            style={{ marginRight: "8px" }}
          >
            <Badge
              variant={notification.length > 0 ? "dot" : ""}
              color='error'
              overlap='circular'
            >
              <NotificationsIcon color='action' />
            </Badge>
          </IconButton>
        </Tooltip>

        <Tooltip title='Account settings'>
          <IconButton
            size='large'
            aria-label='account of current user'
            color='inherit'
            onClick={handleClick}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup='true'
            aria-expanded={open ? "true" : undefined}
          >
            {user && user.profilePicture && (
              <img
                src={user.profilePicture}
                style={{
                  borderRadius: "50%",
                  height: "40px",
                  width: "40px",
                  display: "cover",
                  border: "2px solid white",
                  objectFit: "cover",
                }}
              ></img>
            )}
            {user && user.profilePicture === "" && (
              <Avatar
                sx={{ bgcolor: "pink", border: "2px solid white" }}
                fontSize='large'
              >
                {user.name[0]}
              </Avatar>
            )}
          </IconButton>
        </Tooltip>
      </div>
      <Menu
        anchorEl={anchorEl}
        id='account-menu'
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem>
          <Avatar /> Profile
        </MenuItem>
        {/* <MenuItem >
          <ListItemIcon>
            <SettingsIcon fontSize='small' />
          </ListItemIcon>
          Settings
        </MenuItem> */}
        <Divider />
        {user && (
          <MenuItem onClick={onLogOut}>
            <ListItemIcon>
              <Logout fontSize='small' />
            </ListItemIcon>
            Logout
          </MenuItem>
        )}
        {!user && (
          <MenuItem onClick={onLogin}>
            <ListItemIcon>
              <Login fontSize='small' />
            </ListItemIcon>
            Login
          </MenuItem>
        )}
      </Menu>

      <Menu
        anchorEl={anchorEll}
        id='notifications-menu'
        open={open1}
        onClose={handleClose1}
        onClick={handleClose1}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "scroll",
            maxHeight: "210px",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.6,
            marginLeft: "83px",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {notification.length === 0 && <MenuItem>No Notifications</MenuItem>}
        {notification.map((notif) => (
          <MenuItem
            key={notif._id}
            onClick={() => {
              setSelectedChat(notif.chat);
              setNotification(
                notification.filter((n) => n.chat._id !== notif.chat._id)
              );
            }}
          >
            <span>
              {notif.chat.isGroupChat ? (
                <>
                  {`New Message in ${notif.chat.chatName} @ ` +
                    format(new Date(notif.createdAt), "H:mma")}
                </>
              ) : (
                <>
                  {`New message from ${getSender(user, notif.chat.users)} @ ` +
                    format(new Date(notif.createdAt), "H:mma")}
                </>
              )}
            </span>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ChatIcons;
