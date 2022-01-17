import { endpoint } from "../utils/constants";
import { getCookie, setCookie } from "./cookies";
import useSWR, { mutate, trigger } from "swr";

// export const CartManager = async (mounted) => {
async function FindTheCratID(mounted) {
  // getCookie(key)
  // setCookie(key, value)

  if (getCookie("MyCartAsGuest").length < 1) {
    const newCart = await fetch(`${endpoint}/carts/`, {
      // const newCart = await fetch("https://reqres.in/api/posts", {
      method: "POST",
      // headers: { "Content-Type": "application/json" },
      // headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const response = await newCart.json();
    const newCartId = response.id;
    setCookie("MyCartAsGuest", newCartId);
    return response.id;
  }
}
function LoadCartContent(mounted) {
  const { data, error } = useSWR(
    mounted ? `${endpoint}/carts/${currentCartId}` : null
  );

  return {
    user: data,
    isLoading: !error && !data,
    isError: error,
  };
}
