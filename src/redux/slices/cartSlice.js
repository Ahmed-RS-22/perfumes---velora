import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/lib/supabase-client";
import { notify } from "@/utils/notify";

const initialState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchCart = createAsyncThunk("cart/fetch", async (userId) => {
  const { data, error } = await supabase
    .from("cart_items")
    .select("id, user_id, product_id, quantity, name, price, image_url")
    .eq("user_id", userId);

  if (error) throw error;
  return data;
});

export const addToCart = createAsyncThunk(
  "cart/add",
  async ({ userId, productId, quantity = 1, name, price, image_url }) => {
    const { data: existingItem, error: checkError } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .maybeSingle();

    if (checkError) throw checkError;

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      const { data, error } = await supabase
        .from("cart_items")
        .update({ quantity: newQuantity })
        .eq("id", existingItem.id)
        .select("id, user_id, product_id, quantity, name, price, image_url")
        .single();

      if (error) throw error;
      notify.success("Quantity updated in cart!");
      return data;
    }

    const { data, error } = await supabase
      .from("cart_items")
      .insert([
        {
          user_id: userId,
          product_id: productId,
          quantity,
          name,
          price,
          image_url,
        },
      ])
      .select("id, user_id, product_id, quantity, name, price, image_url")
      .single();

    if (error) throw error;
    notify.success("Item added to cart!");
    return data;
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/update",
  async ({ id, quantity }) => {
    const { data, error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", id)
      .select("id, user_id, product_id, quantity, name, price, image_url")
      .single();

    if (error) throw error;
    return data;
  }
);

export const removeFromCart = createAsyncThunk("cart/remove", async (id) => {
  const { error } = await supabase.from("cart_items").delete().eq("id", id);
  if (error) throw error;
  notify.error("Item removed from cart!");
  return id;
});

export const clearCart = createAsyncThunk("cart/clear", async (userId) => {
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", userId);
  if (error) throw error;
  notify.success("Cart cleared!");
  return userId;
});

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const existingIndex = state.data.findIndex(
          (item) => item.id === action.payload.id
        );
        if (existingIndex !== -1) {
          state.data[existingIndex] = action.payload;
        } else {
          state.data.push(action.payload);
        }
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const index = state.data.findIndex((i) => i.id === action.payload.id);
        if (index !== -1) state.data[index] = action.payload;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.data = state.data.filter((item) => item.id !== action.payload);
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.data = [];
      });
  },
});

export default cartSlice.reducer;
