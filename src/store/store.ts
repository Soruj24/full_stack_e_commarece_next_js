import { configureStore } from "@reduxjs/toolkit";
import homeReducer from "./slices/homeSlice";
import cartReducer from "./slices/cartSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      home: homeReducer,
      cart: cartReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
