import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./components/pages/HomePage";
import LoginPage from "./components/pages/LoginPage";
import CustomThemeProvider from "./CustomThemeProvider";
import UserRegistrationPage from "./components/pages/UserRegistrationPage";
import { useSelector } from "react-redux";
import "./style.scss";
import store from "./redux-state/store";
import { Provider } from "react-redux";
import ChatProvider from "./context/ChatProvider";

function App() {
  return (
    <CustomThemeProvider>
      <Provider store={store}>
        <ChatProvider>
          <BrowserRouter>
            <Routes>
              <Route index path='/sign-in' element={<LoginPage />} />
              <Route path='/register-user' element={<UserRegistrationPage />} />
              <Route path='/' element={<HomePage />} />
            </Routes>
          </BrowserRouter>
        </ChatProvider>
      </Provider>
    </CustomThemeProvider>
  );
}

export default App;
