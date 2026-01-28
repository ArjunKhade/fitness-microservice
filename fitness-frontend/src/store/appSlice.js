import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
    name: "app",
    initialState: {
        user: JSON.parse(localStorage.getItem("user")) | null,
        token: localStorage.getItem("token")| null,
        userId: localStorage.getItem("userId")| null
    },
    reducers: {
      setCredentials: (state, action) => {

      },
      logout: (state, action) => {

      }
    }
})

export const {setCredentials, logout} = appSlice.actions
export default appSlice.reducer;