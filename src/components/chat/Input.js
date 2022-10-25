import React from "react";
import PetsIcon from "@mui/icons-material/Pets";
import IconButton from "@mui/material/IconButton";
import { pink } from "@mui/material/colors";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { FormControl } from "@mui/material";

const Input = ({ sendMessage, typingHandler, newMessage }) => {
  return (
    <div className='input'>
      <input
        onChange={typingHandler}
        onKeyDown={sendMessage}
        value={newMessage}
        type='text'
        placeholder='Type something...'
      />

      <div className='send'>
        <IconButton
          aria-label='account of current user'
          aria-haspopup='true'
          color='inherit'
        >
          <AttachFileIcon />
        </IconButton>
        <IconButton
          aria-label='account of current user'
          aria-haspopup='true'
          color='inherit'
        >
          <AddPhotoAlternateIcon />
        </IconButton>

        <IconButton
          size='large'
          aria-label='account of current user'
          aria-haspopup='true'
          color='inherit'
          onClick={sendMessage}
        >
          <PetsIcon fontSize='large' color='primary' />
        </IconButton>
      </div>
    </div>
  );
};

export default Input;
