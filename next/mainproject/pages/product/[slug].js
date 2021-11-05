import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/dist/client/link";
import { useEffect } from "react";

function Product({ post, categories }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

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

  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>
      <section class="bg-light">
        <div class="container pb-5">
          {/* --START OF BREADCRUMB-- */}
          <nav
            style={{ "--bs-breadcrumb-divider": '">"' }}
            aria-label="breadcrumb"
          >
            <ol class="breadcrumb">
              {categoriesAsObject.map((cat, id) => (
                <>
                  {categoriesAsObject.length === id + 1 ? (
                    <li class="breadcrumb-item active" aria-current="page">
                      {cat.label}
                    </li>
                  ) : (
                    <li class="breadcrumb-item">
                      <Link
                        href={{
                          pathname: "/category/" + cat.url,
                          // query: router.query ,
                        }}
                        passHref
                      >
                        <a>{cat.label}</a>
                      </Link>
                    </li>
                  )}
                </>
              ))}
            </ol>
          </nav>
          {/* --END OF BREADCRUMB-- */}
          <div class="row">
            <div class="col-lg-5 mt-5">
              <div class="card mb-3">
                {/* THIS IS THE DEFAULT PHOTO : */}
                <img
                  class="card-img img-fluid"
                  src={post.product_image[0].image}
                  alt={post.product_image[0].alt_text}
                  id="product-detail"
                />
              </div>
              <div class="row">
                {/* --Start Controls */}
                <div class="col-1 align-self-center">
                  <a
                    href="#multi-item-example"
                    role="button"
                    data-bs-slide="prev"
                  >
                    <i class="text-dark fas fa-chevron-left"></i>
                    <span class="sr-only">Previous</span>
                  </a>
                </div>
                {/* --End Controls */}
                {/* --Start Carousel Wrapper */}
                <div
                  id="multi-item-example"
                  class="col-10 carousel slide carousel-multi-item"
                  data-bs-ride="carousel"
                >
                  {/* --Start Slides */}
                  <div class="carousel-inner product-links-wap" role="listbox">
                    {/* --First slide should be 3 pictures */}
                    <div class="carousel-item">
                      <div class="row">
                        {post.product_image.map((c) => (
                          <div class="col-4" key={c.id}>
                            <a href="#">
                              <img
                                class="card-img img-fluid"
                                src={c.image}
                                alt={c.alt_text}
                              />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* --First slide-- */}

                    {/* --Second slide-- */}
                    <div class="carousel-item">
                      <div class="row">
                        <div class="col-4">
                          <a href="#">
                            <img
                              class="card-img img-fluid"
                              src="assets/img/product_single_04.jpg"
                              alt="Product Image 4"
                            />
                          </a>
                        </div>
                        <div class="col-4">
                          <a href="#">
                            <img
                              class="card-img img-fluid"
                              src="assets/img/product_single_05.jpg"
                              alt="Product Image 5"
                            />
                          </a>
                        </div>
                        <div class="col-4">
                          <a href="#">
                            <img
                              class="card-img img-fluid"
                              src="assets/img/product_single_06.jpg"
                              alt="Product Image 6"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                    {/* --/.Second slide */}

                    {/* --Third slide */}
                    <div class="carousel-item active">
                      <div class="row">
                        <div class="col-4">
                          <a href="#">
                            <img
                              class="card-img img-fluid"
                              src="assets/img/product_single_07.jpg"
                              alt="Product Image 7"
                            />
                          </a>
                        </div>
                        <div class="col-4">
                          <a href="#">
                            <img
                              class="card-img img-fluid"
                              src="assets/img/product_single_08.jpg"
                              alt="Product Image 8"
                            />
                          </a>
                        </div>
                        <div class="col-4">
                          <a href="#">
                            <img
                              class="card-img img-fluid"
                              src="assets/img/product_single_09.jpg"
                              alt="Product Image 9"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                    {/* --/.Third slide */}
                  </div>
                  {/* --End Slides */}
                </div>
                {/* --End Carousel Wrapper */}
                {/* --Start Controls */}
                <div class="col-1 align-self-center">
                  <a
                    href="#multi-item-example"
                    role="button"
                    data-bs-slide="next"
                  >
                    <i class="text-dark fas fa-chevron-right"></i>
                    <span class="sr-only">Next</span>
                  </a>
                </div>
                {/* --End Controls */}
              </div>
            </div>
            {/* -- col end  */}
            <div class="col-lg-7 mt-5">
              <div class="card">
                <div class="card-body">
                  <h1 class="h2">{post.title}</h1>
                  <p class="h3 py-2">{post.regular_price}</p>
                  <p class="py-2">
                    <i class="fa fa-star text-warning"></i>
                    <i class="fa fa-star text-warning"></i>
                    <i class="fa fa-star text-warning"></i>
                    <i class="fa fa-star text-warning"></i>
                    <i class="fa fa-star text-secondary"></i>
                    <span class="list-inline-item text-dark">
                      Rating 4.8 | 6 Comments
                    </span>
                  </p>
                  <ul class="list-inline">
                    <li class="list-inline-item">
                      <h6>Brand:</h6>
                    </li>
                    <li class="list-inline-item">
                      <p class="text-muted">
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
                  <ul class="list-inline">
                    <li class="list-inline-item">
                      <h6>Avaliable Color :</h6>
                    </li>
                    <li class="list-inline-item">
                      <p class="text-muted">
                        <strong>White / Black</strong>
                      </p>
                    </li>
                  </ul>

                  <h6>Specification:</h6>
                  <ul class="list-unstyled pb-3">
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
                    <div class="row">
                      <div class="col-auto">
                        <ul class="list-inline pb-3">
                          <li class="list-inline-item">
                            Size :
                            <input
                              type="hidden"
                              name="product-size"
                              id="product-size"
                              value="S"
                            />
                          </li>
                          <li class="list-inline-item">
                            <span class="btn btn-success btn-size">S</span>
                          </li>
                          <li class="list-inline-item">
                            <span class="btn btn-success btn-size">M</span>
                          </li>
                          <li class="list-inline-item">
                            <span class="btn btn-success btn-size">L</span>
                          </li>
                          <li class="list-inline-item">
                            <span class="btn btn-success btn-size">XL</span>
                          </li>
                        </ul>
                      </div>
                      <div class="col-auto">
                        <ul class="list-inline pb-3">
                          <li class="list-inline-item text-right">
                            Quantity
                            <input
                              type="hidden"
                              name="product-quanity"
                              id="product-quanity"
                              value="1"
                            />
                          </li>
                          <li class="list-inline-item">
                            <span class="btn btn-success" id="btn-minus">
                              -
                            </span>
                          </li>
                          <li class="list-inline-item">
                            <span class="badge bg-secondary" id="var-value">
                              1
                            </span>
                          </li>
                          <li class="list-inline-item">
                            <span class="btn btn-success" id="btn-plus">
                              +
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div class="row pb-3">
                      <div class="col d-grid">
                        <button
                          type="submit"
                          class="btn btn-success btn-lg"
                          name="submit"
                          value="buy"
                        >
                          Buy
                        </button>
                      </div>
                      <div class="col d-grid">
                        <button
                          type="submit"
                          class="btn btn-success btn-lg"
                          name="submit"
                          value="addtocard"
                        >
                          Add To Cart
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* START OF RELATED PRODUCTS SECTION : */}

      <section class="py-5">
        <div class="container">
          <div class="row text-left p-2 pb-3">
            <h4>Related Products</h4>
          </div>
        </div>
      </section>
      {/* END OF RELATED PRODUCTS SECTION  */}
    </>
  );
}

export async function getStaticPaths() {
  return {
    paths: [
      {
        params: {
          slug: "Paint-by-Sticker-Kids-Christmas-Create-10-Pictures-One-Sticker-at-a-Time-Includes-Glitter-Stickers",
        },
      },
    ],
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const res = await fetch(`http://127.0.0.1:8000/api/products/${params.slug}/`);
  const post = await res.json();

  const ress = await fetch("http://127.0.0.1:8000/api/category/");
  const categories = await ress.json();

  return {
    props: {
      post,
      categories,
    },
  };
}

export default Product;
