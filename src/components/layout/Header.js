import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

const Header = () => {
  return (
    <Box>
      <AppBar position='static' style={{ height: "64px" }}>
        <Toolbar>
          <Typography
            variant='h4'
            component='div'
            fontFamily='brush script MT'
            sx={{ paddingBottom: "10px" }}
          >
            <img
              src='/meow2.png'
              style={{
                height: "50px",
                marginBottom: "-15px",
                marginLeft: "-10px",
              }}
            ></img>
            Meow
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
