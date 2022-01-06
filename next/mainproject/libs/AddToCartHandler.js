import { useRef, useEffect, useState, useCallback } from "react";
import useSWR, { mutate, trigger } from "swr";
import { LoadCartContent } from "./LoadCartContent";
// export async function AddToCartHandler({ props }, cartID) {

async function fetchPostNewItem(cartID, itemID) {
  const res = await fetch(`http://127.0.0.1:8000/api/carts/${cartID}/items/`, {
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
  // console.log("DATA4:", data);

  console.log("POST res.ok?", postResponse);
  if (!res.ok) throw res.statusText;
  return postResponse;
}

const useAddToCartHandler = (cartID) => {
  // console.log("props & cartID", props, cartID);

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
  console.log("DATA1:", data);
  const saveInstanceOfDataBeforeAddToCartClick = data;
  // const cartID = "679fe9ef-d27c-45d2-86f8-db56908048d4";
  const mutateAndFetchAddToCart = async (
    props,
    needsRevalidate = false,
    usingRandomID = false
  ) => {
    const itemID = props.id;
    console.log("DATA2:", data);
    setErrorOccured;

    try {
      await mutate(
        // `http://127.0.0.1:8000/api/carts/${data.id}`,
        `http://127.0.0.1:8000/api/carts/${cartID}`,
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
      console.log("DATA3:", data);
      if (cartID) {
        //       mutateFirstly &&
        // (await mutate(`http://127.0.0.1:8000/api/carts/${cartID}`));
        const responseOfCreatingNewItem = await fetchPostNewItem(
          cartID,
          itemID
        );
        // mutate(`http://127.0.0.1:8000/api/carts/${data.id}`);
        // if (responseOfCreatingNewItem.id !== data.items.id) {
        // log(
        //   "cartItemIDForNewItems  old id vs new id :",
        //   data.items.id,
        //   responseOfCreatingNewItem.id
        // );
        // }
        return responseOfCreatingNewItem;
      }
    } catch (err) {
      setErrorOccured({
        errorCode: err,
        itemCode: props.id,
        actionType: "add",
      });
      console.log("POST error is : ", err);
      console.log("POST error is  errorOccured: ", errorOccured);
      mutate(
        // `http://127.0.0.1:8000/api/carts/${data.id}`,
        `http://127.0.0.1:8000/api/carts/${cartID}`,
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
