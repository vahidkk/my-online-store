import Image from "next/image";
import Link from "next/link";
import javascript from "../public/javascript.png";
import python from "../public/python.png";
import css from "../public/css.png";
import { useEffect } from "react";
export default function IndexSlider() {
  useEffect(() => {
    if (typeof document !== undefined) {
      const { Carousel } = require("bootstrap");
    }
  }, []);
  return (
    <>
      <div
        id="template-hero-carousel"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <ol className="carousel-indicators">
          <li
            data-bs-target="#template-hero-carousel"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
          ></li>
          <li
            data-bs-target="#template-hero-carousel"
            data-bs-slide-to="1"
          ></li>
          <li
            data-bs-target="#template-hero-carousel"
            data-bs-slide-to="2"
          ></li>
        </ol>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div className="container">
              <div className="row p-5">
                <div className="mx-auto col-md-8 col-lg-6 order-lg-last text-center">
                  <Image
                    src={python}
                    alt="python"
                    width={180}
                    height={180}
                    objectFit="scale-down"
                    placeholder="blur"
                  />
                </div>
                <div className="col-lg-6 mb-0 d-flex align-items-center">
                  <div className="text-align-left align-self-center">
                    <h1 className="h1 text-success">Django Rest Framework</h1>
                    <h3 className="h2">Welcome to my store</h3>
                    <p>
                      This <b>STORE</b> is developed from scratch by using
                      Django Rest Framework as back-end and Nextjs as front-end
                      by <b>Vahid</b>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="carousel-item">
            <div className="container">
              <div className="row p-5">
                <div className="mx-auto col-md-8 col-lg-6 order-lg-last text-center ">
                  <Image
                    src={css}
                    alt="css"
                    width={180}
                    height={180}
                    objectFit="scale-down"
                    placeholder="blur"
                  />
                </div>
                <div className="col-lg-6 mb-0 d-flex align-items-center">
                  <div className="text-align-left">
                    <h1 className="h1 text-success">Bootstrap V5</h1>
                    <h3 className="h2">Quickly design and customize </h3>
                    <p>
                      Quickly design and customize responsive mobile-first sites
                      with Bootstrap, the worlds most popular front-end open
                      source toolkit, featuring Sass variables and mixins,
                      responsive grid system, extensive prebuilt components, and
                      powerful JavaScript plugins.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="carousel-item">
            <div className="container">
              <div className="row p-5">
                <div className="mx-auto col-md-8 col-lg-6 order-lg-last text-center">
                  <Image
                    src={javascript}
                    alt="javascript"
                    width={180}
                    height={180}
                    placeholder="blur"
                  />
                </div>
                <div className="col-lg-6 mb-0 d-flex align-items-center">
                  <div className="text-align-left">
                    <h1 className="h1 text-success">Nextjs</h1>
                    <h3 className="h2">The React Framework for Production</h3>
                    <p>
                      Next.js gives you the best developer experience with all
                      the features you need for production: hybrid static &
                      server rendering, TypeScript support, smart bundling,
                      route pre-fetching, and more. No config needed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <a
          className="carousel-control-prev text-decoration-none w-auto ps-3"
          href="#template-hero-carousel"
          role="button"
          data-bs-target="#template-hero-carousel"
          data-bs-slide="prev"
        >
          <i className="fas fa-chevron-left"></i>
        </a>
        <a
          className="carousel-control-next text-decoration-none w-auto pe-3"
          href="#template-hero-carousel"
          role="button"
          data-bs-target="#template-hero-carousel"
          data-bs-slide="next"
        >
          <i className="fas fa-chevron-right"></i>
        </a>
      </div>
    </>
  );
}
