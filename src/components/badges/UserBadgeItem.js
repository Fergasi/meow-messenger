import React from "react";
import { Box } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import { Avatar } from "@mui/material";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
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
      onClick={handleFunction}
    >
      <Avatar
        key={user._id}
        style={{ height: "18px", width: "18px", marginRight: "5px" }}
        alt={user.name}
        src={user.profilePicture}
      />
      {user.name}
      {admin._id === user._id ? (
        <span style={{ color: "grey" }}>&nbsp;(admin)</span>
      ) : (
        <CloseIcon sx={{ padding: "2px", height: "15px" }} />
      )}
    </Box>
  );
};

export default UserBadgeItem;
