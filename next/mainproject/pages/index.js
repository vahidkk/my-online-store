import { endpoint } from "../utils/constants";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import IndexSlider from "../components/IndexSlider";
import IndexCategories from "../components/IndexCategories";
import IndexFeaturedItems from "../components/IndexFeaturedItems";
import { connect } from "react-redux";
function Index({ products, categories, myCartID }) {
  return (
    <>
      <Head>
        <title>Welcome to STORE</title>
      </Head>
      <IndexSlider />
      {/* <Page title="Index Page" linkTo="/other" /> */}
      <IndexCategories categories={categories} />
      <IndexFeaturedItems products={products} myCartID={myCartID} />
    </>
  );
}

export async function getStaticProps() {
  const res = await fetch(`${endpoint}/products/`);
  const products = await res.json();

  // const ress = await fetch("${endpoint}/category/");
  const ress = await fetch(`${endpoint}/tree-data-category-feed/`);
  const categories = await ress.json();

  return {
    props: {
      products,
      categories,
    },
  };
}

const mapStateToProps = (state) => ({
  myCartID: state.myCartID.myCartID,
});

export default connect(mapStateToProps)(Index);

// export const getStaticProps = wrapper.getStaticProps((store) => () => {
//   store.dispatch(serverRenderClock(true));
//   store.dispatch(changeCartID());
//   store.dispatch(changePageSize());
//   store.dispatch(changeOrdering());
// });

// const mapDispatchToProps = (dispatch) => {
//   return {
//     changeCartID: bindActionCreators(changeCartID, dispatch),
//     startClock: bindActionCreators(startClock, dispatch),
//     changePageSize: bindActionCreators(changePageSize, dispatch),
//     changeOrdering: bindActionCreators(changeOrdering, dispatch),
//   };
// };

// export default connect(null, mapDispatchToProps)(Index);
