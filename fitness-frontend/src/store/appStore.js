import { configureStore } from "@reduxjs/toolkit";
import AppSlice from "./appSlice"

export const appStore = configureStore({
    reducer: {
      app: AppSlice
    }
})