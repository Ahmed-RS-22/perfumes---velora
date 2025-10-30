import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../lib/supabase-client";
import { notify } from "../../utils/notify";
// ✅ Register user
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ email, password, username }, { rejectWithValue }) => {
    try {
      // 1️⃣ Create user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
        },
      });
      if (error) throw error;

      const user = data.user;
      if (!user) throw new Error("User creation failed");
      console.log(user.email);

      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      if (!existingProfile) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: user.id,
          email: user.email,
          username: username || email.split("@")[0],
          role: "user",
        });
        if (profileError) throw profileError;
      } else {
        console.log("✅ Profile already exists, skipping insert");
      }

      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Login user
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Logout
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  await supabase.auth.signOut();
});


// ✅ Get current user
export const fetchUser = createAsyncThunk("auth/fetchUser", async () => {
  const { data } = await supabase.auth.getSession();
  return data.session?.user || null;
});
export const listenToAuthChanges = () => (dispatch) => {
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      dispatch({ type: "auth/setUser", payload: session.user });
    } else {
      dispatch({ type: "auth/clearUser" });
    }
  });
};

// ✅ Slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        notify.success("user created successfull", 3000);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        notify.success("you are logged in ", 3000);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.error = null;
        state.loading = false;
        notify.error("you are logged out", 2000);
      })
      // Fetch user
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })

  },
});

export default authSlice.reducer;
