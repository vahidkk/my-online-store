import { getCookie, setCookie, removeCookie } from "./cookies";
import { endpoint } from "../utils/constants";

// finding the Cart ID from cookie of create a new one : ###################################

export async function FindTheCartID(mounted = true) {
  if (getCookie("MyCartAsGuest").length > 0) {
    return getCookie("MyCartAsGuest");
  } else if (mounted) {
    const newCart = await fetch(endpoint + "/carts/", {
      method: "POST",
    });

    const response = await newCart.json();
    const newCartId = response.id;
    setCookie("MyCartAsGuest", newCartId);
    return newCartId;
  }
}
