import { createStore, applyMiddleware, combineReducers } from "redux";
import { HYDRATE, createWrapper } from "next-redux-wrapper";
import thunkMiddleware from "redux-thunk";
import myCartID from "./cartID/reducer";
import tick from "./tick/reducer";
import pagesize from "./pagesize/reducer";
import ordering from "./ordering/reducer";

const bindMiddleware = (middleware) => {
  if (process.env.NODE_ENV !== "production") {
    const { composeWithDevTools } = require("redux-devtools-extension");
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

const combinedReducer = combineReducers({
  myCartID,
  tick,
  pagesize,
  ordering,
});

const reducer = (state, action) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    };
    if (state.myCartID.myCartID)
      nextState.myCartID.myCartID = state.myCartID.myCartID; // preserve myCartID value on client side navigation
    if (state.pagesize.pagesize)
      nextState.pagesize.pagesize = state.pagesize.pagesize; //
    if (state.ordering.ordering)
      nextState.ordering.ordering = state.ordering.ordering; //
    return nextState;
  } else {
    return combinedReducer(state, action);
  }
};

const initStore = () => {
  return createStore(reducer, bindMiddleware([thunkMiddleware]));
};

export const wrapper = createWrapper(initStore);
