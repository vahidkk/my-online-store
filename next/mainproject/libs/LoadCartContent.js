// import { useRef, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";

export function LoadCartContent(mounted = true, cartID) {
  const router = useRouter();
  const { data, error, isValidating } = useSWR(
    mounted && cartID ? `http://127.0.0.1:8000/api/carts/${cartID}` : null
  );
  //handle error when there is cart id on explorer's cookie but no such a cart id is available  on server ( cart id accidentally removed from server ):
  try {
    if (data.detail === "Not found.") {
      data = {
        id: "0",
        itemss: [
          {
            id: 0,
            product: {
              id: 0,
              title: "0",
              regular_price: "0",
              slug: "0",
              product_image: [
                {
                  image:
                    "http://127.0.0.1:8000/media/images/imageseeee_IGQHQ5W.jpg",
                  alt_text: null,
                },
              ],
            },
            quantity: 0,
            total_price: 0,
          },
        ],
        total_price: 0,
      };
      removeCookie("MyCartAsGuest");
      getCookie("MyCartAsGuest").length < 1 ? router.reload(0) : null;
    }
  } finally {
    return {
      data,
      isLoading: !error && !data,
      isError: error,
      isValidating,
      cartLength: data
        ? data.itemss[0] &&
          data.itemss.map((x) => x.quantity).reduce((a, b) => a + b)
        : 0,
      mutate,
    };
  }
}
