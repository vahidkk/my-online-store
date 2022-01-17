import { endpoint } from "../utils/constants";

import { useRef, useEffect, useState, useCallback } from "react";
import useSWR, { mutate, trigger } from "swr";
import { LoadCartContent } from "./LoadCartContent";
// export async function AddToCartHandler({ props }, cartID) {

async function fetchPostNewItem(cartID, itemID) {
  const res = await fetch(`${endpoint}/carts/${cartID}/items/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product_id: itemID,
      quantity: 1,
    }),
  });
  const postResponse = await res.json();

  if (!res.ok) throw res.statusText;
  return postResponse;
}

const useAddToCartHandler = (cartID) => {
  const [errorOccured, setErrorOccured] = useState({
    errorCode: null,
    itemCode: null,
    actionType: null,
  });

  const { data, isLoading, isError, isValidating } = LoadCartContent(
    true,
    cartID
  );
  // if (!props) {
  //   return errorOccured;
  // }
  const saveInstanceOfDataBeforeAddToCartClick = data;
  // const cartID = "679fe9ef-d27c-45d2-86f8-db56908048d4";
  const mutateAndFetchAddToCart = async (
    props,
    needsRevalidate = false,
    usingRandomID = false
  ) => {
    const itemID = props.id;
    setErrorOccured;

    try {
      await mutate(
        // `${endpoint}/carts/${data.id}`,
        `${endpoint}/carts/${cartID}`,
        {
          ...data,
          total_price: (
            parseFloat(data.total_price) + parseFloat(props.regular_price)
          ).toFixed(2),
          itemss:
            data.itemss.filter(
              (z) => parseInt(z.product.id) === parseInt(props.id)
            ).length === 1
              ? data.itemss.map((x) => {
                  if (parseInt(x.product.id) === parseInt(props.id)) {
                    return {
                      ...x,
                      quantity: parseInt(x.quantity) + 1,
                      total_price: (
                        parseFloat(x.total_price) +
                        parseFloat(x.product.regular_price)
                      ).toFixed(2),
                    };
                  } else {
                    return x;
                  }
                })
              : data.itemss.concat({
                  id: usingRandomID ? new Date().getUTCMilliseconds() : 0,
                  product: {
                    id: props.id,
                    title: props.title,
                    regular_price: props.regular_price,
                    slug: props.slug,
                    product_image: props.product_image,
                  },
                  quantity: 1,
                  total_price: props.regular_price,
                }),
        },
        needsRevalidate ? true : false
      );
      if (cartID) {
        const responseOfCreatingNewItem = await fetchPostNewItem(
          cartID,
          itemID
        );

        return responseOfCreatingNewItem;
      }
    } catch (err) {
      setErrorOccured({
        errorCode: err,
        itemCode: props.id,
        actionType: "add",
      });
      mutate(
        // `${endpoint}/carts/${data.id}`,
        `${endpoint}/carts/${cartID}`,
        { ...saveInstanceOfDataBeforeAddToCartClick },
        true
      );
    }
  };
  return [mutateAndFetchAddToCart, errorOccured];
  // start of  implementing tooltip for error :
  // const [errorVisible, setErrorVisible] = useState(false);
  // const {
  //   getArrowProps,
  //   getTooltipProps,
  //   setTooltipRef,
  //   setTriggerRef,
  //   visible,
  // } = usePopperTooltip({
  //   trigger: "click",
  //   closeOnOutsideClick: true,
  //   visible: errorVisible,
  //   onVisibleChange: setErrorVisible,
  // });

  // return (
  //   <>
  //     <i
  //       className="fas fa-cart-plus"
  //       ref={
  //         errorOccured.itemCode === props.id &&
  //         errorOccured.actionType === "add"
  //           ? setTriggerRef
  //           : null
  //       }
  //       onClick={() => {
  //         addToCartHandler();
  //       }}
  //     ></i>
  //     {errorOccured.itemCode === props.post.id &&
  //       errorOccured.actionType === "add" && (
  //         <ShowErrorTooltip
  //           props={{
  //             errorOccured,
  //             post,
  //             setTooltipRef,
  //             getTooltipProps,
  //             getArrowProps,
  //             customErrorText: "add",
  //           }}
  //         />
  //       )}
  //   </>
  // );
};
export default useAddToCartHandler;
