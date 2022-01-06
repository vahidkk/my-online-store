import React, { Children, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import CartTooltip from "../components/CartTooltip";
const MyTestBox = ({ children }) => {
  // const ReactTooltip = dynamic(() => import("react-tooltip"), { ssr: false });
  const [cartIsVisible, setCartIsVisible] = useState(false);
  // DETELETE ABOVE TEST cartIsVisible LATER

  return (
    <>
      <span onClick={() => setCartIsVisible(true)}>{children}</span>
      <div className={cartIsVisible ? "fixed inside-container" : "d-none"}>
        This fixed element was defined inside the container, but appears
        relative to the view port.
      </div>
      {/* <div className={cartIsVisible ? "wrapper" : "d-none"}>

        <div className="box"> 
          <h1>HEALTH STATUS</h1>

          <input
            className="pill"
            type="text"
            id="check_infected"
            name="infected_check"
            placeholder="Infected by Corona? (Yes/No)"
            onfocus="this.placeholder = ''"
            onblur="this.placeholder = 'Infected by Corona? (Yes/No)'"
          />

          <input
            className="pill"
            type="submit"
            onclick="UpdateHealth();"
            value="Update"
          />

          <p className="bottom-text">
            We ensure to secure your health as well as the public health
          </p>
        </div>
      </div> */}
    </>
  );
};

export default MyTestBox;
