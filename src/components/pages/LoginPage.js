import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Layout from "../layout/Layout";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import EmailField from "../textFields/EmailField";
import PasswordField from "../textFields/PasswordField";
import { useDispatch, useSelector } from "react-redux";
import { signIn, signOut } from "../../redux-state/userSlice";
import { Typography } from "@mui/material";
import { Alert } from "@mui/material";
import Axios from "../../utils/Axios";
import Header from "../layout/Header";

const LoginPage = () => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState();
  const [signInForm, setSignInForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (prop) => (event) => {
    setSignInForm({ ...signInForm, [prop]: event.target.value });
  };

  const onLogin = async () => {
    try {
      //call the back end with the login credentials
      const response = await Axios.post("api/user/sign-in", {
        credentials: signInForm,
      });

      //insert fetched user into the state
      const fetchedUser = response.data.user;

      dispatch(signIn(fetchedUser));
      navigate("/");
    } catch (e) {
      setError(`${e.response.data.message}, please try again`);
      setTimeout(() => {
        setError("");
      }, "4000");
    }
  };

  const onLogOut = async () => {
    try {
      await Axios.get("api/user/sign-out");
      dispatch(signOut());
    } catch (e) {
      setError("Network error, please try again");
      setTimeout(() => {
        setError("");
      }, "4000");
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
        {!user ? (
          <Box
            display='flex'
            height='90vh'
            minHeight='500px'
            alignItems='center'
            justifyContent='center'
          >
            <Box
              sx={{
                backgroundColor: "white",
                borderRadius: "10px",
                maxWidth: "50vw",
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
                Sign In
              </Typography>
              <EmailField
                userData={signInForm}
                value={signInForm.email}
                handleChange={handleChange}
              />
              <PasswordField
                userData={signInForm}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                value={signInForm.password}
                handleChange={handleChange}
              />
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
              <Button
                variant='contained'
                sx={{ width: "100%" }}
                color='success'
                onClick={onLogin}
              >
                Login
              </Button>
              <br />
              <Typography
                component='div'
                sx={{ flexGrow: 1, "&:hover": { cursor: "pointer" } }}
                onClick={() => navigate("/register-user")}
              >
                Don't have an account?
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            style={{ marginTop: "30vh" }}
          >
            <Typography
              variant='h3'
              component='div'
              fontFamily='brush script MT'
              sx={{ flexGrow: 1, paddingBottom: "5%" }}
            >
              Noooo don't go...
            </Typography>

            <Button variant='contained' color='error' onClick={onLogOut}>
              Logout
            </Button>
            <br />
            {error && <Alert severity='error'>{error}</Alert>}
            <br />
          </Box>
        )}
      </Layout>
    </>
  );
};

export default LoginPage;
