export const orderingActionTypes = {
  // ADD: 'ADD',
  ASCENDINGUPDATE: "updated_at",
  DESCENDINGUPDATE: "-updated_at",
  ASCENDINGPRICE: "regular_price",
  DESCENDINGPRICE: "-regular_price",
  NONE: null,
};

export const changeOrdering = (e) => (dispatch) => {
  switch (e) {
    case "updated_at":
      return dispatch({ type: orderingActionTypes.ASCENDINGUPDATE });
    case "-updated_at":
      return dispatch({ type: orderingActionTypes.DESCENDINGUPDATE });
    case "regular_price":
      return dispatch({ type: orderingActionTypes.ASCENDINGPRICE });
    case "-regular_price":
      return dispatch({ type: orderingActionTypes.DESCENDINGPRICE });
    default:
      return dispatch({ type: orderingActionTypes.NONE });
  }
};
