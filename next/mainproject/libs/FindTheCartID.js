import { getCookie, setCookie, removeCookie } from "./cookies";

// finding the Cart ID from cookie of create a new one : ###################################

export async function FindTheCartID(mounted = true) {
  if (getCookie("MyCartAsGuest").length > 0) {
    return getCookie("MyCartAsGuest");
  } else if (mounted) {
    const newCart = await fetch("http://127.0.0.1:8000/api/carts/", {
      method: "POST",
    });

    const response = await newCart.json();
    const newCartId = response.id;
    console.log("newCartId", newCartId);
    setCookie("MyCartAsGuest", newCartId);
    return newCartId;
  }
}
