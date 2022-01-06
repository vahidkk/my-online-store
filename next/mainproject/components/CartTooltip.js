import React, { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { CartManager } from "../libs/CartManager";
import { swrDelete } from "../libs/DeleteItem";
// import fetch from "../libs/fetch";
import useSWR from "swr";

import OverrideTooltipPosition from "../libs/OverrideTooltipPosition";

const CartTooltip = ({ children }) => {
  const ReactTooltip = dynamic(() => import("react-tooltip"), { ssr: false });
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
  const [cartState, setCartState] = useState(initialCartItem);
  useEffect(() => {
    async function loadData() {
      setCartState(await CartManager());
      console.log(cartState);
    }
    loadData();
    // const { deletionData, deletionLoading, deletionIsError } = await swrDelete(
    //   cartState,
    //   37
    // );
    // await console.log("$$$$$deleteState 1:", deletionIsError, deletionData);
  }, []);
  console.log("cartState:::", cartState);
  const [closeTtip, setCloseTtip] = useState(false);
  const closeTooltipEvent = () => setCloseTtip(!closeTtip);
  const [closeTtipFromCartIcone, setCloseTtipFromCartIcone] = useState(0);
  const closeTtipFromCartIconeEvent = () =>
    setCloseTtipFromCartIcone(closeTtipFromCartIcone++);
  const [deleteState, setDeleteState] = useState({
    order: false,
    done: false,
    id: null,
  });
  const fooRef = null;
  useCallback(() => {
    ReactTooltip.rebuild();
    ReactTooltip.show(fooRef);
  }, deleteState);
  const itemDeleteHandler = async (itemID) => {
    setDeleteState({ ...deleteState, order: true, done: false });

    const res = await fetch(
      `http://127.0.0.1:8000/api/carts/${cartState.id}/items/${itemID}/`,
      {
        method: "DELETE",
      }
    );
    setDeleteState({ ...deleteState, order: false, done: true });

    console.log("trippppleLog:::", deleteState);
  };

  return (
    <>
      <span
        ref={(ref) => (fooRef = ref)}
        data-tip
        data-for="cart-ttip"
        data-event="click"
        // data-event-off={closeTtip}
        onClick={closeTtipFromCartIconeEvent}
        data-event-off={
          (closeTtipFromCartIcone > 0 && closeTtipFromCartIcone % 2 === 0
            ? true
            : false) && closeTtip
        }
      >
        {/* (❂‿❂) */}
        {children}
      </span>
      <ReactTooltip
        type="light"
        resizeHide={false}
        isCapture={false}
        place="bottom"
        effect="solid"
        clickable={true}
        id={"cart-ttip"}
        globalEventOff="click"
        scrollHide={false}
        className="my-tooltip"
        // delayHide={500}
        overridePosition={OverrideTooltipPosition}
      >
        <div
          data-for={"cart-ttip"}
          className="cart-scroll container   cart-box  "
        >
          <div className="row mx-0 px-0 product-cart-tooltip ">
            <div className="col me-1 px-0 h3">Product</div>
            <div className="col me-1 px-0 h3 ">Quantity</div>
            <div className="col me-1 px-0 h3">Price</div>
            <div className="col me-0 px-0 h3">Total</div>
            <div className="col me-0 px-0 h3"> </div>
          </div>
          {cartState.itemss.map((i) => (
            <span className="active-background-change" key={i.product.id}>
              <div className="border rounded-2 mb-2  ps-2 py-2 each-cart-element  ">
                <div className="row mb-1 row-cols-auto product-cart-tooltip background-unset">
                  <div className="col text-wrap lh-1 background-unset ">
                    <a
                      className="h3  "
                      href={i.product.slug}
                      alt_text={i.product.title}
                    >
                      {i.product.title.length < 55
                        ? i.product.title
                        : i.product.title.substring(0, 54) + "..."}
                    </a>
                  </div>
                </div>
                <div className="row product-cart-tooltip background-unset ">
                  <div className="col col-xs-2 background-unset">
                    <a className="thumbnail ps-2" href="#">
                      <img
                        className="img-fluid cart-box-image ms-1"
                        src={i.product.product_image[0].image}
                        alt={i.product.product_image[0].alt}
                      />
                    </a>
                  </div>
                  <div className="col px-0 col-xs-2 d-inline background-unset">
                    <div className="display-only-on-xxs background-unset">
                      <select className="form-select mt-1 form-select-sm cart-box-select ">
                        <option selected value="1">
                          1
                        </option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                    </div>
                    <div className="  display-only-on-more-than-xxs background-unset">
                      <span className="  background-unset">
                        <button
                          type="button"
                          className="btn me-2 btn-danger  background-red"
                          data-type="minus"
                        >
                          <small className="unchange-bg background-red">
                            <small>
                              <i className="fas fa-minus more-padding-minus fas-bg-red"></i>
                            </small>
                          </small>
                        </button>
                      </span>
                      x
                      <span className="input-group-btn ">
                        <button
                          type="button"
                          className="cart-box-input btn ms-2 btn-success btn-number btn-sm background-green"
                          data-type="plus"
                          data-field="quant[2]"
                        >
                          <small>
                            <small>
                              <i className="fas fa-plus more-padding-plus unchange-bg fas-bg-green"></i>
                            </small>
                          </small>
                        </button>
                      </span>
                    </div>

                    <div className="child-overflow h3 mt-2 ">
                      <small>
                        <span>Status: </span>
                        <span className="text-success">
                          <strong>In Stock</strong>
                        </span>
                      </small>
                    </div>
                  </div>
                  <div className="col px-0 col-xs-2 h3 align-self-center ">
                    <strong>${i.product.regular_price}</strong>
                  </div>
                  <div className="col px-0 col-xs-2 h3 align-self-center ">
                    <strong>${i.total_price}</strong>
                  </div>

                  <div className="col align-self-center display-only-on-xxs background-unset ">
                    <button
                      type="button"
                      className="btn mx-0 my-0 btn-danger cart-box-input btn-sm background-red"
                      data-type="remove"
                    >
                      <small>
                        <i className="far fa-trash-alt"></i>
                      </small>
                    </button>
                  </div>

                  <div className="col  col-xs-2 h3 display-only-on-more-than-xxs px-0 background-unset align-self-center  ">
                    <span className="remove-icon-show-only-on-small-or-more">
                      <button
                        type="button"
                        className="btn  btn-danger px-1 background-red "
                        onClick={(event) => {
                          event.preventDefault();
                          itemDeleteHandler(i.id);
                        }}
                      >
                        <small className="align-top unchange-bg">
                          Remove {}
                        </small>
                      </button>
                    </span>
                    <span className="remove-icon-show-only-on-xxsmall-and-midsmall  background-unset">
                      <button
                        type="button"
                        className="btn  background-red btn-danger btn-sm px-0"
                      >
                        <i className="far fa-trash-alt more-padding-trash background-red  fas-bg-red"></i>
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            </span>
          ))}{" "}
          <div className="row">
            <div className="col">   </div>
            <div className="col">   </div>
            <div className="col">   </div>
            <div className="col"></div>
            <div className="col"></div>
          </div>
          <div className="row">
            <div className="col">   </div>
            <div className="col">   </div>
            <div className="col">   </div>
            <div className="col"></div>
            <div className="col"></div>
          </div>
          <div className="d-grid gap-4 d-flex justify-content-end">
            <h3>Total</h3>
            <h3>
              <strong>{cartState.total_price}</strong>
            </h3>
          </div>
          <div className="d-grid gap-1 d-flex justify-content-end">
            <button
              onClick={closeTooltipEvent}
              type="button"
              className="btn me-2 ms-0 btn-secondary btn-sm"
            >
              Continue Shopping
            </button>
            <button type="button" className="btn ms-2 btn-success btn-sm">
              Checkout
            </button>
          </div>
        </div>
      </ReactTooltip>
    </>
  );
};

export async function getServerSideProps(context) {
  const res1 = await fetch(`http://127.0.0.1:8000/api/carts/${cartId}`);
  const errorCode = res1.ok ? false : res1.status;
  console.log("res1.status:", res1.status);
  const cartItems = await res1.json();
  return {
    props: {
      cartItems,
    },
  };
}
export default CartTooltip;
