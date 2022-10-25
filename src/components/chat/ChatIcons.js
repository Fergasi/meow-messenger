import React, { useState } from "react";
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

const ChatIcons = () => {
  const { setError, setSelectedChat } = ChatState();
  const user = useSelector((state) => state.user);
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
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

  return (
    <>
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

        <IconButton
          aria-label='account of current user'
          aria-haspopup='true'
          color='inherit'
          style={{ marginRight: "8px" }}
        >
          <Badge variant='dot' color='error' overlap='circular'>
            <NotificationsIcon color='action' />
          </Badge>
        </IconButton>
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
                  height: "36px",
                  width: "36px",
                  display: "cover",
                  border: "2px solid white",
                  objectFit: "cover",
                }}
              ></img>
            )}
            {user && user.profilePicture === "" && (
              <Avatar sx={{ bgcolor: "pink" }} fontSize='large'>
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
            mt: 1.5,
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
        <MenuItem /* onClick={() => navigate("/")}*/>
          <ListItemIcon>
            <SettingsIcon fontSize='small' />
          </ListItemIcon>
          Settings
        </MenuItem>
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
    </>
  );
};

export default ChatIcons;
