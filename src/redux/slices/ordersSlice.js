// src/redux/slices/ordersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../lib/supabase-client";

// ✅ Fetch all orders for the current user (thanks to RLS)
export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async () => {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
      *,
      order_items (
        id,
        product_id,
        quantity,
        price_at_time,
        products (
          name,
          image_url,
          price
        )
      )
    `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
  }
);

export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAllOrders",
  async ({ page = 1, limit = 20 } = {}) => {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { data, error, count } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          id,
          product_id,
          quantity,
          price_at_time,
          products (
            name,
            image_url,
            price
          )
        )
      `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(start, end);

    if (error) throw error;

    return { data, total: count, page };
  }
);

// ✅ Create new order (and related items)
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async ({
    user_id,
    items,
    total_price,
    payment_method,
    shipping_snapshot,
    status,
  }) => {
    // 1️⃣ Create the order record
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          user_id,
          total_price,
          payment_method,
          shipping_snapshot,
          status: status || "pending",
        },
      ])
      .select()
      .single();
      
    if (orderError) throw orderError;
    
    // 2️⃣ Create order_items linked to that order
    const orderItemsData = items.map((item) => ({
      order_id: orderData.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_time: item.price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsData);
    if (itemsError) throw itemsError;

    // 3️⃣ Fetch the complete order with product details
    const { data: completeOrder, error: fetchError } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          id,
          product_id,
          quantity,
          price_at_time,
          products (
            name,
            image_url,
            price
          )
        )
      `
      )
      .eq('id', orderData.id)
      .single();

    if (fetchError) throw fetchError;

    return completeOrder;
  }
);

// ✅ Update order status (admin use)
export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ order_id, newStatus }) => {
    const { data, error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", order_id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    list: [],
    adminList: [],
    adminTotal: 0,
    adminPage: 1,
    loading: false,
    adminLoading: false,
    error: null,
  },
  reducers: {
    clearOrdersError: (state) => {
      state.error = null;
    },
    clearOrders: (state) => {
      state.list = [];
    },
    clearAdminOrders: (state) => {
      state.adminList = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // User orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Admin orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.adminLoading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.adminLoading = false;
        state.adminList = action.payload.data;
        state.adminTotal = action.payload.total;
        state.adminPage = action.payload.page;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.adminLoading = false;
        state.error = action.error.message;
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload); // new order at top
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const userIndex = state.list.findIndex((o) => o.id === action.payload.id);
        if (userIndex !== -1) {
          state.list[userIndex] = {
            ...state.list[userIndex],
            status: action.payload.status,
          };
        }

        const adminIndex = state.adminList.findIndex(
          (o) => o.id === action.payload.id
        );
        if (adminIndex !== -1) {
          state.adminList[adminIndex] = {
            ...state.adminList[adminIndex],
            status: action.payload.status,
          };
        }
      });
  },
});

export const { clearOrdersError, clearOrders, clearAdminOrders } = ordersSlice.actions;
export default ordersSlice.reducer;