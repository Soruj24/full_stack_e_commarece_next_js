"use client";

import { useEffect } from "react";
import { useCart } from "@/modules/cart/context/CartContext";
import { useAppDispatch } from "@/store/hooks";
import { syncCart } from "@/store/slices/cartSlice";

export function HomeReduxBridge() {
  const { cart } = useCart();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      syncCart(
        cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
        }))
      )
    );
  }, [cart, dispatch]);

  return null;
}
