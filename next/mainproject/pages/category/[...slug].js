import Link from "next/link";
import { useRouter } from "next/router";
import TreeMenu, {
  defaultChildren,
  ItemComponent,
} from "react-simple-tree-menu";
import Head from "next/head";

function Home({ posts, categories }) {
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const pageNumber = parseInt(
    router.query.p && router.query.p > 0 ? router.query.p : 1
  );
  const pageSize = parseInt(
    router.query.page_size && router.query.page_size > 2
      ? router.query.page_size
      : 4
  );

  const treeFeedObj = categories;

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
  const currentPageLabel = pathToPageTitle(
    treeFeedObj,
    router.query.slug.join("/")
  )
    .split("/")
    .slice(-1)[0]; // this will return the last member of lables which is current page's category title to be used on Head
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
  for (let i = rootAsArray.length - 1; i >= 0; i--) {
    initialOpens.push(rootAsArray.slice(0, i + 1).join("/"));
  }

  // end of finding ancestors of category .########################################################################
  // start of pagination variables :###############################################################################
  const totalNumberOfPages = Array(
    posts.count % pageSize === 0
      ? posts.count / pageSize
      : parseInt(posts.count / pageSize) + 1
  ).fill(null);
  //  end of pagination variables  ################################################################################
  return (
    <>
      <Head>
        <title>{currentPageLabel}</title>
      </Head>
      <div class="container py-5">
        <div class="row">
          <div class="col-lg-3">
            <h1 class="h2 pb-4">Categories</h1>
            <TreeMenu
              data={treeFeedObj}
              initialActiveKey={pathToSlash(treeFeedObj, router.query.slug)}
              initialOpenNodes={initialOpens}
              onClickItem={({ key, label, ...props }) =>
                router.push({ pathname: props.url }, undefined, {
                  shallow: false,
                })
              }
            >
              {({ search, items }) => (
                <>
                  <input
                    class="rstm-search"
                    onChange={(e) => search(e.target.value)}
                    placeholder="Search categories"
                  />
                  <ul class="rstm-tree-item-group">
                    {items.map(({ key, ...props }) => (
                      <>
                        <ItemComponent key={key} {...props} />
                      </>
                    ))}
                  </ul>
                </>
              )}
            </TreeMenu>
          </div>

          <div class="col-lg-9">
            <div class="row">
              <div class="col-md-6">
                <ul class="list-inline shop-top-menu pb-3 pt-1">
                  <li class="list-inline-item">
                    <a class="h3 text-dark text-decoration-none mr-3" href="#">
                      Cat link1
                    </a>
                  </li>
                  <li class="list-inline-item">
                    <a class="h3 text-dark text-decoration-none mr-3" href="#">
                      Cat link2
                    </a>
                  </li>
                  <li class="list-inline-item">
                    <a class="h3 text-dark text-decoration-none" href="#">
                      Cat link3
                    </a>
                  </li>
                </ul>
              </div>
              <div class="col-md-6 pb-4">
                <div class="d-flex">
                  <select class="form-control">
                    <option>Featured</option>
                    <option>A to Z</option>
                    <option>other sorting options</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="row">
              {posts.results.map((post) => (
                <div key={post.id} class="col-md-4">
                  <div class="card mb-4 product-wap rounded-0">
                    <div class="card results.rounded-0">
                      <img
                        class="card-img rounded-0 img-fluid"
                        src={post.product_image[0].image}
                        alt={post.product_image[0].alt_text}
                      />
                      <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                        <ul class="results.list-unstyled">
                          <li>
                            <a
                              class="btn btn-success text-white"
                              href={`/product/${encodeURIComponent(post.slug)}`}
                            >
                              <i class="far fa-heart"></i>
                            </a>
                          </li>
                          <li>
                            <a
                              class="btn btn-success text-white mt-2"
                              href={`/product/${encodeURIComponent(post.slug)}`}
                            >
                              <i class="far fa-eye"></i>
                            </a>
                          </li>
                          <li>
                            <a
                              class="btn btn-success text-white mt-2"
                              href={`/product/${encodeURIComponent(post.slug)}`}
                            >
                              <i class="fas fa-cart-plus"></i>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div class="results.card-body">
                      <a
                        href={`/product/${encodeURIComponent(post.slug)}`}
                        class="h3 text-decoration-none"
                      >
                        {post.title}
                      </a>
                      <ul class="w-100 list-unstyled d-flex justify-content-between mb-0">
                        <li>
                          <b>Free Delivery</b>
                        </li>
                        <li class="pt-2">
                          <span class="product-color-dot color-dot-red float-left rounded-circle ml-1"></span>
                          <span class="product-color-dot color-dot-blue float-left rounded-circle ml-1"></span>
                          <span class="product-color-dot color-dot-black float-left rounded-circle ml-1"></span>
                          <span class="product-color-dot color-dot-light float-left rounded-circle ml-1"></span>
                          <span class="product-color-dot color-dot-green float-left rounded-circle ml-1"></span>
                        </li>
                      </ul>
                      <ul class="list-unstyled d-flex justify-content-center mb-1">
                        <li>
                          <i class="text-warning fa fa-star"></i>
                          <i class="text-warning fa fa-star"></i>
                          <i class="text-warning fa fa-star"></i>
                          <i class="text-muted fa fa-star"></i>
                          <i class="text-muted fa fa-star"></i>
                        </li>
                      </ul>
                      <p class="text-center mb-0">$ :{post.regular_price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div div="row">
              <ul class="pagination pagination-lg justify-content-end">
                {posts.previous && (
                  <li class="page-item">
                    <Link
                      href={{
                        // pathname: ,
                        query: { ...router.query, p: pageNumber - 1 },
                      }}
                      passHref
                    >
                      <a class="page-link rounded-0 mr-3 shadow-sm border-top-0 border-left-0 text-dark  responsivepagination">
                        Previous
                      </a>
                    </Link>
                  </li>
                )}
                {totalNumberOfPages.map((n, paginationPageNumber) => (
                  <>
                    {pageNumber == paginationPageNumber + 1 ? (
                      <li class="page-item disabled">
                        <Link
                          href={{
                            // pathname: ,
                            query: { ...router.query },
                          }}
                          passHref
                        >
                          <a
                            class="page-link active rounded-0 mr-3 shadow-sm border-top-0 border-left-0 responsivepagination"
                            tabindex="-1"
                          >
                            {paginationPageNumber + 1}
                          </a>
                        </Link>
                      </li>
                    ) : (
                      <li class="page-item">
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
                            class="page-link rounded-0 mr-3 shadow-sm border-top-0 border-left-0 text-dark responsivepagination"
                            tabindex="-1"
                          >
                            {paginationPageNumber + 1}
                          </a>
                        </Link>
                      </li>
                    )}
                  </>
                ))}
                {posts.next && (
                  <li class="page-item">
                    <Link
                      href={{
                        // pathname: ,
                        query: { ...router.query, p: pageNumber + 1 },
                      }}
                      passHref
                    >
                      <a class="page-link rounded-0 mr-3 shadow-sm border-top-0 border-left-0 text-dark responsivepagination">
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

export async function getServerSideProps(context) {
  let newResolvedUrl = "";
  context.resolvedUrl
    .replace("?", "&")
    .split("&")
    .map((v, index) => {
      if (index === 0) {
        newResolvedUrl = v;
      } else if (index === 1 && !v.includes("slug")) {
        newResolvedUrl += "?";
        newResolvedUrl += v;
      } else if (index > 1 && !v.includes("slug")) {
        newResolvedUrl += "&";
        newResolvedUrl += v;
      }
    });
  const res = await fetch(`http://127.0.0.1:8000/api${newResolvedUrl}`);
  //page_size must be accessible on redux to be app wise instead of locally ( to be implemented later ! )
  const posts = await res.json();
  const ress = await fetch("http://127.0.0.1:8000/api/category/");
  const categories = await ress.json();

  return {
    props: {
      posts,
      categories,
    },
  };
}

export default Home;
