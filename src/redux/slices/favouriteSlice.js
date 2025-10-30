import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/lib/supabase-client";
import { notify } from "@/utils/notify";

// ✅ Fetch user's favourites
export const fetchFavourites = createAsyncThunk(
  "favourites/fetch",
  async (userId) => {
    const { data, error } = await supabase
      .from("favourites")
      .select("*")
      .eq("user_id", userId);
    if (error) throw error;
    return data;
  }
);

// ✅ Add to favourites
export const addToFavourites = createAsyncThunk(
  "favourites/add",
  async ({ userId, productId }) => {
    const { error } = await supabase
      .from("favourites")
      .insert([{ user_id: userId, product_id: productId }]);
    if (error) throw error;
    notify.success("Added to favourites ❤️");
    return { product_id: productId };
  }
);

// ✅ Remove from favourites
export const removeFromFavourites = createAsyncThunk(
  "favourites/remove",
  async ({ userId, productId }) => {
    const { error } = await supabase
      .from("favourites")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", productId);
    if (error) throw error;
    notify.info("Removed from favourites 💔");
    return productId;
  }
);

const favouriteSlice = createSlice({
  name: "favourites",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchFavourites.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFavourites.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      // Add
      .addCase(addToFavourites.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      // Remove
      .addCase(removeFromFavourites.fulfilled, (state, action) => {
        state.data = state.data.filter(
          (item) => item.product_id !== action.payload
        );
      });
  },
});

export default favouriteSlice.reducer;
