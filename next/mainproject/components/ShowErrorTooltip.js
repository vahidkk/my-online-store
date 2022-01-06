export default function ShowErrorTooltip({ props }) {
  return (
    <>
      {props.errorOccured.errorCode &&
        props.errorOccured.itemCode === props.i.id && (
          <div
            onClick={props.setErrorOccured}
            ref={props.setTooltipRef}
            {...props.getTooltipProps({
              className: "tooltip-container error-msg background-unset-on-hove",
            })}
          >
            <span className="background-unset-on-hove pt-2 pe-2">
              {/* <div className="d-flex justify-content-center ms-1 mt-1"> */}
              <small>
                <p className="text-danger  error-font-size background-unset-on-hove pt-2 pt-sm-0">
                  Could not{" "}
                  {props.customErrorText
                    ? props.customErrorText
                    : props.errorOccured.actionType}{" "}
                  the item. ({props.errorOccured.errorCode})
                </p>
              </small>
              {/* </div> */}
              <i className="fas fa-window-close error-close-button pe-3 pt-1 pe-sm-0 pt-sm-0"></i>

              <div
                {...props.getArrowProps({
                  className: "tooltip-arrow background-unset-on-hove",
                })}
              />
            </span>
          </div>
        )}
    </>
  );
}
