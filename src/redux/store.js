import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice"
import authReducer from "./slices/authSlice";
import profileReducer from "./slices/profileSlice"
import ordersReducer from "./slices/ordersSlice"
import cartReducer from "./slices/cartSlice"
import favouritesReducer from "./slices/favouriteSlice"

export const store = configureStore({
    reducer:{
        products:productReducer,
        auth:authReducer,
        profile:profileReducer,
        orders:ordersReducer,
        cart:cartReducer,
        favourites:favouritesReducer, 
    }
})