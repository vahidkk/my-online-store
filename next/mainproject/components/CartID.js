import React, { useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changeCartID } from "../store/cartID/action";

const CartID = ({ myCartID, changeCartID }) => {
  changeCartID({
    CHANGE: myCartID === null ? true : false,
    VALUE: new Date().getUTCMilliseconds(),
  });
  return (
    <div>
      <style jsx>{`
        div {
          padding: 0 0 20px 0;
        }
      `}</style>
      <h1>
        CartID: <span>{myCartID}</span>
      </h1>
      {/* <button onClick={changeCartID}>Add To Count</button> */}
    </div>
  );
};

const mapStateToProps = (state) => ({
  myCartID: state.myCartID.myCartID,
});

const mapDispatchToProps = (dispatch) => {
  return {
    changeCartID: bindActionCreators(
      (newValue) => changeCartID(newValue),
      dispatch
    ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CartID);

// const mapStateToProps = (state) => ({
//   pagesize: state.pagesize.pagesize,
// });

// const mapDispatchToProps = (dispatch) => {
//   return {
//     changePageSize: bindActionCreators(
//       (event) => changePageSize(event.target.value),
//       dispatch
//     ),
//   };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(ChangePageSize);
