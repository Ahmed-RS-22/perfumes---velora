import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../lib/supabase-client";
import { notify } from "@/utils/notify";

const initialState = {
  data: [],
  loading: false,
  error: null,
};

/* 🔹 FETCH all products */
export const fetchProducts = createAsyncThunk("products/fetchAll", async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
});

/* 🟢 ADD a new product (Admin only) */
export const addProduct = createAsyncThunk("products/add", async (product) => {
  const { data, error } = await supabase
    .from("products")
    .insert([product])
    .select()
    .single();

  if (error) throw error;
  notify.success("Product added successfully!");
  return data;
});

/* 🟠 UPDATE an existing product (Admin only) */
export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, updates }) => {
    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    notify.info("Product updated successfully!");
    return data;
  }
);
/* 🔴 DELETE a product (Admin only) */
export const deleteProduct = createAsyncThunk("products/delete", async (id) => {
  // 1️⃣ Fetch the image URL
  const { data: product, error: fetchError } = await supabase
    .from("products")
    .select("image_url")
    .eq("id", id)
    .single();
  if (fetchError) throw fetchError;
  if (!product) throw new Error("Product not found");
  const imageUrl = product.image_url;
  if (imageUrl) {
    const path = imageUrl.split("/product-images/")[1]; // get the filename
    if (path) {
      const { error: storageError } = await supabase.storage
        .from("product-images")
        .remove([path]);
      if (storageError)
        console.error("❌ Storage delete failed:", storageError);
      else console.log("✅ Storage delete success:");
    }
  }
  // 2️⃣ Delete the product from DB
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
  notify.success("Product & image deleted!");
  return id;
});
/////////////////////////////////////////
export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Add
      .addCase(addProduct.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })

      // Update
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.data.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })

      // Delete
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.data = state.data.filter((p) => p.id !== action.payload);
      });
  },
});

export default productSlice.reducer;
