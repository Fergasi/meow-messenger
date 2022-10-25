import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./userSlice";

const preloadedState = JSON.parse(localStorage.getItem("application"))
  ? JSON.parse(localStorage.getItem("application"))
  : { user: null };

const store = configureStore({
  reducer: {
    user: userReducer,
  },
  preloadedState: preloadedState,
});

store.subscribe(() => {
  const state = store.getState();

  localStorage.setItem("application", JSON.stringify(state));
});

export default store;
