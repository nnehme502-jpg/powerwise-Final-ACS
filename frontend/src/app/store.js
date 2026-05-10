import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import energyReducer from "../features/energySlice"; 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    energy: energyReducer 
  }
});