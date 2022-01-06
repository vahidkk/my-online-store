import { useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Page from "../components/Page";
import { changeCartID } from "../store/cartID/action";
import { changePageSize } from "../store/pagesize/action";
import { wrapper } from "../store/store";
import { serverRenderClock, startClock } from "../store/tick/action";

const Other = (props) => {
  useEffect(() => {
    const timer = props.startClock();

    return () => {
      clearInterval(timer);
    };
  }, [props]);

  return <Page title="Other Page" linkTo="/" />;
};

export const getServerSideProps = wrapper.getServerSideProps((store) => () => {
  store.dispatch(serverRenderClock(true));
  store.dispatch(changeCartID());
  store.dispatch(changePageSize());
});

const mapDispatchToProps = (dispatch) => {
  return {
    changeCartID: bindActionCreators(changeCartID, dispatch),
    startClock: bindActionCreators(startClock, dispatch),
    changePageSize: bindActionCreators(changePageSize, dispatch),
  };
};

export default connect(null, mapDispatchToProps)(Other);
