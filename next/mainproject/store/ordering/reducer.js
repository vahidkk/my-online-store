import { orderingActionTypes } from "./action";

const orderingInitialState = {
  ordering: null,
};

export default function reducer(state = orderingInitialState, action) {
  switch (action.type) {
    case orderingActionTypes.DESCENDINGUPDATE:
      return Object.assign({}, state, {
        ordering: "updated_at",
      });
    case orderingActionTypes.DESCENDINGUPDATE:
      return Object.assign({}, state, {
        ordering: "-updated_at",
      });
    case orderingActionTypes.ASCENDINGPRICE:
      return Object.assign({}, state, {
        ordering: "regular_price",
      });
    case orderingActionTypes.DESCENDINGPRICE:
      return Object.assign({}, state, {
        ordering: "-regular_price",
      });
    default:
      return state;
  }
}
