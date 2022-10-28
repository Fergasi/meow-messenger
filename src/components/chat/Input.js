import React, { useState } from "react";
import PetsIcon from "@mui/icons-material/Pets";
import IconButton from "@mui/material/IconButton";
import { pink } from "@mui/material/colors";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import EmojiPicker from "emoji-picker-react";

const Input = ({ sendMessage, typingHandler, newMessage, setNewMessage }) => {
  const [openEmoji, setOpenEmoji] = useState(false);
  return (
    <div style={{ width: "100%" }}>
      {openEmoji && (
        <div
          style={{
            display: "flex",
            width: "100%",
            marginTop: "-202px",
          }}
        >
          <EmojiPicker
            onEmojiClick={(g) => setNewMessage(newMessage + g.emoji)}
            height={200}
            width='100%'
            searchDisabled={true}
            previewConfig={{ showPreview: false }}
          />
        </div>
      )}
      <div className='input'>
        <input
          onChange={typingHandler}
          onKeyDown={(e) => {
            sendMessage(e);
            setOpenEmoji(false);
          }}
          value={newMessage}
          type='text'
          placeholder='Type something...'
        />

        <div className='send'>
          <IconButton
            aria-label='account of current user'
            aria-haspopup='true'
            color='inherit'
            onClick={() => setOpenEmoji(!openEmoji)}
          >
            <InsertEmoticonIcon />
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
            onClick={(e) => {
              sendMessage(e);
              setOpenEmoji(false);
            }}
          >
            <PetsIcon fontSize='large' color='primary' />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default Input;
