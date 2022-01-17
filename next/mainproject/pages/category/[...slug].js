import { endpoint } from "../../utils/constants";
import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { wrapper } from "../../store/store";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changePageSize } from "../../store/pagesize/action";
import { changeOrdering } from "../../store/ordering/action";
import { CartManager } from "../../libs/CartManager";
import { Range, getTrackBackground, useThumbOverlap } from "react-range";
import addToCartIcon from "../../public/green-icons/add-to-cart.png";

// import { Tooltip, Dropdown } from "bootstrap";

import TreeMenu, {
  defaultChildren,
  ItemComponent,
} from "react-simple-tree-menu";
import Head from "next/head";
// import { LoadCartContent } from "../../components/muhsin";
import { LoadCartContent } from "../../libs/LoadCartContent";
import useAddToCartHandler from "../../libs/AddToCartHandler";

function Home({
  posts,
  errorCode,
  treeDataCategoryFeed,
  categories,
  pagesize,
  changePageSize,
  ordering,
  changeOrdering,
  myCartID,
}) {
  const router = useRouter();
  // if (router.isFallback) {
  //   return <div>Loading...</div>;
  // }
  const [imageisLoaded, setImageIsLoaded] = useState(false);
  // thumb sizes for price range : ###################################
  const THUMB_SIZE_HEIGHT = 29;
  const THUMB_SIZE_WIDTH = 21;
  // START OF RANGE SLIDER CALC : ###############################################################################
  const currentCategoryBasedOnURL = categories.filter((obj) =>
    obj.paths > 1
      ? obj.paths.join()
      : obj.paths[0] ===
        (router.query.slug.length > 1 && Array.isArray(router.query.slug))
      ? router.query.slug.join()
      : Array.isArray(router.query.slug)
      ? router.query.slug[0]
      : router.query.slug
  )[0];

  currentCategoryBasedOnURL.price_range.min_price ===
    currentCategoryBasedOnURL.price_range.max_price &&
    currentCategoryBasedOnURL.price_range.max_price++;

  const [priceRange, setPriceRange] = useState({
    values: [
      currentCategoryBasedOnURL.price_range.min_price,
      currentCategoryBasedOnURL.price_range.max_price,
    ],
    isDragging: false,
  });
  const [showHoverOnTouch, setShowHoverOnTouch] = useState({
    boolean: false,
    id: null,
  });
  const timerRef = useRef(null);

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
  const handleRouteChange = (
    e,
    pagenumberReset = false,
    typeOfRouterChange = "pagesize"
  ) => {
    if (typeOfRouterChange === "pagesize") {
      pagenumberReset
        ? router.push({
            query: {
              ...router.query,
              page_size: e,
              p: 1,
            },
          })
        : router.push({
            query: {
              ...router.query,
              page_size: e,
            },
          });
    } else if (typeOfRouterChange === "ordering") {
      router.push({
        query: {
          ...router.query,
          ordering: e,
        },
      });
    } else if (
      typeOfRouterChange === "priceFiltering" &&
      priceRange.isDragging === true
    ) {
      const cleanPriceFilteredURL = ({
        regular_price__gte,
        regular_price__lte,
        slug,
        ...rest
      }) => rest;

      router.push(
        {
          query: {
            ...router.query,
            // ordering: e,
            p: 1,
            regular_price__gte: e[0],
            regular_price__lte: e[1],
          },
        },
        Object.keys(cleanPriceFilteredURL(router.query)).length > 0
          ? {
              query: cleanPriceFilteredURL(router.query),
            }
          : router.asPath,
        { scroll: false }
      );
      setPriceRange({ ...priceRange, isDragging: false });
    }
  };

  const pageNumber = parseInt(
    router.query.p && router.query.p > 0 ? router.query.p : 1
  );

  // Finding ancestors of current page's category : ##########################################
  const pathToPageTitle = (array, target) => {
    //This function will receive the current page's category key( changed to url ,no more key) and return all labels(name to be used for Head page title )
    var result;
    array.some(({ url, nodes, label = [] }) => {
      if (url === target) return (result = label);
      var temp = pathToPageTitle(nodes, target);
      if (temp) return (result = label + "/" + temp);
    });
    return result;
  };
  const currentPageLabel = currentCategoryBasedOnURL.name;

  // this will return the last member of lables which is current page's category title to be used on Head
  const pathToSlash = (array, target) => {
    // Slash separated ancestor categories to use on TreeMenu
    var result;
    array.some(({ key, nodes = [] }) => {
      if (key === target) return (result = key);
      var temp = pathToSlash(nodes, target);
      if (temp) return (result = key + "/" + temp);
    });
    return result;
  };

  const rootAsArray = router.query.slug;

  let initialOpens = []; //{initialOpenNodes}'s feed for TreeMenu
  for (let i = currentCategoryBasedOnURL.paths.length - 1; i >= 0; i--) {
    initialOpens.push(
      currentCategoryBasedOnURL.paths.slice(0, i + 1).join("/")
    );
  }

  // end of finding ancestors of category .########################################################################
  // start of pagination variables :###############################################################################
  const totalNumberOfPages = Array(
    posts.count
      ? posts.count % pagesize === 0
        ? posts.count / pagesize
        : parseInt(posts.count / pagesize) + 1
      : 1
  ).fill(null);
  //  end of pagination variables  ################################################################################
  const singleProductLinkHandler = (link) => {
    router.push("../product/" + link);
  };
  // const drdRef = useRef();

  useEffect(() => {
    if (typeof document !== undefined) {
      const { Dropdown } = require("bootstrap");
    }
    // let drd = new Dropdown(drdRef.current, {});
  }, []);
  function chosenPageSize(event) {
    posts.next == null
      ? parseInt(event.target.dataset.value) > parseInt(pagesize)
        ? handleRouteChange(event.target.dataset.value, true)
        : handleRouteChange(event.target.dataset.value)
      : handleRouteChange(event.target.dataset.value);
    changePageSize(event);
  }
  function chosenSort(event) {
    handleRouteChange(event.target.dataset.value, false, "ordering");
    changeOrdering(event);
  }

  return (
    <>
      <Head>
        <title>{currentPageLabel}</title>
      </Head>
      <div className="container p-5 ">
        <div className="row">
          <div className="col-sm-4 col-md-3">
            <h1 className="h2 pb-4">Categories</h1>
            <TreeMenu
              data={treeDataCategoryFeed}
              // initialActiveKey={pathToSlash(treeFeedObj, router.query.slug)}
              initialActiveKey={currentCategoryBasedOnURL.url}
              initialOpenNodes={initialOpens}
              onClickItem={({ key, label, ...props }) => {
                router.query.slug && delete router.query.slug;
                router.push(
                  { pathname: props.url, query: router.query },
                  undefined,
                  {
                    shallow: false,
                  }
                );
              }}
            >
              {({ search, items }) => (
                <>
                  <input
                    className="rstm-search fs-6 ps-sm-1 ps-md-2 ps-lg-3 ps-xl-4 "
                    onChange={(e) => search(e.target.value)}
                    placeholder="Search categories"
                  />
                  <ul className="rstm-tree-item-group ">
                    {items.map(({ key, ...props }) => (
                      <div key={key}>
                        <ItemComponent key={key} {...props} />
                      </div>
                    ))}
                  </ul>
                </>
              )}
            </TreeMenu>
          </div>

          <div className="col-sm-8 col-md-9">
            <div className="row">
              <div className="col-md-6">
                <Range
                  step={0.01}
                  min={currentCategoryBasedOnURL.price_range.min_price}
                  max={currentCategoryBasedOnURL.price_range.max_price}
                  values={priceRange.values}
                  onChange={(values) => {
                    setPriceRange({ values, isDragging: true });
                  }}
                  onFinalChange={(values) =>
                    handleRouteChange(priceRange.values, true, "priceFiltering")
                  }
                  draggableTrack
                  renderTrack={({ props, children }) => (
                    <div
                      onMouseDown={props.onMouseDown}
                      onTouchStart={props.onTouchStart}
                      style={{
                        ...props.style,
                        height: "36px",
                        display: "flex",
                        width: "100%",
                      }}
                    >
                      <div
                        ref={props.ref}
                        style={{
                          height: "5px",
                          width: "100%",
                          borderRadius: "4px",
                          background: getTrackBackground({
                            min: currentCategoryBasedOnURL.price_range
                              .min_price,
                            max: currentCategoryBasedOnURL.price_range
                              .max_price,
                            values: priceRange.values,
                            colors: ["#ccc", "#59AB6E", "#ccc"],
                          }),
                          alignSelf: "center",
                        }}
                      >
                        {children}
                      </div>
                    </div>
                  )}
                  renderThumb={({ index, props, isDragged }) => (
                    <div
                      {...props}
                      style={{
                        ...props.style,
                        height: `${THUMB_SIZE_HEIGHT}px`,
                        width: `${THUMB_SIZE_WIDTH}px`,
                        borderRadius: "4px",
                        backgroundColor: "#FFF",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        boxShadow: "0px 2px 6px #AAA",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: "-28px",
                          color: "#fff",
                          fontWeight: "bold",
                          fontSize: "14px",
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          padding: "4px",
                          borderRadius: "4px",
                          backgroundColor: "#59AB6E",
                        }}
                      >
                        {
                          "$" + priceRange.values[index].toFixed(2)
                          // .replace(/(\.0*|(?<=(\..*))0*)$/, "")
                          // .toString()
                        }
                      </div>
                      <div
                        style={{
                          height: "16px",
                          width: "5px",
                          backgroundColor: isDragged ? "#59AB6E" : "#CCC",
                        }}
                      />
                    </div>
                  )}
                />
              </div>
              <div className="col-md-6 pb-4">
                <div className="d-flex justify-content-end ">
                  <div className="btn-group me-2">
                    <button
                      className="btn btn-success btn-sm"
                      type="button"
                      style={{ cursor: "unset" }}
                    >
                      Items in page:
                      {router.query.page_size
                        ? " " + router.query.page_size
                        : " 6"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-success dropdown-toggle dropdown-toggle-split"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <span className="visually-hidden">Items in page:</span>
                    </button>

                    <ul
                      className="dropdown-menu"
                      style={{ cursor: "pointer" }}
                      aria-labelledby="dropdownMenuButton1"
                    >
                      <li
                        onClick={chosenPageSize}
                        className="dropdown-item"
                        data-value={6}
                      >
                        6
                      </li>
                      <li
                        onClick={chosenPageSize}
                        className="dropdown-item"
                        data-value={12}
                      >
                        12
                      </li>
                      <li
                        className="dropdown-item"
                        onClick={chosenPageSize}
                        data-value={18}
                      >
                        18
                      </li>
                      <li
                        className="dropdown-item"
                        onClick={chosenPageSize}
                        data-value={24}
                      >
                        24
                      </li>
                    </ul>
                  </div>
                  <div className="btn-group">
                    <button
                      className="btn btn-success btn-sm"
                      type="button"
                      style={{ cursor: "unset" }}
                    >
                      Sort by:
                      {!router.query.ordering ||
                      router.query.ordering === "updated_at"
                        ? " date (newest)"
                        : router.query.ordering === "-updated_at"
                        ? " date (oldest)"
                        : router.query.ordering === "-regular_price"
                        ? " price (high to low)"
                        : router.query.ordering === "regular_price" &&
                          " price (low to high)"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-success dropdown-toggle dropdown-toggle-split"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <span className="visually-hidden">Sort by:</span>
                    </button>

                    <ul
                      className="dropdown-menu"
                      style={{ cursor: "pointer" }}
                      aria-labelledby="dropdownMenuButton1"
                    >
                      {" "}
                      <li
                        onClick={chosenSort}
                        className="dropdown-item"
                        data-value={"-regular_price"}
                      >
                        price (high to low)
                      </li>
                      <li
                        onClick={chosenSort}
                        className="dropdown-item"
                        data-value={"regular_price"}
                      >
                        price (low to high)
                      </li>
                      <li
                        onClick={chosenSort}
                        className="dropdown-item"
                        data-value={"updated_at"}
                      >
                        date newest
                      </li>
                      <li
                        onClick={chosenSort}
                        className="dropdown-item"
                        data-value={"-updated_at"}
                      >
                        date oldest
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              {errorCode ? (
                <div>
                  <br />
                  <br />
                  {errorCode === 404 ? (
                    <>No item found for the specified criteria !</>
                  ) : (
                    <b>An error occured. Error Code :{errorCode}</b>
                  )}
                </div>
              ) : posts.results.length < 1 ? (
                <>No item found for the specified criteria !</>
              ) : (
                posts.results.map((post) => (
                  <div key={post.id} className="col-md-4">
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
                            <div className="row">
                              <div
                                {...(showHoverOnTouch.id !== post.id &&
                                  !showHoverOnTouch.boolean && {
                                    onClick: () =>
                                      singleProductLinkHandler(post.slug),
                                    className: " make-it-absolute",
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
                          <b>$ {post.regular_price}</b>
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
                ))
              )}
            </div>
            <div div="row">
              <ul className="pagination pagination-lg justify-content-end">
                {posts.previous && (
                  <li className="page-item">
                    <Link
                      href={{
                        // pathname: ,
                        query: { ...router.query, p: pageNumber - 1 },
                      }}
                      passHref
                    >
                      <a className="page-link rounded-0 mr-3 shadow-sm border-top-0 border-left-0 text-dark  responsivepagination">
                        Previous
                      </a>
                    </Link>
                  </li>
                )}
                {totalNumberOfPages.map((n, paginationPageNumber) => (
                  <div key={paginationPageNumber}>
                    {pageNumber == paginationPageNumber + 1 ? (
                      <li
                        key={paginationPageNumber + 1}
                        className="page-item disabled"
                      >
                        <Link
                          href={{
                            // pathname: ,
                            query: { ...router.query },
                          }}
                          passHref
                        >
                          <a
                            className="page-link active rounded-0 mr-3 shadow-sm border-top-0 border-left-0 responsivepagination"
                            tabIndex="-1"
                          >
                            {paginationPageNumber + 1}
                          </a>
                        </Link>
                      </li>
                    ) : (
                      <li key={paginationPageNumber + 1} className="page-item">
                        <Link
                          href={{
                            // pathname: ,
                            query: {
                              ...router.query,
                              p: paginationPageNumber + 1,
                            },
                          }}
                          passHref
                        >
                          <a
                            className="page-link rounded-0 mr-3 shadow-sm border-top-0 border-left-0 text-dark responsivepagination"
                            tabIndex="-1"
                          >
                            {paginationPageNumber + 1}
                          </a>
                        </Link>
                      </li>
                    )}
                  </div>
                ))}
                {posts.next && (
                  <li className="page-item">
                    <Link
                      href={{
                        // pathname: ,
                        query: { ...router.query, p: pageNumber + 1 },
                      }}
                      passHref
                    >
                      <a className="page-link rounded-0 mr-3 shadow-sm border-top-0 border-left-0 text-dark responsivepagination">
                        Next
                      </a>
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    let newResolvedUrl = "";

    context.resolvedUrl
      .replace("?", "&")
      .split("&")
      .filter((a) => !a.includes("slug="))
      .map((v, index) => {
        if (index === 0) {
          newResolvedUrl = v;
        } else if (index === 1) {
          newResolvedUrl += "?";
          newResolvedUrl += v;
        } else if (index > 1) {
          newResolvedUrl += "&";
          newResolvedUrl += v;
        }
      });

    const res1 = await fetch(`${endpoint}${newResolvedUrl}`);

    const errorCode = res1.ok ? false : res1.status;
    const posts = await res1.json();
    const res2 = await fetch(endpoint + "/tree-data-category-feed/");
    const treeDataCategoryFeed = await res2.json();
    const res3 = await fetch(endpoint + "/category/");
    const categories = await res3.json();

    return {
      props: {
        posts,
        errorCode,
        treeDataCategoryFeed,
        categories,
      },
    };
  }
);

const mapStateToProps = (state) => ({
  pagesize: state.pagesize.pagesize,
  myCartID: state.myCartID.myCartID,
  ordering: state.ordering.ordering,
});

const mapDispatchToProps = (dispatch) => {
  return {
    changePageSize: bindActionCreators(
      (event) => changePageSize(event.target.dataset.value),
      dispatch
    ),
    changeOrdering: bindActionCreators(
      (event) => changeOrdering(event.target.dataset.value),
      dispatch
    ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
