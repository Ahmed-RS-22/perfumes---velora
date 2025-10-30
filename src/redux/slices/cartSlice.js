// src/redux/slices/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/lib/supabase-client";
import { notify } from "@/utils/notify";

const initialState = {
  data: [],
  loading: false,
  error: null,
};

/* 🟢 Fetch current user's cart */
export const fetchCart = createAsyncThunk("cart/fetch", async (userId) => {
  const { data, error } = await supabase
    .from("cart_items")
    .select("*, products(name, price, image_url)")
    .eq("user_id", userId);

  if (error) throw error;
  return data;
});

/* 🟢 Add item to cart - UPDATED to prevent duplicates */
export const addToCart = createAsyncThunk(
  "cart/add",
  async ({ userId, productId, quantity = 1, name, price, image_url }) => {
    
    // First check if item already exists in cart
    const { data: existingItem, error: checkError } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') throw checkError; // Ignore "not found" error

    let data;

    if (existingItem) {
      // If item exists, update quantity instead of creating duplicate
      const newQuantity = existingItem.quantity + quantity;
      const { data: updatedItem, error: updateError } = await supabase
        .from("cart_items")
        .update({ quantity: newQuantity })
        .eq("id", existingItem.id)
        .select()
        .single();

      if (updateError) throw updateError;
      data = updatedItem;
      notify.success(`Quantity updated in cart!`);
    } else {
      // If item doesn't exist, create new cart item
      const { data: newItem, error: insertError } = await supabase
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
        .select()
        .single();

      if (insertError) throw insertError;
      data = newItem;
      notify.success("Item added to cart!");
    }

    return data;
  }
);

/* 🟠 Update quantity */
export const updateCartItem = createAsyncThunk(
  "cart/update",
  async ({ id, quantity }) => {
    const { data, error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
);

/* 🔴 Remove item */
export const removeFromCart = createAsyncThunk("cart/remove", async (id) => {
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", id);
  if (error) throw error;
  notify.error("Item removed from cart!");
  return id;
});

/* 🔴 Clear entire cart - UPDATED to require userId */
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
      // FETCH CART
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
      // ADD ITEM
      .addCase(addToCart.fulfilled, (state, action) => {
        const existingIndex = state.data.findIndex(item => item.id === action.payload.id);
        if (existingIndex !== -1) {
          // Update existing item
          state.data[existingIndex] = action.payload;
        } else {
          // Add new item
          state.data.push(action.payload);
        }
      })
      // UPDATE ITEM
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const index = state.data.findIndex((i) => i.id === action.payload.id);
        if (index !== -1) state.data[index] = action.payload;
      })
      // REMOVE ITEM
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.data = state.data.filter((item) => item.id !== action.payload);
      })
      // CLEAR CART
      .addCase(clearCart.fulfilled, (state) => {
        state.data = [];
      });
  },
});

export default cartSlice.reducer;