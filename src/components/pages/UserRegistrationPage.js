import React, { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import EmailField from "../textFields/EmailField";
import PasswordField from "../textFields/PasswordField";
import OutlinedInput from "@mui/material/OutlinedInput";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import { Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { signIn, signOut } from "../../redux-state/userSlice";
import Axios from "../../utils/Axios";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import Header from "../layout/Header";

const UserRegistrationPage = () => {
  let navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState();
  const [picLoading, setPicLoading] = useState(false);

  const [userRegistrationForm, setUserRegistrationForm] = useState({
    name: "",
    email: "",
    password: "",
    profilePicture: "",
  });

  const handleChange = (prop) => (event) => {
    setUserRegistrationForm({
      ...userRegistrationForm,
      [prop]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    //make sure form is correct
    event.preventDefault();
    setError(undefined);

    try {
      const response = await Axios.post("api/user/register-user", {
        ...userRegistrationForm,
      });

      const { user } = response.data;

      dispatch(signIn(user));

      setUserRegistrationForm({
        name: "",
        email: "",
        password: "",
        profilePicture: "",
      });

      navigate("/");
    } catch (e) {
      setError(`${e.response.data.message}, please try again`);
      setTimeout(() => {
        setError("");
      }, "4000");
    }
  };

  const picUpload = (pic) => {
    setPicLoading(true);

    if (pic === undefined) {
      setPicLoading(false);
      return;
    }

    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "meow-messenger");
      data.append("cloud_name", "du1ef9i5t");
      fetch("https://api.cloudinary.com/v1_1/du1ef9i5t/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setUserRegistrationForm({
            ...userRegistrationForm,
            profilePicture: data.url.toString(),
          });

          setPicLoading(false);
          return;
        })
        .catch((error) => {
          setError(`Error uploading your picture, please try again`);
          setTimeout(() => {
            setError("");
          }, "4000");
          setPicLoading(false);
        });
    } else {
      setError(
        "Image format not supported, please try upload a jpeg or png file"
      );
      setTimeout(() => {
        setError("");
      }, "4000");
      setPicLoading(false);
      return;
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  return (
    <>
      <Box>
        <Header />
      </Box>
      <Layout>
        {!user && (
          <Box
            display='flex'
            height='90vh'
            minHeight='600px'
            alignItems='center'
            justifyContent='center'
          >
            <Box
              sx={{
                backgroundColor: "white",
                maxWidth: "50vw",
                borderRadius: "10px",
                alignItems: "center",
                padding: "20px 60px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                boxShadow: `0 1px 1px rgba(0,0,0,0.11), 
              0 2px 2px rgba(0,0,0,0.11), 
              0 4px 4px rgba(0,0,0,0.11), 
              0 6px 8px rgba(0,0,0,0.11),
              0 8px 16px rgba(0,0,0,0.11)`,
              }}
            >
              {" "}
              <Typography fontWeight='bold' fontSize='larger'>
                Meow Messenger
              </Typography>
              <Typography fontSize='small' color='gray' paddingBottom='1vh'>
                Register
              </Typography>
              <form action='submit' onSubmit={handleSubmit}>
                <Box display='flex' flexDirection='column' alignItems='center'>
                  <FormControl sx={{ m: 1, width: "25ch" }} variant='outlined'>
                    <InputLabel>Display Name</InputLabel>
                    <OutlinedInput
                      id='input-name'
                      value={userRegistrationForm.name}
                      onChange={handleChange("name")}
                      required
                      label='Name'
                      autoComplete='off'
                      sx={{ backgroundColor: "#FFFFFF" }}
                    />
                  </FormControl>
                  <EmailField
                    userData={userRegistrationForm}
                    value={userRegistrationForm.email}
                    handleChange={handleChange}
                  />
                  <PasswordField
                    userData={userRegistrationForm}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    value={userRegistrationForm.password}
                    handleChange={handleChange}
                  />
                  <FormControl sx={{ m: 1, width: "25ch" }} variant='outlined'>
                    <InputLabel shrink={true}>Profile Picture</InputLabel>
                    <OutlinedInput
                      id='input-with-icon-adornment'
                      type={"file"}
                      placeholder='profile'
                      accept='image/*'
                      onChange={(e) => picUpload(e.target.files[0])}
                      label='profile picture'
                      autoComplete='off'
                      notched={true}
                      sx={{ backgroundColor: "#FFFFFF" }}
                    />
                  </FormControl>
                  {error && (
                    <Alert
                      severity='error'
                      sx={{
                        position: "absolute",
                        zIndex: "1",
                        left: "50%",
                        top: "90%",
                        transform: "translate(-50%, -50%)",
                        border: "2px solid red",
                        maxWidth: "80%",
                      }}
                    >
                      {error}
                    </Alert>
                  )}
                  <br />
                  <LoadingButton
                    type='submit'
                    variant='contained'
                    color='success'
                    loading={picLoading}
                    sx={{ width: "100%" }}
                  >
                    Register
                  </LoadingButton>
                  <br />
                  <Typography
                    component='div'
                    sx={{ flexGrow: 1, "&:hover": { cursor: "pointer" } }}
                    onClick={() => navigate("/sign-in")}
                  >
                    Already have an account?
                  </Typography>
                </Box>
              </form>
            </Box>
          </Box>
        )}
      </Layout>
    </>
  );
};

export default UserRegistrationPage;
