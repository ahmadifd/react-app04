import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthInfo {
  token: string | null;
}

const initialState: AuthInfo = {
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state: AuthInfo, action: PayloadAction<AuthInfo>) => {
      const accessToken = action.payload.token;
      state.token = accessToken;
    },
    logOut: (state: AuthInfo) => {
      state.token = null;
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;
