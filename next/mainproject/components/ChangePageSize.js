import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changePageSize } from "../store/pagesize/action";

import { useRouter } from "next/router";

const ChangePageSize = ({ pagesize, changePageSize }) => {
  const router = useRouter();

  const handleRouteChange = (url) => {
    console.log(`App is changing to ${url} `);
    console.log(router);
    router.push({
      pathname: router.asPath,
      query: { page_size: pagesize },
    });
  };
  return (
    <>
      value={pagesize}
      {console.log("pagesize=", pagesize)}
      <select
        className="form-control"
        name="option"
        defaultValue={pagesize}
        onChange={(event) => {
          changePageSize(event);
          handleRouteChange();
        }}
      >
        <option value="6">Items in page: 6 </option>
        <option value="12">Items in page: 12</option>
        <option value="18">Items in page: 18</option>
        <option value="24">Items in page: 24</option>
      </select>
    </>
  );
};

const mapStateToProps = (state) => ({
  pagesize: state.pagesize.pagesize,
});

const mapDispatchToProps = (dispatch) => {
  return {
    changePageSize: bindActionCreators(
      (event) => changePageSize(event.target.value),
      dispatch
    ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangePageSize);
