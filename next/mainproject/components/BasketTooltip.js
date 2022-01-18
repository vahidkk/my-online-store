import { endpoint } from "../utils/constants";
import Link from "next/dist/client/link";
import { useRef, useEffect, useState, useCallback } from "react";
import { usePopperTooltip } from "react-popper-tooltip";
import { createContext, useContext } from "react";
import { FindTheCartID } from "../libs/FindTheCartID";
import useSWR, { mutate, trigger } from "swr";
import router, { useRouter } from "next/router";
import { changeCartID } from "../store/cartID/action";
import { wrapper } from "../store/store";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { LoadCartContent } from "../libs/LoadCartContent";
import ShowErrorTooltip from "./ShowErrorTooltip";
import cart from "../public/green-icons/cart.png";
import Image from "next/image";

const CloseBoxContext = createContext();

function CartPopper({ myCartID, changeCartID }) {
  const [continueShoppingCloseBox, setContinueShoppingCloseBox] =
    useState(false);

  const [generatedCartID, setgeneratedCartID] = useState(null);
  useEffect(() => {
    async function loadData() {
      changeCartID({
        CHANGE: myCartID === null ? true : false,
        VALUE: myCartID === null ? await FindTheCartID(true) : null,
      });
    }
    loadData();
  }, []);
  return (
    <CloseBoxContext.Provider
      value={{
        continueShoppingCloseBox,
        setContinueShoppingCloseBox,
      }}
    >
      <CartTooltip2 myCartID={myCartID} />
    </CloseBoxContext.Provider>
  );
}

// #############################################

function CartContent({ myCartID }) {
  const initialCartItem = {
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
              image: "/Eclipse-1s-211px.svg",
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
  // const { uuid } = require("uuidv4");
  // let tempKeyID = uuid();
  const [isSaving, setIsSaving] = useState(false);
  const [errorOccured, setErrorOccured] = useState({
    errorCode: null,
    itemCode: null,
    actionType: null,
  });

  const [moreThan300Matches, setMoreThan300Matches] = useState(null);
  const [moreThan576Matches, setMoreThan576Matches] = useState(null);
  const closeBoxUseContext = useContext(CloseBoxContext);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMoreThan300Matches(window.matchMedia("(max-width: 300px)").matches);
    setMoreThan576Matches(window.matchMedia("(max-width: 576px)").matches);
    window
      .matchMedia("(max-width: 300px)")
      .addEventListener("change", (e) => setMoreThan300Matches(e.matches));
    window
      .matchMedia("(max-width: 576px)")
      .addEventListener("change", (e) => setMoreThan576Matches(e.matches));
  }, []);

  const { data, isLoading, isError } = LoadCartContent(
    // mounted,
    true,
    myCartID
  );

  const [deleteState, setDeleteState] = useState({
    order: false,
    done: false,
    id: null,
  });

  const itemDeleteHandler = async (i) => {
    setDeleteState({ id: i.id, order: true, done: false });
    setIsSaving(true);
    const saveInstanceOfDataBeforeDeletion = data;
    setErrorOccured;
    try {
      mutate(
        `${endpoint}/carts/${data.id}`,
        {
          ...data,
          total_price: (data.total_price - i.total_price).toFixed(2),
          itemss: data.itemss.filter((x) => x.id !== i.id),
        },
        false
      );
      const res = await fetch(`${endpoint}/carts/${data.id}/items/${i.id}/`, {
        method: "DELETE",
      });
      setDeleteState({ ...deleteState, order: false, done: true });
      setIsSaving(false);
      if (!res.ok) throw res.statusText;
    } catch (err) {
      // if any error, revert the changes:
      mutate(
        `${endpoint}/carts/${data.id}`,
        { ...saveInstanceOfDataBeforeDeletion },
        true
      );

      setErrorOccured({
        errorCode: err,
        itemCode: i.id,
        actionType: "delete",
      });
    }
  };
  const itemPlusButtonHandler = async (i) => {
    // setDeleteState({ id: i.id, order: true, done: false });
    setIsSaving(true);
    const saveInstanceOfDataBeforePlusButtonClick = data;
    setErrorOccured;
    try {
      mutate(
        `${endpoint}/carts/${data.id}`,

        {
          ...data,
          total_price: (
            parseFloat(data.total_price) + parseFloat(i.product.regular_price)
          ).toFixed(2),
          // .toFixed(2)
          itemss: data.itemss.map((x) => {
            if (x.id === i.id) {
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
          }),
        },
        false
      );
      const res = await fetch(`${endpoint}/carts/${data.id}/items/${i.id}/`, {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          quantity: parseInt(i.quantity) + 1,
        }),
      });
      const patchResponse = await res.json();

      setIsSaving(false);
      if (!res.ok) throw res.statusText;
    } catch (err) {
      // if any error, revert the changes:
      mutate(
        `${endpoint}/carts/${data.id}`,
        { ...saveInstanceOfDataBeforePlusButtonClick },
        true
      );
      setErrorOccured({
        errorCode: err,
        itemCode: i.id,
        actionType: "increase",
      });
    }
  };

  const itemMinusButtonHandler = async (i) => {
    // setDeleteState({ id: i.id, order: true, done: false });
    setIsSaving(true);
    const saveInstanceOfDataBeforePlusButtonClick = data;
    setErrorOccured;
    try {
      mutate(
        `${endpoint}/carts/${data.id}`,
        {
          ...data,
          total_price: (
            parseFloat(data.total_price) - parseFloat(i.product.regular_price)
          ).toFixed(2),
          // .toFixed(2)
          itemss: data.itemss.map((x) => {
            if (x.id === i.id) {
              return {
                ...x,
                quantity: parseInt(x.quantity) - 1,
                total_price: (
                  parseFloat(x.total_price) -
                  parseFloat(x.product.regular_price)
                ).toFixed(2),
              };
            } else {
              return x;
            }
          }),
        },
        false
      );
      const res = await fetch(`${endpoint}/carts/${data.id}/items/${i.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity: parseInt(i.quantity) - 1,
        }),
      });
      const patchResponse = await res.json();

      setIsSaving(false);
      if (!res.ok) throw res.statusText;
    } catch (err) {
      // if any error, revert the changes:
      mutate(
        `${endpoint}/carts/${data.id}`,
        { ...saveInstanceOfDataBeforePlusButtonClick },
        true
      );
      setErrorOccured({
        errorCode: err,
        itemCode: i.id,
        actionType: "decrease",
      });
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
  return (
    <>
      <div className="cart-scroll container   cart-box  ">
        {isLoading ? (
          <div className="d-flex justify-content-center">
            <div className="spinner-border m-5" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : isError ? (
          <div className="d-flex justify-content-center m-5">
            <p>{isError}</p>
          </div>
        ) : (
          data &&
          data.itemss.length < 1 && (
            <div className="d-flex justify-content-center m-5">
              <p> Cart is empty !</p>
            </div>
          )
        )}
        {data && data.itemss.length > 0 && (
          <>
            <div className="row mx-0 px-0 product-cart-tooltip ">
              <div className="col me-1 mt-1 px-0 h3">Product</div>
              <div className="col me-1 mt-1 px-0 h3 ">Quantity</div>
              <div className="col me-1 mt-1 px-0 h3">Price</div>
              <div className="col me-0 mt-1 px-0 h3">Total</div>

              <div className="col me-0 px-0 h3">
                <div className="d-flex  align-items-center mt-1">
                  <span className="display-only-on-more-than-xxs me-1">
                    <strong>{isSaving ? "Updating" : "Updated "}</strong>
                  </span>

                  {isSaving ? (
                    <div
                      className="spinner-grow text-warning  spinner-grow-sm  ms-2
                      "
                      role="status"
                      aria-hidden="true"
                    ></div>
                  ) : (
                    <i className="far fa-check-circle spinner-border-sm text-success "></i>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
        {data &&
          data.itemss.map((i) => (
            <span
              key={i.id}
              className="active-background-change"
              // onClick={(e) => e.target.blur()}
              // onMouseDown={(event) => {
              //   event.preventDefault();
              // }}
            >
              <div className="border rounded-2 mb-2  ps-2 py-2 each-cart-element  ">
                <div
                  className="row mb-1 row-cols-auto product-cart-tooltip background-unset "
                  style={{ maxWidth: "99%" }}
                >
                  <div className="col text-wrap lh-1 background-unset text-truncate ">
                    <Link href={"../product/" + i.product.slug}>
                      <a className="h3  text-truncate" title={i.product.title}>
                        {i.product.title}
                      </a>
                    </Link>
                  </div>
                </div>
                <div className="row product-cart-tooltip background-unset ps-0 ms-0  ">
                  <div className="col col-xs-2 background-unset p-0 m-0 ">
                    <Link href={"../product/" + i.product.slug}>
                      <a className="thumbnail ps-0 ">
                        <img
                          className="img-fluid cart-box-image ms-0"
                          src={i.product.product_image[0].image}
                          title={i.product.title}
                          alt={i.product.title}
                        />
                      </a>
                    </Link>
                  </div>
                  <div className="col px-0 col-xs-2 d-inline background-unset">
                    <div className="d-flex ">
                      <div className="display-only-on-xxs  me-1 ">
                        <span className="min-with-for-quantity">
                          <small>{i.quantity}</small>
                        </span>
                      </div>

                      <div>
                        <div className="row py-0 m-0">
                          <span className=" display-only-on-xxs increase-decrease-button-xxs   background-unset p-0 m-0 decrease-height-xxs">
                            <button
                              type="button"
                              ref={
                                moreThan300Matches &&
                                errorOccured.itemCode === i.id &&
                                errorOccured.actionType === "increase"
                                  ? setTriggerRef
                                  : null
                              }
                              onMouseDown={(event) => {
                                event.preventDefault();
                              }}
                              onClick={(event) => {
                                event.preventDefault();
                                itemPlusButtonHandler(i);
                              }}
                              className="btn me-0 btn-success  "
                              data-type="plus"
                            >
                              <i
                                className="fas fa-plus more-padding-plus-xxs plus-minus-icon-font-size fas-bg-green
                                  "
                              ></i>
                            </button>

                            {moreThan300Matches &&
                              errorOccured.itemCode === i.id &&
                              errorOccured.actionType === "increase" && (
                                <ShowErrorTooltip
                                  props={{
                                    errorOccured,
                                    setErrorOccured,
                                    i,
                                    setTooltipRef,
                                    getTooltipProps,
                                    getArrowProps,
                                    customErrorText: "increase quantity of",
                                  }}
                                />
                              )}
                            {/* <span className=" display-only-on-xxs increase-decrease-button-xxs   background-unset"> */}
                            <button
                              type="button"
                              ref={
                                moreThan300Matches &&
                                errorOccured.itemCode === i.id &&
                                errorOccured.actionType === "decrease"
                                  ? setTriggerRef
                                  : null
                              }
                              onMouseDown={(event) => {
                                event.preventDefault();
                              }}
                              onClick={(event) => {
                                event.preventDefault();
                                itemMinusButtonHandler(i);
                              }}
                              className={`btn me-0 btn-danger  background-red ${
                                parseInt(i.quantity) === 1 && "disabled"
                              } `}
                              data-type="minus"
                            >
                              <i className="fas fa-minus more-padding-minus-xxs plus-minus-icon-font-size fas-bg-red"></i>
                            </button>
                            {moreThan300Matches &&
                              errorOccured.itemCode === i.id &&
                              errorOccured.actionType === "decrease" && (
                                <ShowErrorTooltip
                                  props={{
                                    errorOccured,
                                    setErrorOccured,
                                    i,
                                    setTooltipRef,
                                    getTooltipProps,
                                    getArrowProps,
                                    customErrorText: "decrease quantity of",
                                  }}
                                />
                              )}
                          </span>
                        </div>
                        {/* <div className="row py-0 m-0"> e </div> */}
                      </div>
                    </div>
                    {/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */}
                    {/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */}
                    {/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */}
                    {/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */}
                    <div className="  display-only-on-more-than-xxs ">
                      <span className="  ">
                        <button
                          type="button"
                          ref={
                            !moreThan300Matches &&
                            errorOccured.itemCode === i.id &&
                            errorOccured.actionType === "decrease"
                              ? setTriggerRef
                              : null
                          }
                          onClick={(event) => {
                            event.preventDefault();
                            itemMinusButtonHandler(i);
                            event.currentTarget.blur();
                          }}
                          className={`btn me-2 btn-danger  revert-active-background-change ${
                            parseInt(i.quantity) === 1 && "disabled"
                          } `}
                          data-type="minus"
                        >
                          <small className="">
                            <small>
                              <i className="fas  fa-minus more-padding-minus fas-bg-red  revert-active-background-change"></i>
                            </small>
                          </small>
                        </button>
                        {!moreThan300Matches &&
                          errorOccured.itemCode === i.id &&
                          errorOccured.actionType === "decrease" && (
                            <ShowErrorTooltip
                              props={{
                                errorOccured,
                                setErrorOccured,
                                i,
                                setTooltipRef,
                                getTooltipProps,
                                getArrowProps,
                                customErrorText: "decrease quantity of",
                              }}
                            />
                          )}
                      </span>
                      <small className="h3">{i.quantity}</small>
                      <span className="input-group-btn ">
                        <button
                          type="button"
                          ref={
                            !moreThan300Matches &&
                            errorOccured.itemCode === i.id &&
                            errorOccured.actionType === "increase"
                              ? setTriggerRef
                              : null
                          }
                          onClick={(event) => {
                            event.preventDefault();
                            itemPlusButtonHandler(i);
                            event.currentTarget.blur();
                          }}
                          className="cart-box-input fa-plus.revert-active-background-change btn ms-2 btn-success btn-number btn-sm background-green"
                          data-type="plus"
                        >
                          <small>
                            <small>
                              <i className="fas fa-plus more-padding-plus  fas-bg-green revert-active-background-change"></i>
                            </small>
                          </small>
                        </button>
                        {!moreThan300Matches &&
                          errorOccured.itemCode === i.id &&
                          errorOccured.actionType === "increase" && (
                            <ShowErrorTooltip
                              props={{
                                errorOccured,
                                setErrorOccured,
                                i,
                                setTooltipRef,
                                getTooltipProps,
                                getArrowProps,
                                customErrorText: "increase quantity of",
                              }}
                            />
                          )}
                      </span>
                    </div>

                    <div className="child-overflow h3 mt-2 ">
                      <small>
                        <span>Status: </span>
                        <span
                          className={` ${
                            i.product.available_quantity < 2
                              ? "text-danger"
                              : i.product.available_quantity < 4
                              ? "text-danger"
                              : "text-success"
                          }`}
                        >
                          <strong>
                            {i.product.available_quantity < 2
                              ? " 1 left!"
                              : i.product.available_quantity < 4
                              ? "3 left!"
                              : "In stock"}
                          </strong>
                        </span>
                      </small>
                    </div>
                  </div>
                  <div className="col px-0 col-xs-2 h3 align-self-center change-price-alignment-xxs ">
                    <strong>${i.product.regular_price}</strong>
                  </div>
                  <div className="col px-0 col-xs-2 h3 align-self-center change-price-alignment-xxs ">
                    <strong>${i.total_price}</strong>
                  </div>

                  <div className="col align-self-top  display-only-on-xxs background-unset ">
                    <button
                      type="button"
                      ref={
                        moreThan300Matches &&
                        errorOccured.itemCode === i.id &&
                        errorOccured.actionType === "delete"
                          ? setTriggerRef
                          : null
                      }
                      className={
                        deleteState.order && deleteState.id === i.id
                          ? "btn mx-0 my-0 btn-danger cart-box-input btn-sm background-red disabled"
                          : "btn mx-0 my-0 btn-danger cart-box-input btn-sm background-red "
                      }
                      onClick={(event) => {
                        event.preventDefault();
                        itemDeleteHandler(i);
                      }}
                    >
                      {deleteState.order && deleteState.id === i.id ? (
                        <div
                          className="spinner-border spinner-border-sm"
                          role="status"
                        >
                          <span className="sr-only">Loading...</span>
                        </div>
                      ) : (
                        <small>
                          <i className="far fa-trash-alt"></i>
                        </small>
                      )}
                    </button>
                    {moreThan300Matches &&
                      errorOccured.itemCode === i.id &&
                      errorOccured.actionType === "delete" && (
                        <ShowErrorTooltip
                          props={{
                            errorOccured,
                            setErrorOccured,
                            i,
                            setTooltipRef,
                            getTooltipProps,
                            getArrowProps,
                          }}
                        />
                      )}
                  </div>

                  <div className="col  col-xs-2 h3 display-only-on-more-than-xxs px-0 background-unset align-self-center  ">
                    <span className="remove-icon-show-only-on-small-or-more">
                      <button
                        type="button"
                        ref={
                          !moreThan300Matches &&
                          !moreThan576Matches &&
                          errorOccured.itemCode === i.id &&
                          errorOccured.actionType === "delete"
                            ? setTriggerRef
                            : null
                        }
                        className={
                          deleteState.order && deleteState.id === i.id
                            ? "btn  btn-danger px-1 background-red disabled"
                            : "btn  btn-danger px-1 background-red"
                        }
                        onClick={(event) => {
                          event.preventDefault();
                          itemDeleteHandler(i);
                        }}
                      >
                        <small className="align-top background-unset remove-key-text">
                          {deleteState.order && deleteState.id === i.id ? (
                            <div
                              className="spinner-border spinner-border-sm mx-2"
                              role="status"
                            >
                              <span className="sr-only">Loading...</span>
                            </div>
                          ) : (
                            "Remove"
                          )}
                        </small>
                      </button>
                      {!moreThan300Matches &&
                        !moreThan576Matches &&
                        errorOccured.itemCode === i.id &&
                        errorOccured.actionType === "delete" && (
                          <ShowErrorTooltip
                            props={{
                              errorOccured,
                              setErrorOccured,
                              i,
                              setTooltipRef,
                              getTooltipProps,
                              getArrowProps,
                            }}
                          />
                        )}
                    </span>
                    <span className="remove-icon-show-only-on-xxsmall-and-midsmall  background-unset">
                      <button
                        type="button"
                        ref={
                          !moreThan300Matches &&
                          moreThan576Matches &&
                          errorOccured.itemCode === i.id &&
                          errorOccured.actionType === "delete"
                            ? setTriggerRef
                            : null
                        }
                        className={
                          deleteState.order && deleteState.id === i.id
                            ? "btn  background-red btn-danger btn-sm ps-1 disabled"
                            : "btn  background-red btn-danger btn-sm px-0"
                        }
                        onClick={(event) => {
                          event.preventDefault();
                          itemDeleteHandler(i);
                        }}
                      >
                        {deleteState.order && deleteState.id === i.id ? (
                          <div
                            className="spinner-border spinner-border-sm mx-1"
                            role="status"
                          >
                            <span className="sr-only">Loading...</span>
                          </div>
                        ) : (
                          <i className="far fa-trash-alt more-padding-trash background-red  fas-bg-red"></i>
                        )}
                      </button>

                      {!moreThan300Matches &&
                        moreThan576Matches &&
                        errorOccured.itemCode === i.id &&
                        errorOccured.actionType === "delete" && (
                          <ShowErrorTooltip
                            props={{
                              errorOccured,
                              setErrorOccured,
                              i,
                              setTooltipRef,
                              getTooltipProps,
                              getArrowProps,
                            }}
                          />
                        )}
                    </span>
                  </div>
                </div>
              </div>
            </span>
          ))}{" "}
        <div className="row">
          <div className="col"> </div>
          <div className="col"> </div>

          <div className="col"> </div>
          <div className="col"></div>
          <div className="col"></div>
        </div>
        <div className="row">
          <div className="col"> </div>
          <div className="col"> </div>
          <div className="col"> </div>
          <div className="col"></div>
          <div className="col"></div>
        </div>
        <div className="d-grid gap-4 d-flex justify-content-end">
          <h3>Total:</h3>
          <h3>
            <strong>
              ${data ? Number.parseFloat(data.total_price).toFixed(2) : "0"}
            </strong>
          </h3>
        </div>
        <div className="d-grid gap-1 d-flex justify-content-end">
          <button
            onClick={() => {
              closeBoxUseContext.setContinueShoppingCloseBox(false);
            }}
            onTouchEnd={() => {
              closeBoxUseContext.setContinueShoppingCloseBox(false);
            }}
            type="button"
            className="btn me-2 ms-0 btn-secondary btn-sm"
          >
            Continue Shopping
          </button>
          <button
            type="button"
            onClick={(event) => {
              closeBoxUseContext.setContinueShoppingCloseBox(false);
              event.preventDefault();
              router.push("/checkout");
            }}
            onTouchEnd={(event) => {
              closeBoxUseContext.setContinueShoppingCloseBox(false);
              event.preventDefault();
              router.push("/checkout");
            }}
            className={
              isLoading || !data || data.itemss.length < 1
                ? "btn ms-2 btn-success btn-sm disabled"
                : "btn ms-2 btn-success btn-sm"
            }
          >
            Check Out
          </button>
        </div>
      </div>
    </>
  );
}

// #############################################
export function CartTooltip2({ myCartID }) {
  const [ttipContentMounted, setTtipContentMounted] = useState(false);
  const [controlledVisible, setControlledVisible] = useState(false);

  const closeBoxUseContext = useContext(CloseBoxContext);
  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip({
    trigger: "click",
    closeOnOutsideClick: true,
    closeOnTriggerHidden: true,
    delayHide: 100,
    followCursor: false,
    visible: closeBoxUseContext.continueShoppingCloseBox,
    onVisibleChange: setMountedOnceVisible,
    interactive: true,
  });

  function setMountedOnceVisible(visible) {
    closeBoxUseContext.setContinueShoppingCloseBox(visible);
    if (!ttipContentMounted && visible) {
      setTtipContentMounted(true);
    }
  }
  // start of implementing close on ESC key press:

  useEffect(() => {
    const handleKeyDown = ({ key }) => {
      if (key === "Escape") {
        closeBoxUseContext.setContinueShoppingCloseBox(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  // end of ESC ...
  const { cartLength } = LoadCartContent(true, myCartID);

  return (
    <div className="App">
      <span type="button" ref={setTriggerRef}>
        {/* <i
          key="fa1"
          className="fa fa-fw fa-cart-arrow-down text-dark mr-1  px-md-3 mt-1"
        ></i> */}
        <Image
          src={cart}
          alt={"cart"}
          width={30}
          height={30}
          // layout="responsive"
        />
        <span className="position-absolute top-0 left-100 translate-middle badge rounded-pill bg-light text-dark">
          {cartLength}
        </span>
      </span>

      {1 === 1 && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({
            className: "tooltip-container",
            style: visible
              ? {
                  visibility: "visible",
                }
              : { visibility: "hidden" },
          })}
        >
          <div {...getArrowProps({ className: "tooltip-arrow" })} />
          <CartContent myCartID={myCartID} />
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  myCartID: state.myCartID.myCartID,
});

const mapDispatchToProps = (dispatch) => {
  return {
    changeCartID: bindActionCreators(
      (generatedCartID) => changeCartID(generatedCartID),
      dispatch
    ),
  };
};

// export default CartPopper;
export default connect(mapStateToProps, mapDispatchToProps)(CartPopper);
