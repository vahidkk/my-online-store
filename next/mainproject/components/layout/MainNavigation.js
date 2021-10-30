import Router, { useRouter } from "next/router";
import { useState } from "react";

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
          class="navbar navbar-expand-lg bg-dark navbar-light d-none d-lg-block"
          id="template_nav_top"
        >
          <div class="container text-light">
            <div class="w-100 d-flex justify-content-between">
              <div>
                <i class="fa fa-envelope mx-2"></i>
                <a
                  class="navbar-sm-brand text-light text-decoration-none"
                  href="mailto:info@email.com"
                >
                  info@email.com
                </a>
                <i class="fa fa-phone mx-2"></i>
                <a
                  class="navbar-sm-brand text-light text-decoration-none"
                  href="tel:010-020-0340"
                >
                  010-020-0340
                </a>
              </div>
              <div>
                <a
                  class="text-light"
                  href="https://fb.com/template"
                  target="_blank"
                  rel="sponsored"
                >
                  <i class="fab fa-facebook-f fa-sm fa-fw me-2"></i>
                </a>
                <a
                  class="text-light"
                  href="https://www.instagram.com/"
                  target="_blank"
                >
                  <i class="fab fa-instagram fa-sm fa-fw me-2"></i>
                </a>
                <a
                  class="text-light"
                  href="https://twitter.com/"
                  target="_blank"
                >
                  <i class="fab fa-twitter fa-sm fa-fw me-2"></i>
                </a>
                <a
                  class="text-light"
                  href="https://www.linkedin.com/"
                  target="_blank"
                >
                  <i class="fab fa-linkedin fa-sm fa-fw"></i>
                </a>
              </div>
            </div>
          </div>
        </nav>
        <nav class="navbar navbar-expand-lg navbar-light shadow">
          <div class="container  d-sm-flex d-md-block d-lg-flex justify-content-between align-items-center">
                <a
              class="navbar-brand  text-success logo h1 align-self-center"
              href="index.html"
            >
              STORE
            </a>
            <button
              class="navbar-toggler  border-0"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#template_main_nav"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button>
            <div
              class="align-self-center navbar-collapse flex-fill d-lg-flex justify-content-lg-between collapse show"
              id="template_main_nav"
              style={{}}
            >
              <div class="flex-fill">
                <ul class="nav navbar-nav d-flex justify-content-between mx-lg-auto">
                  <li class="nav-item ">
                    <a class="nav-link " href="/">
                      <i class="fas fa-home d-sm-inline d-lg-block px-2 "></i>
                      Home
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="about.html">
                      <i class="fas fa-trophy  d-sm-inline d-lg-block px-2"></i>
                      Best Sellers
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="shop.html">
                      <i class="fas fa-percentage  d-sm-inline d-lg-block px-2"></i>
                      Discounts
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="contact.html">
                      <i class="fas fa-question-circle  d-sm-inline d-lg-block px-2"></i>
                      Question?
                    </a>
                  </li>
                </ul>
              </div>

              <div class="navbar align-self-center d-flex ">
                <div class=" flex-sm-fill mt-3 mb-4 col-7 col-sm-auto pr-3 ">
                  <div class="input-group ">
                    <form
                      onSubmit={(e) => searchHandler(e)}
                      class="d-lg-inline"
                    >
                      <div class="input-group mb-1 ">
                        <input
                          type="text"
                          value={searchState}
                          onChange={(e) => {
                            setSearchState(e.target.value);
                          }}
                          class="form-control"
                          id="inputMobileSearch"
                          placeholder="Search ..."
                        />
                        <button
                          type="submit"
                          class="input-group-text bg-success text-light"
                        >
                          <i class="fa fa-fw fa-search mt-2"></i>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                <a
                  class="nav-icon position-relative text-decoration-none"
                  href="#"
                >
                  <i class="fa fa-fw fa-cart-arrow-down text-dark mr-1  px-md-3 mt-1"></i>
                  <span class="position-absolute top-0 left-100 translate-middle badge rounded-pill bg-light text-dark">
                    7
                  </span>
                </a>
                <a
                  class="nav-icon position-relative text-decoration-none"
                  href="#"
                >
                  <i class="fa fa-fw fa-user text-dark mr-3 px-md-3 mt-1"></i>
                  <span class="position-absolute top-0 left-100 translate-middle badge rounded-pill bg-light text-dark">
                    +99
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