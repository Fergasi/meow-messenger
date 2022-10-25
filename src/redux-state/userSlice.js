import { createSlice } from "@reduxjs/toolkit";

//Creating a slice, splits your state.
const userSlice = createSlice({
  name: "user",
  initialState: null, //Redux does not accept undefined as a default state.
  reducers: {
    signIn: (state, action) => action.payload,
    signOut: () => null,
  },
});

//Action creators. functions that create our actions when we call them.
export const { signIn, signOut } = userSlice.actions;
export const userReducer = userSlice.reducer;
