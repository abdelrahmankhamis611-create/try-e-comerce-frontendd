import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "../../features/auth/authSlice";
import cartReducer from "../../features/cart/cartSlice";
import wishlistReducer from "../../features/wishlist/wishlistSlice";
import productReducer from "../../features/products/productSlice";
import categoryReducer from "../../features/categories/categorySlice";
import subCategoryReducer from "../../features/subCategories/subcategorySlice";
import orderReducer from "../../features/orders/orderSlice";
import brandReducer from "../../features/brands/brandSlice";
import userAdminReducer from "../../features/adminUsers/userAdminSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  products: productReducer,
  categories: categoryReducer,
  subCategories: subCategoryReducer,
  orders: orderReducer,
  brands: brandReducer,
  adminUsers: userAdminReducer,
});

export default rootReducer;