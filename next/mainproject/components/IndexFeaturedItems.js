import { useRef, useState, useEffect } from "react";
import { endpoint } from "../utils/constants";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { LoadCartContent } from "../libs/LoadCartContent";
import useAddToCartHandler from "../libs/AddToCartHandler";

function IndexFeaturedItems({ products, myCartID }) {
  const [imageisLoaded, setImageIsLoaded] = useState(false);
  const [showHoverOnTouch, setShowHoverOnTouch] = useState({
    boolean: false,
    id: null,
  });
  const timerRef = useRef(null);
  const router = useRouter();

  const [addThisItemToCart, setAddThisItemToCart] = useState(null);
  const [mutateAndFetchAddToCart, errorOccured] = useAddToCartHandler(myCartID);
  const addToCartClickHandler = (post) => {
    mutateAndFetchAddToCart(post, false, true);
  };
  const {
    data: cartData,
    isLoading,
    isError,
  } = LoadCartContent(true, myCartID);

  const singleProductLinkHandler = (link) => {
    router.push("../product/" + link);
  };
  return (
    <>
      <section className="bg-light">
        <div className="container py-5">
          <div className="row text-center py-3">
            <div className="col-lg-6 m-auto">
              <h1 className="h1">Newest Products </h1>
              <p>
                Rorhenderpit ien vvoluptate relit tsse yilluym dowlrore eru
                futgiat ntulla parwiatuar. Erxctepteur sintyt oqaecat
                ocoupidaotat npon proppidenpt.
              </p>
            </div>
          </div>
          <div className="row">
            {/* ########################################### */}

            {products.results.map(
              (post, index) =>
                index < 4 && (
                  <div key={post.id} className="col-12 col-sm-6 col-lg-3">
                    <div className="card mb-4 product-wap rounded-0">
                      <div
                        className="card results.rounded-0"
                        {...(showHoverOnTouch.id !== post.id && {
                          onTouchEnd: (e) => {
                            e.preventDefault();
                            setShowHoverOnTouch({
                              boolean: true,
                              id: post.id,
                            });
                            clearTimeout(timerRef.current);
                            timerRef.current = setTimeout(() => {
                              setShowHoverOnTouch({
                                boolean: false,
                                // id: post.id,
                                id: null,
                              });
                            }, 3000);
                          },
                        })}
                      >
                        <div>
                          <Image
                            src={post.product_image[0].image}
                            alt={post.product_image[0].alt_text}
                            onLoad={() => setImageIsLoaded(true)}
                            width={300}
                            height={300}
                            layout="responsive"
                            placeholder="blur"
                            blurDataURL="/Eclipse-1s-211px.svg"
                          />
                        </div>

                        <div
                          className={`d-flex   p-2 bd-highlight ${
                            post.available_quantity < 2
                              ? "bg-danger"
                              : post.available_quantity < 4
                              ? "bg-warning"
                              : "bg-success"
                          }`}
                        >
                          {post.available_quantity < 2
                            ? "Hurry! Only 1 left in stock!"
                            : post.available_quantity < 4
                            ? "Only 3 left in stock!"
                            : "In stock"}
                        </div>
                        <div
                          className={
                            showHoverOnTouch.boolean &&
                            showHoverOnTouch.id === post.id
                              ? "card-img-overlay  rounded-0 product-overlay-touch d-flex align-items-end justify-content-start"
                              : "card-img-overlay  rounded-0 product-overlay d-flex align-items-end justify-content-start"
                          }
                        >
                          <div className="container  ">
                            <div className="row  ">
                              <div
                                // className="d-flex bg-success make-it-absolute align-items-stretch"
                                {...(showHoverOnTouch.id !== post.id &&
                                  !showHoverOnTouch.boolean && {
                                    onClick: () =>
                                      singleProductLinkHandler(post.slug),
                                    // className:
                                    //   "d-flex bg-success make-it-absolute align-items-stretch",
                                    className: " make-it-absolute",
                                    // "d-flex d-flex flex-column flex-grow flex-fill bg-info",
                                  })}
                                onTouchEnd={(e) => e.preventDefault()}
                              ></div>
                            </div>
                            <div className="row">
                              <div className="col-md-auto ">
                                <ul className="results list-unstyled">
                                  <li></li>
                                  <li>
                                    <a className="btn btn-success text-white  ">
                                      {/* after click should be converted from far to fa like this : <i className="fa fa-heart fa-fw"></i> */}
                                      <i className="far fa-heart fa-fw"></i>
                                      {/* after click should be converted from far to fa like this : <i className="fa fa-heart fa-fw"></i> */}
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="btn btn-success text-white   mt-2"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        addToCartClickHandler(post);
                                      }}
                                    >
                                      {cartData &&
                                      cartData.itemss.filter(
                                        (x) =>
                                          parseInt(x.product.id) ===
                                          parseInt(post.id)
                                      ).length > 0 ? (
                                        <>
                                          {/* <i className="fas fa-shopping-cart"></i> */}
                                          <span className="nav-icon position-relative text-decoration-none text-white ">
                                            <i className="fa fa-fw fa-shopping-cart  mr-1  px-md-0  "></i>
                                            <small>
                                              <span className="position-absolute top-0 left-100 translate-middle badge rounded-pill bg-white-transparent  text-dark mt-1">
                                                {
                                                  cartData.itemss.filter(
                                                    (x) =>
                                                      parseInt(x.product.id) ===
                                                      parseInt(post.id)
                                                  )[0].quantity
                                                }
                                              </span>
                                            </small>
                                          </span>
                                        </>
                                      ) : (
                                        <span className="nav-icon position-relative text-decoration-none text-white ">
                                          <i className="fas fa-cart-plus  fa-fw  "></i>
                                        </span>
                                      )}
                                    </a>
                                  </li>
                                </ul>
                              </div>
                              <div
                                {...(showHoverOnTouch.id !== post.id &&
                                  !showHoverOnTouch.boolean && {
                                    onClick: () =>
                                      singleProductLinkHandler(post.slug),
                                    className:
                                      "col  px-0 mx-0 pb-0 mb-0 cursor-pointer",
                                  })}
                                onTouchEnd={(e) => e.preventDefault()}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="results.card-body">
                        <Link
                          href={{
                            pathname: "/product/" + post.slug,
                            // query: router.query ,
                          }}
                          passHref
                        >
                          <a className="h3 text-decoration-none">
                            {post.title}
                          </a>
                        </Link>
                        <p className="text-left ps-1 mb-0">
                          <b>$ :{post.regular_price}</b>
                        </p>
                        <ul className="w-100 list-unstyled d-flex justify-content-between mb-0 ps-1">
                          <li>Free Delivery</li>
                          <li className="pt-2">
                            <span className="product-color-dot color-dot-red float-left rounded-circle ml-1"></span>
                            <span className="product-color-dot color-dot-blue float-left rounded-circle ml-1"></span>
                            <span className="product-color-dot color-dot-black float-left rounded-circle ml-1"></span>
                            <span className="product-color-dot color-dot-light float-left rounded-circle ml-1"></span>
                            <span className="product-color-dot color-dot-green float-left rounded-circle ml-1"></span>
                          </li>
                        </ul>
                        <ul className="list-unstyled d-flex justify-content-start mb-1">
                          <li>
                            <i className="text-warning fa fa-star"></i>
                            <i className="text-warning fa fa-star"></i>
                            <i className="text-warning fa fa-star"></i>
                            <i className="text-muted fa fa-star"></i>
                            <i className="text-muted fa fa-star"></i>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )
            )}
          </div>
        </div>
      </section>
    </>
  );
}
export async function getStaticProps({ params }) {
  const res = await fetch(`${endpoint}/products/`);
  const products = await res.json();

  const ress = await fetch(`${endpoint}/tree-data-category-feed/`);
  const categories = await ress.json();

  return {
    props: {
      products,
      categories,
    },
  };
}
export default IndexFeaturedItems;
