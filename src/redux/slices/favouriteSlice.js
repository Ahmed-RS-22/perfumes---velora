import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/lib/supabase-client";
import { notify } from "@/utils/notify";

const FAVOURITE_SELECT = `
  id,
  product_id,
  products (
    id,
    name,
    price,
    image_url,
    category,
    quantity
  )
`;

export const fetchFavourites = createAsyncThunk(
  "favourites/fetch",
  async (userId) => {
    const { data, error } = await supabase
      .from("favourites")
      .select(FAVOURITE_SELECT)
      .eq("user_id", userId);
    if (error) throw error;
    return data;
  }
);

export const addToFavourites = createAsyncThunk(
  "favourites/add",
  async ({ userId, productId }) => {
    const { data, error } = await supabase
      .from("favourites")
      .insert([{ user_id: userId, product_id: productId }])
      .select(FAVOURITE_SELECT)
      .single();
    if (error) throw error;
    notify.success("Added to favourites");
    return data;
  }
);

export const removeFromFavourites = createAsyncThunk(
  "favourites/remove",
  async ({ userId, productId }) => {
    const { error } = await supabase
      .from("favourites")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", productId);
    if (error) throw error;
    notify.info("Removed from favourites");
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
      .addCase(fetchFavourites.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFavourites.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchFavourites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addToFavourites.fulfilled, (state, action) => {
        const exists = state.data.some(
          (item) => item.product_id === action.payload.product_id
        );
        if (!exists) state.data.push(action.payload);
      })
      .addCase(removeFromFavourites.fulfilled, (state, action) => {
        state.data = state.data.filter(
          (item) => item.product_id !== action.payload
        );
      });
  },
});

export default favouriteSlice.reducer;
