import React, { useState } from "react";
import { Typography, Box, Avatar, Modal } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  backgroundColor: "#f0dada",
  border: "1px solid white",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
  paddingTop: "20px",
};

const ProfileModal = ({ user, children }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
            <br />
          </Box>
          <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='space=between'
            width='100%'
          >
            {user.profilePicture !== "" ? (
              <img
                src={user.profilePicture}
                style={{
                  height: "150px",
                  width: "150px",
                  objectFit: "cover",
                  borderRadius: "50%",
                  border: "2px solid white",
                }}
              ></img>
            ) : (
              <Avatar
                style={{
                  height: "150px",
                  width: "150px",
                  backgroundColor: "pink",
                  fontSize: "60px",
                  border: "2px solid white",
                }}
              >
                {user.name[0]}
              </Avatar>
            )}
            <br />
            <Typography fontWeight='bold' fontSize='larger'>
              {user.name}
            </Typography>
            <br />
            <Typography>{user.email}</Typography>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ProfileModal;
