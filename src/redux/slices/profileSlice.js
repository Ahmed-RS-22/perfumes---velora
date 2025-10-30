import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  deleteUserById,
  getProfile,
  updateProfile,
} from "../../lib/profileApi";
import { supabase } from "../../lib/supabase-client";

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (userId, { rejectWithValue }) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      console.warn("❌ No session found — aborting profile fetch");
      return rejectWithValue("Not authenticated");
    }
    try {
      return await getProfile(userId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveProfile = createAsyncThunk(
  "profile/saveProfile",
  async ({ userId, updates }, { rejectWithValue }) => {
    try {
      return await updateProfile(userId, updates);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
// Add this in your profileSlice.js (below the existing imports)

export const fetchAllProfiles = createAsyncThunk(
  "profile/fetchAllProfiles",
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
// delete any  user
export const deleteUserByAdmin = createAsyncThunk(
  "profile/deleteUserByAdmin",
  async (userId, { rejectWithValue }) => {
    try {
      return await deleteUserById(userId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
const profileSlice = createSlice({
  name: "profile",
  initialState: { data: null, allProfiles: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        console.log(state.data);
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(saveProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllProfiles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllProfiles.fulfilled, (state, action) => {
        state.loading = false;
        state.allProfiles = action.payload; // store all users
      })
      .addCase(fetchAllProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete user
      .addCase(deleteUserByAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUserByAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.allProfiles = state.allProfiles.filter(
          (user) => user.id !== action.payload
        );
      })
      .addCase(deleteUserByAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default profileSlice.reducer;
