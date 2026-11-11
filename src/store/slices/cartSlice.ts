import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ReduxCartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

interface CartState {
  items: ReduxCartItem[];
  lastAddedAt: number | null;
}

const initialState: CartState = {
  items: [],
  lastAddedAt: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    syncCart(state, action: PayloadAction<ReduxCartItem[]>) {
      state.items = action.payload;
    },
    itemAdded(state) {
      state.lastAddedAt = Date.now();
    },
    clearCartState(state) {
      state.items = [];
      state.lastAddedAt = null;
    },
  },
});

export const { syncCart, itemAdded, clearCartState } = cartSlice.actions;
export const selectCartCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
export default cartSlice.reducer;
