import React from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import AccountCircle from "@mui/icons-material/AccountCircle";

const EmailField = ({ userData, handleChange }) => {
  return (
    <FormControl sx={{ m: 1, width: "25ch" }} variant='outlined'>
      <InputLabel>Email</InputLabel>
      <OutlinedInput
        id='outlined-adornment-password'
        type={"email"}
        value={userData.email}
        onChange={handleChange("email")}
        startAdornment={
          <InputAdornment position='start'>
            <AccountCircle />
          </InputAdornment>
        }
        label='Email'
        required
        sx={{ backgroundColor: "#FFFFFF" }}
      />
    </FormControl>
  );
};

export default EmailField;
