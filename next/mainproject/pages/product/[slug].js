import { endpoint } from "../../utils/constants";

import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/dist/client/link";
import { useEffect, useState } from "react";
import { usePopperTooltip } from "react-popper-tooltip";
import { FindTheCartID } from "../../libs/FindTheCartID";
import useSWR, { mutate, trigger } from "swr";
import { changeCartID } from "../../store/cartID/action";
import { wrapper } from "../../store/store";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { LoadCartContent } from "../../libs/LoadCartContent";
import ShowErrorTooltip from "../../components/ShowErrorTooltip";
import useAddToCartHandler from "../../libs/AddToCartHandler";

function Product({ post, categories, myCartID }) {
  const router = useRouter();

  // if (router.isFallback) {
  //   return <div>Loading...</div>;
  // }

  const lastCategoryBranch = post.category.slug;

  const pathToSlash = (array, target) => {
    // Slash separated ancestor categories to use on TreeMenu
    var result;
    array.some(({ key, nodes, label, url = [] }) => {
      if (key === target) return (result = [key, label, url]);
      var temp = pathToSlash(nodes, target);
      if (temp) return (result = [key, label, url] + "///" + [temp]);
    });
    return Array.isArray(result) ? result.join(",") + "///" : result;
  };
  const rootAsArray = pathToSlash(categories, lastCategoryBranch).split("///"); // converting patchToSlash to an array
  const categoriesAsObject = [];
  rootAsArray.forEach((element) =>
    categoriesAsObject.push({
      key: element.split(",")[0],
      label: element.split(",")[1],
      url: element.split(",")[2],
    })
  );
  let i = {
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
  };
  // const { uuid } = require("uuidv4");
  // let tempKeyID = uuid();
  const [currentImage, setCurrentImage] = useState({
    src: post.product_image[0].image,
    alt: post.product_image[0].alt_text,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [errorOccured, setErrorOccured] = useState({
    errorCode: null,
    itemCode: null,
    actionType: null,
  });
  // const [mutateAndFetchAddToCart, errorOccured] = useAddToCartHandler(myCartID);
  const [mutateAndFetchAddToCart, errorOccuredOnAddToCart] =
    useAddToCartHandler(myCartID);

  const addToCartClickHandler = async (post) => {
    await mutateAndFetchAddToCart(post);
  };
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
  const [isVal, setIsVal] = useState(false);

  const [fetchLeftOnStack, setFetchLeftOnStack] = useState([]);

  const [deleteState, setDeleteState] = useState({
    order: false,
    done: false,
    id: null,
  });
  const itemDeleteHandler = async (i, skipMutating = false) => {
    setCartItemIDForNewItems(null);
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
      if ((!isVal || skipMutating) && i.id) {
        const res = await fetch(`${endpoint}/carts/${data.id}/items/${i.id}/`, {
          method: "DELETE",
        });
        setDeleteState({ ...deleteState, order: false, done: true });
        setIsSaving(false);
        if (!res.ok) throw res.statusText;
        res.ok ? setFetchLeftOnStack([]) : null;
      } else {
        // debugger;
        fetchLeftOnStack.length > 0
          ? setFetchLeftOnStack([...fetchLeftOnStack, "delete"])
          : setFetchLeftOnStack(["delete"]);
        !i.id && setFetchLeftOnStack(["final-remove"]);
      }
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
  const util = require("util");
  const [cartItemIDForNewItems, setCartItemIDForNewItems] = useState(null);

  const itemPlusButtonHandler = async (i) => {
    if (parseInt(i.quantity) !== 0) {
      setIsSaving(true);
      const tem = await mutateAndFetchAddToCart(currentItem);
      setIsSaving(false);
    }
    if (parseInt(i.quantity) === 0) {
      setIsVal(true);
      let tem = await mutateAndFetchAddToCart(currentItem, false);
      await mutate(`${endpoint}/carts/${myCartID}`);
      setIsVal(false);
      setIsSaving(false);
    }
    // }
  };

  const itemMinusButtonHandler = async (
    i,
    skipMutating = false,
    minusQuantity = 1
  ) => {
    setIsSaving(true);
    const saveInstanceOfDataBeforePlusButtonClick = data;
    setErrorOccured;

    try {
      // !skipMutating &&
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
                quantity: parseInt(x.quantity) - parseInt(minusQuantity),
                total_price: (
                  parseFloat(x.total_price) -
                  parseFloat(x.product.regular_price) * parseInt(minusQuantity)
                ).toFixed(2),
              };
            } else {
              return x;
            }
          }),
        },
        false
      );
      if (!isVal || skipMutating) {
        const res = await fetch(`${endpoint}/carts/${data.id}/items/${i.id}/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: parseInt(i.quantity) - parseInt(minusQuantity),
          }),
        });
        const patchResponse = await res.json();
        if (!res.ok) {
          throw res.statusText;
        }
      } else {
        // debugger;
        fetchLeftOnStack.length > 0
          ? setFetchLeftOnStack([...fetchLeftOnStack, "decrease"])
          : setFetchLeftOnStack(["decrease"]);
      }
      setIsSaving(false);
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

  // debugger;
  i =
    data && data.itemss.filter((x) => x.product.id === post.id)[0]
      ? data.itemss.filter((x) => x.product.id === post.id)[0]
      : i;
  const currentItem = {
    id: post.id,
    title: post.title,
    regular_price: post.regular_price,
    slug: post.slug,
    product_image: post.product_image,
  };
  useEffect(() => {
    // setIsVal(isVal);
    if (!isVal && fetchLeftOnStack.length > 0) {
      if (!fetchLeftOnStack.includes("delete")) {
        let counter = 0;
        for (const action of fetchLeftOnStack) {
          // fetchLeftOnStack.shift();
          action === "decrease" && counter++;
          // action ==='delete' && itemDeleteHandler(currentItem,true)
        }
        counter > 0 && itemMinusButtonHandler(i, true, counter);
      } else if (!fetchLeftOnStack.includes("final-remove")) {
        itemDeleteHandler(i, true);
      } else if (fetchLeftOnStack.includes("final-remove") && i.id) {
        itemDeleteHandler(i, true);
        setFetchLeftOnStack([]);
      }
      !fetchLeftOnStack.includes("final-remove") && setFetchLeftOnStack([]);
    }
    // }, [isVal, isValidating]);
  }, [isVal]);
  fetchLeftOnStack.includes("final-remove") &&
    i.id &&
    !isVal &&
    setFetchLeftOnStack &&
    itemDeleteHandler(i, true);
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

  useEffect(() => {
    if (typeof document !== undefined) {
      const { Carousel } = require("bootstrap");
    }
  }, []);
  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>
      <section className="bg-light">
        <div className="container p-4">
          {/* --START OF BREADCRUMB-- */}
          <nav
            style={{ "--bs-breadcrumb-divider": '">"' }}
            aria-label="breadcrumb"
          >
            <ol className="breadcrumb">
              {categoriesAsObject.slice(0, -1).map((cat, id) => (
                <li key={id} className="breadcrumb-item">
                  <Link
                    href={{
                      pathname: "/category/" + cat.url,
                      // query: router.query ,
                    }}
                    passHref
                  >
                    <a className="h3 text-decoration-none text-success">
                      {cat.label}{" "}
                    </a>
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
          {/* --END OF BREADCRUMB-- */}
          <div className="row">
            <div className="col-lg-5 mt-5">
              <div className="card mb-3">
                {/* THIS IS THE DEFAULT PHOTO : */}
                <img
                  className="card-img img-fluid"
                  src={currentImage.src}
                  alt={currentImage.alt}
                  id="product-detail"
                />
              </div>
              <div className="row">
                {/* --Start Controls */}
                <div className="col-1 align-self-center">
                  <a href="#multi-item" role="button" data-bs-slide="prev">
                    <i className="text-dark fas fa-chevron-left"></i>
                    <span className="sr-only">Previous</span>
                  </a>
                </div>
                {/* --End Controls */}
                {/* --Start Carousel Wrapper */}
                <div
                  id="multi-item"
                  className="col-10 carousel slide carousel-multi-item"
                  data-bs-ride="carousel"
                >
                  {/* --Start Slides */}
                  <div
                    className="carousel-inner product-links-wap"
                    role="listbox"
                  >
                    {/* --First slide should be 3 pictures */}
                    <div className="carousel-item active">
                      <div className="row">
                        {post.product_image.map(
                          (c, index) =>
                            index < 3 && (
                              <div className="col-4" key={c.image}>
                                <img
                                  onClick={() => {
                                    setCurrentImage({
                                      src: c.image,
                                      alt: c.alt_text,
                                    });
                                  }}
                                  className="card-img img-fluid"
                                  src={c.image}
                                  alt={c.alt_text}
                                  style={{ cursor: "pointer" }}
                                />
                              </div>
                            )
                        )}
                      </div>
                    </div>
                    {/* --First slide-- */}

                    {/* --Second slide-- */}
                    {post.product_image[3] && (
                      <div className="carousel-item">
                        <div className="row ">
                          {post.product_image.map(
                            (c, index) =>
                              index >= 3 &&
                              index < 6 && (
                                <div className="col-4 " key={c.image}>
                                  <img
                                    onClick={() => {
                                      setCurrentImage({
                                        src: c.image,
                                        alt: c.alt_text,
                                      });
                                    }}
                                    className="card-img img-fluid"
                                    src={c.image}
                                    alt={c.alt_text}
                                    style={{ cursor: "pointer" }}
                                  />
                                </div>
                              )
                          )}
                        </div>
                      </div>
                    )}
                    {/* --/.Second slide */}

                    {/* --Third slide */}
                    {post.product_image[6] && (
                      <div className="carousel-item">
                        <div className="row">
                          {post.product_image.map(
                            (c, index) =>
                              index >= 6 &&
                              index < 9 && (
                                <div className="col-4" key={c.image}>
                                  <img
                                    onClick={() => {
                                      setCurrentImage({
                                        src: c.image,
                                        alt: c.alt_text,
                                      });
                                    }}
                                    className="card-img img-fluid"
                                    src={c.image}
                                    alt={c.alt_text}
                                    style={{ cursor: "pointer" }}
                                  />
                                </div>
                              )
                          )}
                        </div>
                      </div>
                    )}
                    {/* --/.Third slide */}
                  </div>
                  {/* --End Slides */}
                </div>
                {/* --End Carousel Wrapper */}
                {/* --Start Controls */}
                <div className="col-1 align-self-center">
                  <a href="#multi-item" role="button" data-bs-slide="next">
                    <i className="text-dark fas fa-chevron-right"></i>
                    <span className="sr-only">Next</span>
                  </a>
                </div>
                {/* --End Controls */}
              </div>
            </div>
            {/* -- col end  */}
            <div className="col-lg-7 mt-5">
              <div className="card">
                <div className="card-body">
                  <h1 className="h2">{post.title}</h1>
                  <p className="h3 py-2">$ {post.regular_price}</p>
                  <p className="py-2">
                    <i className="fa fa-star text-warning"></i>
                    <i className="fa fa-star text-warning"></i>
                    <i className="fa fa-star text-warning"></i>
                    <i className="fa fa-star text-warning"></i>
                    <i className="fa fa-star text-secondary"></i>
                    <span className="list-inline-item text-dark">
                      Rating 4.8 | 6 Comments
                    </span>
                  </p>
                  <ul className="list-inline">
                    <li className="list-inline-item">
                      <h6>Brand:</h6>
                    </li>
                    <li className="list-inline-item">
                      <p className="text-muted">
                        <strong>Easy Wear</strong>
                      </p>
                    </li>
                  </ul>
                  <h6>Description:</h6>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod temp incididunt ut labore et dolore magna aliqua.
                    Quis ipsum suspendisse. Donec condimentum elementum
                    convallis. Nunc sed orci a diam ultrices aliquet interdum
                    quis nulla.
                  </p>
                  <ul className="list-inline">
                    <li className="list-inline-item">
                      <h6>Avaliable Color :</h6>
                    </li>
                    <li className="list-inline-item">
                      <p className="text-muted">
                        <strong>White / Black</strong>
                      </p>
                    </li>
                  </ul>

                  <h6>Specification:</h6>
                  <ul className="list-unstyled pb-3">
                    <li>Lorem ipsum dolor sit</li>
                    <li>Amet, consectetur</li>
                    <li>Adipiscing elit,set</li>
                    <li>Duis aute irure</li>
                    <li>Ut enim ad minim</li>
                    <li>Dolore magna aliqua</li>
                    <li>Excepteur sint</li>
                  </ul>

                  <form action="" method="GET">
                    <input
                      type="hidden"
                      name="product-title"
                      value="Activewear"
                    />
                    <div className="row">
                      <div className="col-auto"></div>
                      <div className="col-auto">
                        <ul className="list-inline pb-3">
                          <li className="list-inline-item text-right">
                            Quantity
                          </li>
                          <li className="list-inline-item">
                            <button
                              className={`btn btn-danger ${
                                i.quantity ? "" : "disabled"
                              }`}
                              ref={
                                errorOccured.itemCode === i.id &&
                                errorOccured.actionType === "decrease"
                                  ? setTriggerRef
                                  : null
                              }
                              onClick={(event) => {
                                event.preventDefault();
                                parseInt(i.quantity) === 1
                                  ? itemDeleteHandler(i)
                                  : itemMinusButtonHandler(i);
                                event.currentTarget.blur();
                              }}
                              id="btn-minus"
                            >
                              <i className="fas fa-minus more-padding-minus-xxs plus-minus-icon-font-size fas-bg-red fa-fw"></i>
                            </button>
                            {errorOccured.itemCode === i.id &&
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
                          </li>

                          <li className="list-inline-item">
                            <span
                              className="badge bg-secondary "
                              id="var-value"
                            >
                              {i.quantity}
                            </span>
                          </li>
                          <li className="list-inline-item">
                            <button
                              ref={
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
                              className="btn btn-success"
                              id="btn-plus"
                            >
                              <i className="fas fa-plus more-padding-plus-xxs  plus-minus-icon-font-size fas-bg-green fa-fw"></i>
                            </button>
                            {errorOccured.itemCode === i.id &&
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
                              )}{" "}
                            {/* <small>{isSaving ? "Updating" : "Updated "}</small> */}
                          </li>
                        </ul>
                        <ul className="list-inline pb-3">
                          <li className="list-inline-item text-right pe-4">
                            Total
                          </li>
                          <li className="list-inline-item">
                            {i.total_price === 0 ? "" : "$"} {i.total_price}
                          </li>
                          <li className="list-inline-item">
                            {isSaving || isValidating ? (
                              <div
                                className="spinner-grow text-warning  spinner-grow-sm  ms-2"
                                role="status"
                                aria-hidden="true"
                              ></div>
                            ) : parseInt(i.quantity) ? (
                              <i className="far fa-check-circle spinner-border-sm text-success "></i>
                            ) : (
                              ""
                            )}
                          </li>
                          {/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */}
                        </ul>
                      </div>
                    </div>
                    <div className="row pb-3">
                      <div className="col d-grid">
                        <button
                          type="submit"
                          className="btn btn-success btn-lg"
                          name="submit"
                          onClick={(event) => {
                            event.preventDefault();
                            router.push("/checkout");
                          }}
                        >
                          {" "}
                          <small className="align-middle  background-unset remove-key-text responsive-font-size-for-product-page-buttons">
                            Check Out
                          </small>
                        </button>
                      </div>
                      <div className="col d-grid">
                        {parseInt(i.quantity) === 0 ? (
                          <button
                            className="btn btn-success btn-lg"
                            onClick={(event) => {
                              event.preventDefault();
                              // parseInt(i.quantity) === 0
                              //   ? addToCartClickHandler(currentItem)
                              //   : itemPlusButtonHandler(i);
                              itemPlusButtonHandler(i);
                              event.currentTarget.blur();
                            }}
                          >
                            {" "}
                            <small className="align-middle background-unset  responsive-font-size-for-product-page-buttons">
                              Add To Cart
                            </small>
                          </button>
                        ) : (
                          <>
                            <button
                              type="button"
                              ref={
                                errorOccured.itemCode === i.id &&
                                errorOccured.actionType === "delete"
                                  ? setTriggerRef
                                  : null
                              }
                              className={
                                deleteState.order && deleteState.id === i.id
                                  ? "btn  btn-danger px-1  disabled"
                                  : "btn  btn-danger px-1 "
                              }
                              onClick={(event) => {
                                event.preventDefault();
                                itemDeleteHandler(i);
                              }}
                            >
                              <small className="align-middle  background-unset remove-key-text responsive-font-size-for-product-page-buttons">
                                {deleteState.order &&
                                deleteState.id === i.id ? (
                                  <div
                                    className="spinner-border spinner-border-sm mx-2"
                                    role="status"
                                  >
                                    <span className="sr-only">Loading...</span>
                                  </div>
                                ) : (
                                  "Remove From Cart"
                                )}
                              </small>
                            </button>
                            {errorOccured.itemCode === i.id &&
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
                          </>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
                {/* $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ */}
                {/* $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ */}
                {/* $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ */}

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
            {/* <h4>Related Products</h4> */}
          </div>
        </div>
      </section>
      {/* END OF RELATED PRODUCTS SECTION  */}
    </>
  );
}

export async function getStaticPaths() {
  const res = await fetch(`${endpoint}/products/?page_size=999999`);
  const allProducts = await res.json();
  const paths = allProducts.results.map((post) => ({
    params: { slug: post.slug },
  }));

  return {
    // paths: [
    //   {
    paths,
    // },
    // ],
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const res = await fetch(`${endpoint}/products/${params.slug}/`);
  const post = await res.json();

  // const ress = await fetch("${endpoint}/category/");
  const ress = await fetch(`${endpoint}/tree-data-category-feed/`);
  const categories = await ress.json();

  return {
    props: {
      post,
      categories,
    },
  };
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

export default connect(mapStateToProps)(Product);
