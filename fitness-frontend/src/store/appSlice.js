import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
    name: "app",
    initialState: {
      user: JSON.parse(localStorage.getItem("user")) || null,
      token: localStorage.getItem("token") || null,
      userId: localStorage.getItem("userId") || null
    },
    reducers: {
      setCredentials: (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.userId = action.payload.user.sub;
        localStorage.setItem("token", action.payload.token)
        localStorage.setItem("user", JSON.stringify(action.payload.user))
        localStorage.setItem("userId", action.payload.user.sub)

      },
      logout: (state) => {
        state.user = null;
        state.token = null;
        state.userId = null;
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.removeItem("userId")
        // remove any localStorage keys that start with 'ROCP'
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (key && key.startsWith("ROCP")) {
            localStorage.removeItem(key);
          }
        }
      }
    }
})

export const {setCredentials, logout} = appSlice.actions
export default appSlice.reducer;