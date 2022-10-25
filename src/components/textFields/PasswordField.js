import React from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const PasswordField = ({
  userData,
  handleChange,
  showPassword,
  setShowPassword,
}) => {
  return (
    <FormControl sx={{ m: 1, width: "25ch" }} variant='outlined'>
      <InputLabel>Password</InputLabel>
      <OutlinedInput
        id='outlined-adornment-email'
        type={showPassword ? "text" : "password"}
        value={userData.password}
        onChange={handleChange("password")}
        endAdornment={
          <InputAdornment position='end'>
            <IconButton
              aria-label='toggle password visibility'
              onClick={() => setShowPassword(!showPassword)}
              edge='end'
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        label='Password'
        required
        sx={{ backgroundColor: "#FFFFFF" }}
      />
    </FormControl>
  );
};

export default PasswordField;
