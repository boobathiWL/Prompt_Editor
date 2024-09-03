import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  userData: any; // Replace `any` with your user data type
}

const initialState: UserState = {
  userData: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData(state, action: PayloadAction<any>) {
      state.userData = action.payload;
    },
    clearUserData(state) {
      state.userData = null;
    },
  },
});

export const { setUserData, clearUserData } = userSlice.actions;
export default userSlice.reducer;
