import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (name, thunkAPI) => {
    try {
      const response = await axios.get("/api/users/profile", {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(
        "Something went wrong please try again later.",
      );
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    userProfile: undefined,
    loading: "idle",
    error: undefined,
    image: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.userProfile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      });
  },
});

export const { changeUserInfo } = userSlice.actions;

export default userSlice.reducer;
