import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../lib/supabase-client";
import { notify } from "@/utils/notify";

const PRODUCT_COLUMNS =
  "id, name, price, image_url, category, quantity";

export function buildProductCacheKey({ page, search = "", category = "All" }) {
  return `${page}:${search}:${category}`;
}

/* Fetch products with pagination, search, and category filter */
export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async (
    { page = 1, limit = 6, search = "", category = "All" },
    { rejectWithValue }
  ) => {
    try {
      const start = (page - 1) * limit;
      const end = start + limit - 1;

      let query = supabase
        .from("products")
        .select(PRODUCT_COLUMNS, { count: "exact" })
        .order("name", { ascending: true });

      if (search) query = query.ilike("name", `%${search}%`);
      if (category && category !== "All") query = query.eq("category", category);

      const { data, error, count } = await query.range(start, end);

      if (error) throw error;
      return {
        data,
        page,
        total: count,
        search,
        category,
        cacheKey: buildProductCacheKey({ page, search, category }),
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* Fetch all products for admin dashboard */
export const fetchAllProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(PRODUCT_COLUMNS)
        .order("name", { ascending: true });

      if (error) throw error;
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addProduct = createAsyncThunk("products/add", async (product) => {
  const { data, error } = await supabase
    .from("products")
    .insert([product])
    .select(PRODUCT_COLUMNS)
    .single();

  if (error) throw error;
  notify.success("Product added successfully!");
  return data;
});

export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, updates }) => {
    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select(PRODUCT_COLUMNS)
      .single();

    if (error) throw error;
    notify.info("Product updated successfully!");
    return data;
  }
);

export const deleteProduct = createAsyncThunk("products/delete", async (id) => {
  const { data: product, error: fetchError } = await supabase
    .from("products")
    .select("image_url")
    .eq("id", id)
    .single();
  if (fetchError) throw fetchError;
  if (!product) throw new Error("Product not found");

  const imageUrl = product.image_url;
  if (imageUrl) {
    const path = imageUrl.split("/product-images/")[1];
    if (path) {
      const { error: storageError } = await supabase.storage
        .from("product-images")
        .remove([path]);
      if (storageError) console.error("Storage delete failed:", storageError);
    }
  }

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
  notify.success("Product & image deleted!");
  return id;
});

const initialState = {
  pages: {},
  total: 0,
  allProducts: [],
  loading: false,
  pageLoading: false,
  allLoading: false,
  error: null,
};

export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProducts: (state) => {
      state.pages = {};
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state, action) => {
        const cacheKey = buildProductCacheKey(action.meta.arg);
        const isCached = Boolean(state.pages[cacheKey]);
        if (isCached) {
          state.pageLoading = true;
        } else {
          state.loading = true;
        }
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.pageLoading = false;
        const { data, total, cacheKey } = action.payload;
        state.pages[cacheKey] = data;
        state.total = total;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        // If the request was intentionally aborted (e.g. effect cleanup in StrictMode),
        // do not clear loading or set an error — another fetch is taking over.
        if (action.meta.aborted) return;
        state.loading = false;
        state.pageLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllProducts.pending, (state) => {
        state.allLoading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.allLoading = false;
        state.allProducts = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.allLoading = false;
        state.error = action.payload;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.allProducts.unshift(action.payload);
        Object.keys(state.pages).forEach((key) => {
          state.pages[key].unshift(action.payload);
        });
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const updated = action.payload;
        const allIndex = state.allProducts.findIndex((p) => p.id === updated.id);
        if (allIndex !== -1) state.allProducts[allIndex] = updated;
        Object.keys(state.pages).forEach((page) => {
          const index = state.pages[page].findIndex((p) => p.id === updated.id);
          if (index !== -1) state.pages[page][index] = updated;
        });
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.allProducts = state.allProducts.filter(
          (p) => p.id !== action.payload
        );
        Object.keys(state.pages).forEach((page) => {
          state.pages[page] = state.pages[page].filter(
            (p) => p.id !== action.payload
          );
        });
      });
  },
});

export const { clearProducts } = productSlice.actions;
export default productSlice.reducer;
