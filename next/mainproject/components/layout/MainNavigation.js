import Link from "next/link";
import Router, { useRouter } from "next/router";
import { useState } from "react";
import CartTooltip from "../CartTooltip";
import CartPopper from "../BasketTooltip";
import CartTooltip2 from "../BasketTooltip";

export default function MainNavigation() {
  const router = useRouter();
  const [searchState, setSearchState] = useState("");
  const searchHandler = (term) => {
    term.preventDefault();
    setSearchState(term.target.value);
    router.query.p && delete router.query.p;
    router.query.search = searchState;
    router.push(
      {
        // pathname: router.asPath,
        query: router.query,
      },
      undefined,
      { shallow: false }
    );
    setSearchState("");
  };
  return (
    <>
      <header>
        <nav
          className="navbar navbar-expand-lg bg-dark navbar-light d-none d-lg-block"
          id="template_nav_top"
        >
          <div className="container text-light">
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
                <a
                  className="text-light"
                  href="https://fb.com/template"
                  rel="sponsored"
                >
                  <i className="fab fa-facebook-f fa-sm fa-fw me-2"></i>
                </a>
                <a className="text-light" href="https://www.instagram.com/">
                  <i className="fab fa-instagram fa-sm fa-fw me-2"></i>
                </a>
                <a className="text-light" href="https://twitter.com/">
                  <i className="fab fa-twitter fa-sm fa-fw me-2"></i>
                </a>
                <a className="text-light" href="https://www.linkedin.com/">
                  <i className="fab fa-linkedin fa-sm fa-fw"></i>
                </a>
              </div>
            </div>
          </div>
        </nav>
        <nav className="navbar navbar-expand-lg navbar-light shadow">
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
              className="align-self-center navbar-collapse flex-fill d-lg-flex justify-content-lg-between collapse show"
              id="template_main_nav"
              style={{}}
            >
              <div className="flex-fill">
                <ul className="nav navbar-nav d-flex justify-content-between mx-lg-auto">
                  <li key="home" className="nav-item ">
                    <Link href="/">
                      <a className="nav-link ">
                        <i className="fas fa-home d-sm-inline d-lg-block px-2 "></i>
                        Home
                      </a>
                    </Link>
                  </li>
                  <li i="Best Sellers " className="nav-item">
                    <a className="nav-link" href="about.html">
                      <i className="fas fa-trophy  d-sm-inline d-lg-block px-2"></i>
                      Best Sellers
                    </a>
                  </li>
                  <li key="discount" className="nav-item">
                    <a className="nav-link" href="shop.html">
                      <i className="fas fa-percentage  d-sm-inline d-lg-block px-2"></i>
                      Discounts
                    </a>
                  </li>
                  <li key="question" className="nav-item">
                    <a className="nav-link" href="contact.html">
                      <i className="fas fa-question-circle  d-sm-inline d-lg-block px-2"></i>
                      Question?
                    </a>
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
                <a className="nav-icon position-relative text-decoration-none ">
                  <CartPopper />
                </a>
                <a className="nav-icon position-relative text-decoration-none">
                  <i className="fa fa-fw fa-user text-dark mr-3 px-md-3 mt-1"></i>
                  <span className="position-absolute top-0 left-100 translate-middle badge rounded-pill bg-light text-dark">
                    7
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
