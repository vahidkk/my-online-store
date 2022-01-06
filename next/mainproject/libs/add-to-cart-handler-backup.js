export function AddToCart({ props }) {
  const [cartID, setCartID] = useState(null);
  useEffect(() => {
    async function loadData() {
      setCartID(await FindTheCartID(true));
    }
    loadData();
  });

  const [errorOccured, setErrorOccured] = useState({
    errorCode: null,
    itemCode: null,
    actionType: null,
  });

  const itemID = props.post.id;
  const { data, isLoading, isError } = LoadCartContent(true, cartID);
  console.log("DATA1:", data);
  const addToCartHandler = async () => {
    const saveInstanceOfDataBeforeAddToCartClick = data;
    // const cartID = "679fe9ef-d27c-45d2-86f8-db56908048d4";
    if (data) {
      console.log("DATA2:", data);
      setErrorOccured;
      try {
        mutate(
          `http://127.0.0.1:8000/api/carts/${data.id}`,
          {
            ...data,
            total_price: (
              parseFloat(data.total_price) +
              parseFloat(props.post.regular_price)
            ).toFixed(2),
            itemss:
              data.itemss.filter(
                (z) => parseInt(z.product.id) === parseInt(props.post.id)
              ).length === 1
                ? data.itemss.map((x) => {
                    if (parseInt(x.product.id) === parseInt(props.post.id)) {
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
                    id: new Date().getUTCMilliseconds(),
                    // id: 101010,
                    product: {
                      id: props.post.id,
                      title: props.post.title,
                      regular_price: props.post.regular_price,
                      slug: props.post.slug,
                      product_image: props.post.product_image,
                    },
                    quantity: 1,
                    total_price: props.post.regular_price,
                  }),
          },
          false
        );
        console.log("DATA3:", data);

        if (cartID) {
          const res = await fetch(
            `http://127.0.0.1:8000/api/carts/${cartID}/items/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                product_id: itemID,
                quantity: 1,
              }),
            }
          );
          const postResponse = await res.json();
          console.log("DATA4:", data);

          console.log("POST res.ok?", postResponse);
          if (!res.ok) throw res.statusText;
        }
      } catch (err) {
        setErrorOccured({
          errorCode: err,
          itemCode: post.id,
          actionType: "add",
        });
        console.log("POST error is : ", err);
        console.log("POST error is  errorOccured: ", errorOccured);
        mutate(
          `http://127.0.0.1:8000/api/carts/${data.id}`,
          { ...saveInstanceOfDataBeforeAddToCartClick },
          true
        );
      }
    }
  };
  // start of  implementing tooltip for error :
  const [errorVisible, setErrorVisible] = useState(false);
  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip({
    trigger: "click",
    closeOnOutsideClick: true,
    visible: errorVisible,
    onVisibleChange: setErrorVisible,
  });

  // return (
  //   <>
  //     <i
  //       className="fas fa-cart-plus"
  //       ref={
  //         errorOccured.itemCode === props.post.id &&
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
}
