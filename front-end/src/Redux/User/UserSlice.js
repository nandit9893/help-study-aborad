import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: false,
  loading: false,
  message: null,
  currentForm: "login",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = false;
      state.message = null;
    },
    signInSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload.currentUser;
      state.accessToken = action.payload.accessToken;
      state.error = false;
      state.message = null;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = true;
      state.message = action.payload;
    },
    signUpStart: (state) => {
      state.loading = true;
      state.error = false;
      state.message = null;
    },
    signUpSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
      state.error = false;
      state.message = null;
    },
    signUpFailure: (state, action) => {
      state.loading = false;
      state.error = true;
      state.message = action.payload;
    },
    logoutStart: (state) => {
      state.loading = true;
      state.error = false;
      state.message = null;
    },
    logoutSuccess: (state) => {
      state.currentUser = null;
      state.accessToken = null;
      state.loading = false;
      state.error = false;
      state.message = null;
      state.currentForm = "login";
      state.accessToken = null;
    },
    logoutFailure: (state, action) => {
      state.error = true;
      state.loading = false;
      state.message = action.payload;
    },
    verifyOTPStart: (state) => {
      state.loading = true;
      state.error = false;
      state.message = null;
    },
    verifyOTPSuccess: (state) => {
      state.loading = false;
      state.message = null;
      state.error = false;
      state.currentUser = null;
      state.accessToken = null;
    },
    verifyOTPFailure: (state, action) => {
      state.loading = false;
      state.error = true;
      state.message = action.payload;
    },
    performTaskStart: (state) => {
      state.loading = true;
      state.error = false;
      state.message = null;
    },
    performTaskSuccess: (state) => {
      state.loading = false;
      state.error = false;
      state.message = null;
    },
    performTaskFailure: (state, action) => {
      state.loading = false;
      state.error = true;
      state.message = action.payload;
    },
    setCurrentForm: (state, action) => {
      state.currentForm = action.payload;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  signUpFailure,
  signUpStart,
  signUpSuccess,
  logoutStart,
  logoutSuccess,
  logoutFailure,
  setCurrentForm,
  verifyOTPFailure,
  verifyOTPStart,
  verifyOTPSuccess,
  performTaskFailure,
  performTaskStart,
  performTaskSuccess,
} = userSlice.actions;

export default userSlice.reducer;
