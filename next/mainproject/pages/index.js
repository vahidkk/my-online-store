import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import IndexSlider from "../components/IndexSlider";
import IndexCategories from "../components/IndexCategories";
import IndexFeaturedItems from "../components/IndexFeaturedItems";
import { useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Page from "../components/Page";
import { changeCartID } from "../store/cartID/action";
import { changePageSize } from "../store/pagesize/action";
import { changeOrdering } from "../store/ordering/action";
import { wrapper } from "../store/store";
import { serverRenderClock, startClock } from "../store/tick/action";

const Index = (props) => {
  useEffect(() => {
    const timer = props.startClock();

    return () => {
      clearInterval(timer);
    };
  }, [props]);

  return (
    <>
      <IndexSlider />
      <Page title="Index Page" linkTo="/other" />
      <IndexCategories />
      <IndexFeaturedItems />
    </>
  );
};

export const getStaticProps = wrapper.getStaticProps((store) => () => {
  store.dispatch(serverRenderClock(true));
  store.dispatch(changeCartID());
  store.dispatch(changePageSize());
  store.dispatch(changeOrdering());
});

const mapDispatchToProps = (dispatch) => {
  return {
    changeCartID: bindActionCreators(changeCartID, dispatch),
    startClock: bindActionCreators(startClock, dispatch),
    changePageSize: bindActionCreators(changePageSize, dispatch),
    changeOrdering: bindActionCreators(changeOrdering, dispatch),
  };
};

export default connect(null, mapDispatchToProps)(Index);
