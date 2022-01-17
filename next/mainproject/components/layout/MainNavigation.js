import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import CartPopper from "../BasketTooltip";
import shoppingHome from "../../public/green-icons/shopping.png";
import quality from "../../public/green-icons/quality.png";
import discount from "../../public/green-icons/discount.png";
import telephone from "../../public/green-icons/telephone.png";
import user from "../../public/green-icons/user.png";
export default function MainNavigation() {
  const router = useRouter();
  const [searchState, setSearchState] = useState("");
  const searchHandler = (term) => {
    term.preventDefault();
    setSearchState(term.target.value);
    if (searchState && searchState.length > 0) {
      router.query.p && delete router.query.p;
      router.query.slug && delete router.query.slug;
      router.query.search = searchState;
      router.push(
        {
          pathname: "/products/allItems",
          query: router.query,
        },
        undefined,
        { shallow: false }
      );
      setSearchState("");
    }
  };
  useEffect(() => {
    if (typeof document !== undefined) {
      const { Collapse } = require("bootstrap");
    }
  }, []);
  return (
    <>
      <header>
        <nav
          className="navbar navbar-expand-lg bg-dark navbar-light d-none d-lg-block"
          id="template_nav_top"
        >
          <div className="container text-light ">
            <div className="w-100 d-flex justify-content-between">
              <div>
                <i className="fa fa-envelope mx-2"></i>
                <a
                  className="navbar-sm-brand text-light text-decoration-none"
                  href="mailto:info@email.com"
                >
                  info@email.com
                </a>
                <i className="fa fa-phone mx-2"></i>
                <a
                  className="navbar-sm-brand text-light text-decoration-none"
                  href="tel:010-020-0340"
                >
                  010-020-0340
                </a>
              </div>
              <div>
                <Link href="#">
                  <a className="text-light" rel="sponsored">
                    <i className="fab fa-facebook-f fa-sm fa-fw me-2"></i>
                  </a>
                </Link>
                <Link href="#">
                  <a className="text-light">
                    <i className="fab fa-instagram fa-sm fa-fw me-2"></i>
                  </a>
                </Link>
                <Link href="#">
                  <a className="text-light">
                    <i className="fab fa-twitter fa-sm fa-fw me-2"></i>
                  </a>
                </Link>
                <Link href="#">
                  <a className="text-light">
                    <i className="fab fa-linkedin fa-sm fa-fw"></i>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <nav className="navbar navbar-expand-lg navbar-light shadow ">
          <div className="container  d-sm-flex d-md-block d-lg-flex justify-content-between align-items-center">
            <Link href="/">
              <a
                className="navbar-brand  text-success logo h1 align-self-center"
                // href="index.html"
              >
                STORE
              </a>
            </Link>
            <button
              className="navbar-toggler  border-0"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#template_main_nav"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="align-self-center navbar-collapse flex-fill d-lg-flex justify-content-lg-between collapse "
              id="template_main_nav"
              style={{}}
            >
              <div className="flex-fill">
                <ul className="nav navbar-nav d-flex justify-content-between mx-lg-auto">
                  <li key="home" className=" text-lg-center nav-item  ">
                    <div className="d-flex d-lg-block flex-row align-items-center ">
                      <div className="">
                        <Link href="/">
                          <a className="nav-link">
                            <Image
                              src={shoppingHome}
                              alt={"home"}
                              width={50}
                              height={50}
                              // layout="responsive"
                              placeholder="blur"
                            />
                          </a>
                        </Link>
                      </div>
                      <Link href="/">
                        <a className="nav-link">
                          <div className="ms-3 ms-lg-0">home</div>
                        </a>
                      </Link>
                    </div>
                  </li>
                  <li i="Best Sellers " className=" text-lg-center nav-item">
                    <div className="d-flex d-lg-block flex-row align-items-center ">
                      <div className="">
                        <Link href="#">
                          <a className="nav-link">
                            <Image
                              src={quality}
                              alt={"quality"}
                              width={50}
                              height={50}
                              placeholder="blur"
                            />
                          </a>
                        </Link>
                      </div>
                      <Link href="#">
                        <a className="nav-link">
                          <div className="ms-3 ms-lg-0">quality</div>
                        </a>
                      </Link>
                    </div>
                  </li>
                  <li key="discount" className=" text-lg-center nav-item ">
                    <div className="d-flex d-lg-block flex-row align-items-center ">
                      <div className="">
                        <Link href="#">
                          <a className="nav-link">
                            <Image
                              src={discount}
                              alt={"discount"}
                              width={50}
                              height={50}
                              placeholder="blur"
                            />
                          </a>
                        </Link>
                      </div>
                      <Link href="#">
                        <a className="nav-link">
                          <div className="ms-3 ms-lg-0">discounts</div>
                        </a>
                      </Link>
                    </div>
                  </li>
                  {/* <i className="fas fa-question-circle  d-sm-inline d-lg-block px-2"></i> */}
                  <li key="question" className=" text-lg-center nav-item">
                    <div className="d-flex d-lg-block flex-row align-items-center ">
                      <div className="">
                        <Link href="#">
                          <a className="nav-link">
                            <Image
                              src={telephone}
                              alt={"telephone"}
                              width={50}
                              height={50}
                              placeholder="blur"
                            />
                          </a>
                        </Link>
                      </div>
                      <Link href="#">
                        <a className="nav-link">
                          <div className="ms-3 ms-lg-0">question?</div>
                        </a>
                      </Link>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="navbar align-self-center d-flex ">
                <div className=" flex-sm-fill mt-3 mb-4 col-7 col-sm-auto pr-3 ">
                  <div className="input-group ">
                    <form
                      onSubmit={(e) => searchHandler(e)}
                      className="d-lg-inline"
                    >
                      <div className="input-group mb-1 ">
                        <input
                          type="text"
                          value={searchState}
                          onChange={(e) => {
                            setSearchState(e.target.value);
                          }}
                          className="form-control"
                          id="inputMobileSearch"
                          placeholder="Search ..."
                        />
                        <button
                          type="submit"
                          className="input-group-text bg-success text-light"
                        >
                          <i className="fa fa-fw fa-search mt-2"></i>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                <span className="nav-icon position-relative text-decoration-none ">
                  <CartPopper />
                </span>
                <a className="nav-icon position-relative text-decoration-none">
                  {/* <i className="fa fa-fw fa-user text-dark mr-3 px-md-3 mt-1"></i> */}
                  <Image src={user} alt={"user"} width={30} height={30} />
                  <span className="position-absolute top-0 left-100 translate-middle badge rounded-pill bg-light text-dark">
                    0
                  </span>
                </a>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
