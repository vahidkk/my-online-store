// import { useState, useEffect } from "react";

// export function useWindowDimension() {
//   const [dimension, setDimension] = useState([null]);
//   useEffect(() => {
//     const debouncedResizeHandler = debounce(() => {
//       console.log("***** debounced resize"); // See the cool difference in console
//       setDimension([window.innerWidth, window.innerHeight]);
//     }, 100); // 100ms
//     window.addEventListener("resize", debouncedResizeHandler);
//     return () => window.removeEventListener("resize", debouncedResizeHandler);
//   }, []); // Note this empty array. this effect should run only on mount and unmount
//   return dimension;
// }

// function debounce(fn, ms) {
//   let timer;
//   return (_) => {
//     clearTimeout(timer);
//     timer = setTimeout((_) => {
//       timer = null;
//       fn.apply(this, arguments);
//     }, ms);
//   };
// }

import React, { useLayoutEffect, useState } from "react";

export function useWindowDimension() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
}
