export const cartIDActionTypes = {
  CHANGE: "CHANGE",
  DEFAULT: "DEFAULT",
};

export const changeCartID = (v) => (dispatch) => {
  if (v ? v.CHANGE : undefined)
    return dispatch({ type: cartIDActionTypes.CHANGE, val: v.VALUE });
  else return dispatch({ type: cartIDActionTypes.DEFAULT, val: null });
};
