import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/dist/client/link";
import { useRef, useEffect, useState, useCallback } from "react";
import { usePopperTooltip } from "react-popper-tooltip";
import { FindTheCartID } from "../libs/FindTheCartID";
import useSWR, { mutate, trigger } from "swr";
import { changeCartID } from "../store/cartID/action";
import { wrapper } from "../store/store";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { LoadCartContent } from "../libs/LoadCartContent";
import ShowErrorTooltip from "../components/ShowErrorTooltip";
import useAddToCartHandler from "../libs/AddToCartHandler";
import { normalizeRouteRegex } from "next/dist/lib/load-custom-routes";

function Checkout({ myCartID }) {
  const router = useRouter();

  // if (router.isFallback) {
  //   return <div>Loading...</div>;
  // }
  const post = {
    id: 0,
    title: "0",
    regular_price: "0",
    slug: "0",
    product_image: [
      {
        image: "http://127.0.0.1:8000/media/images/imageseeee_IGQHQ5W.jpg",
        alt_text: null,
      },
    ],
  };
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
  const i = {
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

  const { data, isLoading, isError, isValidating } = LoadCartContent(
    // mounted,
    true,
    myCartID
  );
  data &&
    mounted &&
    console.log("here is SWR response ", data, isLoading, isError);

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
        `http://127.0.0.1:8000/api/carts/${data.id}`,
        {
          ...data,
          total_price: (data.total_price - i.total_price).toFixed(2),
          itemss: data.itemss.filter((x) => x.id !== i.id),
        },
        false
      );
      const res = await fetch(
        `http://127.0.0.1:8000/api/carts/${data.id}/items/${i.id}/`,
        {
          method: "DELETE",
        }
      );
      console.log("res.ok?", res);
      setDeleteState({ ...deleteState, order: false, done: true });
      setIsSaving(false);
      if (!res.ok) throw res.statusText;
    } catch (err) {
      // if any error, revert the changes:
      mutate(
        `http://127.0.0.1:8000/api/carts/${data.id}`,
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
        `http://127.0.0.1:8000/api/carts/${data.id}`,
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
      console.log("parseInt(i.quantity)", parseInt(i.quantity) + 1);
      const res = await fetch(
        `http://127.0.0.1:8000/api/carts/${data.id}/items/${i.id}/`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            quantity: parseInt(i.quantity) + 1,
          }),
        }
      );
      const patchResponse = await res.json();
      console.log("PATCH res.ok?", patchResponse);
      // setDeleteState({ ...deleteState, order: false, done: true });
      setIsSaving(false);
      if (!res.ok) throw res.statusText;
    } catch (err) {
      // if any error, revert the changes:
      mutate(
        `http://127.0.0.1:8000/api/carts/${data.id}`,
        { ...saveInstanceOfDataBeforePlusButtonClick },
        true
      );
      console.log("Oh Snapp:", err);
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
        `http://127.0.0.1:8000/api/carts/${data.id}`,
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
      console.log("parseInt(i.quantity)", parseInt(i.quantity) - 1);
      const res = await fetch(
        `http://127.0.0.1:8000/api/carts/${data.id}/items/${i.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: parseInt(i.quantity) - 1,
          }),
        }
      );
      const patchResponse = await res.json();
      console.log("PATCH res.ok?", patchResponse);
      // setDeleteState({ ...deleteState, order: false, done: true });
      setIsSaving(false);
      if (!res.ok) throw res.statusText;
    } catch (err) {
      // if any error, revert the changes:
      mutate(
        `http://127.0.0.1:8000/api/carts/${data.id}`,
        { ...saveInstanceOfDataBeforePlusButtonClick },
        true
      );
      console.log("Oh Snapp:", err);
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

  //  $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
  //  $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
  //  $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

  return (
    <>
      <Head>
        <title>Check Out</title>
      </Head>
      <section className="bg-light">
        <div className="container pb-5">
          <div className="row ">
            <div className="col-lg-5 mt-5 px-0 px-sm-2">
              <div className="card mb-3">
                {/* THIS IS THE DEFAULT PHOTO : */}
                {/* <img
                  className="card-img img-fluid"
                  src={post.product_image[0].image}
                  alt={post.product_image[0].alt_text}
                  id="product-detail"
                /> */}
                <p className="px-3 py-4">
                  <strong>Standard Returns:</strong>
                  <br />
                  <small>
                    New and Unused products may be returned within 30 days from
                    original purchase date, in original packaging for refund
                    only when accompanied by a return authorization # (or RA#).
                    A RA# may be obtained by emailing email@email.com . Orders
                    returned without a valid RA# will not be eligible for refund
                    and sender assumes risk of lost goods and/or may incur a
                    restocking fee. A restocking fee may also be charged for
                    special ordered items. The restocking fee will be determined
                    at the time of Return Authorization and finalized upon the
                    return of product. Any customer damaged, previously
                    installed, or otherwise used items (including original
                    manufacturer packaging) are not eligible for return.
                  </small>
                  <br />
                  <br />
                  <strong> Warranty/Guarantee:</strong>
                  <br />
                  <small>
                    Our products are guaranteed to be free of defect. If you are
                    unsatisfied with your purchase and all attempts at remedy
                    (exchange, replacement, etc.) have been exhausted, you may
                    return items within 30 days of purchase for refund (excludes
                    shipping). Please obtain a return authorization prior to
                    return. Shipping will be charged retroactively if items
                    purchased using a Free Shipping Promo are returned (both
                    directions). Please allow 7-10 business days for refund
                    processing from the receipt of returned item.
                  </small>
                </p>
              </div>
            </div>
            {/* <div className="row"> */}

            {/* -- col end  */}
            <div className="col-lg-7 mt-5 mx-0 px-0 px-sm-2">
              <div className="card">
                {/* $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ */}
                {/* $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ */}
                {/* $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ */}
                <>
                  <div className=" container mx-1 px-2 mx-sm-1 px-sm-3 mt-2">
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
                              <span className="display-only-on-more-than-xxs d-none d-sm-inline ms-0 ps-0 me-1">
                                {isSaving ? "Updating" : "Updated "}
                              </span>

                              {isSaving ? (
                                <div
                                  className="spinner-grow text-warning  spinner-grow-sm  ps-0 ps-sm-1
                      "
                                  role="status"
                                  aria-hidden="true"
                                ></div>
                              ) : (
                                <i className="far pb-3 ps-0 ps-sm-1 fa-check-circle spinner-border-sm text-success "></i>
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
                              className="row mb-1 row-cols-auto product-cart-tooltip background-unset"
                              id="template_main_nav"
                            >
                              <div
                                className="col text-wrap lh-1 background-unset text-truncate "
                                style={{ maxWidth: "95%" }}
                              >
                                <Link
                                  href={"../product/" + i.product.slug}
                                  alt={i.product.title}
                                >
                                  <a
                                    className="h3 text-decoration-none text-truncate "
                                    // style={{ maxWidth: "150px" }}
                                    // alt={i.product.title}
                                    title={i.product.title}
                                  >
                                    {i.product.title}
                                  </a>
                                </Link>
                              </div>
                            </div>
                            <div className="row align-items-center product-cart-tooltip background-unset ">
                              <div className="col col-xs-2 background-unset p-0 m-0">
                                <Link href={"../product/" + i.product.slug}>
                                  <a
                                    className="thumbnail ps-2 background-unset"
                                    href={i.product.slug}
                                  >
                                    {/* <img
                                    className="img-fluid cart-box-image ms-1 "
                                    src={i.product.product_image[0].image}
                                    alt={i.product.product_image[0].alt}
                                  /> */}
                                    <Image
                                      src={i.product.product_image[0].image}
                                      alt={i.product.title}
                                      title={i.product.title}
                                      width={500}
                                      height={500}
                                      // sizes=" (min-width: 300px) 11vw,6vw"
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
                                            errorOccured.actionType ===
                                              "increase"
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
                                            className="fas fa-plus more-padding-plus-xxs-co plus-minus-icon-font-size fas-bg-green
                                  "
                                          ></i>
                                        </button>

                                        {moreThan300Matches &&
                                          errorOccured.itemCode === i.id &&
                                          errorOccured.actionType ===
                                            "increase" && (
                                            <ShowErrorTooltip
                                              props={{
                                                errorOccured,
                                                setErrorOccured,
                                                i,
                                                setTooltipRef,
                                                getTooltipProps,
                                                getArrowProps,
                                                customErrorText:
                                                  "increase quantity of",
                                              }}
                                            />
                                          )}
                                        {/* <span className=" display-only-on-xxs increase-decrease-button-xxs   background-unset"> */}
                                        <button
                                          type="button"
                                          ref={
                                            moreThan300Matches &&
                                            errorOccured.itemCode === i.id &&
                                            errorOccured.actionType ===
                                              "decrease"
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
                                          className="btn me-0 btn-danger  background-red"
                                          data-type="minus"
                                        >
                                          <i className="fas fa-minus  more-padding-minus-xxs-co plus-minus-icon-font-size fas-bg-red"></i>
                                        </button>
                                        {moreThan300Matches &&
                                          errorOccured.itemCode === i.id &&
                                          errorOccured.actionType ===
                                            "decrease" && (
                                            <ShowErrorTooltip
                                              props={{
                                                errorOccured,
                                                setErrorOccured,
                                                i,
                                                setTooltipRef,
                                                getTooltipProps,
                                                getArrowProps,
                                                customErrorText:
                                                  "decrease quantity of",
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
                                <div className="  display-only-on-more-than-xxs  align-items-center ">
                                  <div className="d-flex justify-content-center align-items-center ">
                                    <span className="  ">
                                      <button
                                        type="button"
                                        onClick={(event) => {
                                          event.preventDefault();
                                          itemMinusButtonHandler(i);
                                          event.currentTarget.blur();
                                        }}
                                        className="btn default-butt  me-2 btn-danger revert-active-background-change  "
                                        data-type="minus"
                                      >
                                        <small className="">
                                          <small>
                                            <span className="more-padding-minus-co">
                                              <i className="fas   default-butt fa-minus  fas-bg-red  revert-active-background-change"></i>
                                            </span>
                                          </small>
                                        </small>
                                      </button>
                                      {!moreThan300Matches &&
                                        errorOccured.itemCode === i.id &&
                                        errorOccured.actionType ===
                                          "decrease" && (
                                          <ShowErrorTooltip
                                            props={{
                                              errorOccured,
                                              setErrorOccured,
                                              i,
                                              setTooltipRef,
                                              getTooltipProps,
                                              getArrowProps,
                                              customErrorText:
                                                "decrease quantity of",
                                            }}
                                          />
                                        )}
                                    </span>
                                    <span className="">
                                      <smal className="h3">{i.quantity}</smal>
                                    </span>
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
                                        // className="cart-box-input  default-butt  fa-plus.revert-active-background-change btn ms-2 btn-success btn-number btn-sm background-green"
                                        className="btn default-butt  ms-2 btn-success revert-active-background-change "
                                        // className="btn default-butt  me-2 btn-danger revert-active-background-change  "

                                        data-type="plus"
                                      >
                                        <small>
                                          <small>
                                            <span className="more-padding-plus-co">
                                              <i className="fas   default-butt fa-plus   fas-bg-green revert-active-background-change"></i>
                                            </span>
                                          </small>
                                        </small>
                                      </button>
                                      {!moreThan300Matches &&
                                        errorOccured.itemCode === i.id &&
                                        errorOccured.actionType ===
                                          "increase" && (
                                          <ShowErrorTooltip
                                            props={{
                                              errorOccured,
                                              setErrorOccured,
                                              i,
                                              setTooltipRef,
                                              getTooltipProps,
                                              getArrowProps,
                                              customErrorText:
                                                "increase quantity of",
                                            }}
                                          />
                                        )}
                                    </span>
                                  </div>
                                  <div className="child-overflow h3 mt-2 justify-content-center ">
                                    <div className="d-flex ms-2  ms-xl-0 h3 justify-content-center">
                                      <small>
                                        <span>Status: </span>
                                        <span className="text-success">
                                          <strong>In Stock</strong>
                                        </span>
                                      </small>
                                    </div>
                                  </div>
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
                                  {deleteState.order &&
                                  deleteState.id === i.id ? (
                                    <div
                                      className="spinner-border spinner-border-sm"
                                      role="status"
                                    >
                                      <span className="sr-only">
                                        Loading...
                                      </span>
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
                                      deleteState.order &&
                                      deleteState.id === i.id
                                        ? "btn  default-butt  btn-danger px-1 background-red disabled"
                                        : "btn  default-butt  btn-danger px-1 background-red"
                                    }
                                    onClick={(event) => {
                                      event.preventDefault();
                                      itemDeleteHandler(i);
                                    }}
                                  >
                                    <small className="align-top default-butt background-unset remove-key-text">
                                      {deleteState.order &&
                                      deleteState.id === i.id ? (
                                        <div
                                          className="spinner-border spinner-border-sm mx-2"
                                          role="status"
                                        >
                                          <span className="sr-only">
                                            Loading...
                                          </span>
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
                                      deleteState.order &&
                                      deleteState.id === i.id
                                        ? "btn  more-padding-trash vert-align-top background-red btn-danger btn-sm ps-1 disabled"
                                        : "btn  more-padding-trash vert-align-top background-red btn-danger btn-sm px-0"
                                    }
                                    onClick={(event) => {
                                      event.preventDefault();
                                      itemDeleteHandler(i);
                                    }}
                                  >
                                    {deleteState.order &&
                                    deleteState.id === i.id ? (
                                      <div
                                        className="spinner-border spinner-border-sm mx-1"
                                        role="status"
                                      >
                                        <span className="sr-only">
                                          Loading...
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="more-padding-trash">
                                        <i className="far fa-trash-alt  background-red  fas-bg-red"></i>
                                      </span>
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
                      <h3>Total</h3>
                      <h3>
                        <strong>
                          {data
                            ? Number.parseFloat(data.total_price).toFixed(2)
                            : "0"}
                        </strong>
                      </h3>
                    </div>
                    <div className="d-grid gap-1 d-flex justify-content-end mb-3">
                      <button
                        type="button"
                        className="btn me-2 ms-0 btn-secondary btn-sm disabled"
                      >
                        Continue Shopping
                      </button>
                      <button
                        type="button"
                        className={
                          isLoading || !data || data.itemss.length < 1
                            ? "btn ms-2 btn-success btn-sm disabled"
                            : "btn ms-2 btn-success btn-sm disabled"
                        }
                      >
                        Pay Now
                      </button>
                    </div>
                  </div>
                </>
                {/* $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ */}
                {/* $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ */}
                {/* $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ */}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* START OF RELATED PRODUCTS SECTION : */}

      <section className="py-5">
        <div className="container">
          <div className="row text-left p-2 pb-3">
            <h4>Related Products</h4>
          </div>
        </div>
      </section>
      {/* END OF RELATED PRODUCTS SECTION  */}
    </>
  );
}

const mapStateToProps = (state) => ({
  myCartID: state.myCartID.myCartID,
});

// const mapDispatchToProps = (dispatch) => {
//   return {
//     changeCartID: bindActionCreators(
//       (generatedCartID) => changeCartID(generatedCartID),
//       dispatch
//     ),
//   };
// };

export default connect(mapStateToProps)(Checkout);
