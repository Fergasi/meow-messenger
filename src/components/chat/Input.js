import React, { useState } from "react";
import PetsIcon from "@mui/icons-material/Pets";
import IconButton from "@mui/material/IconButton";
import { pink } from "@mui/material/colors";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import EmojiPicker from "emoji-picker-react";
import { GiphyCarousel } from "../miscellaneous/GiphySearch";
import GifIcon from "@mui/icons-material/Gif";
import GifBoxIcon from "@mui/icons-material/GifBox";

const Input = ({ sendMessage, typingHandler, newMessage, setNewMessage }) => {
  const [openEmoji, setOpenEmoji] = useState(false);
  const [openGiphy, setOpenGiphy] = useState(false);
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
      {openGiphy && (
        <div
          style={{
            display: "flex",
            width: "100%",
            marginTop: "-235px",
            display: "flex",
            flexDirection: "column",
            paddingBottom: "0px",
          }}
        >
          <input
            style={{
              width: "calc(100% - 4px)",
              height: "30px",
              border: "none",
              outline: "none",
              borderTopLeftRadius: "5px",
              borderTopRightRadius: "5px",
              paddingLeft: "10px",
            }}
            placeholder='Gif search'
          ></input>

          <GiphyCarousel />
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
          //   style={{ paddingTop: "2px" }}
        />

        <div className='send'>
          <IconButton
            aria-label='account of current user'
            aria-haspopup='true'
            color='inherit'
            onClick={() => {
              setOpenGiphy(false);
              setOpenEmoji(!openEmoji);
            }}
          >
            <InsertEmoticonIcon fontSize='medium' />
          </IconButton>

          <IconButton
            aria-label='account of current user'
            aria-haspopup='true'
            color='inherit'
            size='small'
            onClick={() => {
              setOpenEmoji(false);
              setOpenGiphy(!openGiphy);
            }}
          >
            <GifIcon fontSize='large' />
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
