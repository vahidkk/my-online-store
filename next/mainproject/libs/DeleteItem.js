import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());
// export default function

export default function swrDelete(cartID, itemID) {
  const { data, error } = useSWR(
    `http://127.0.0.1:8000/api/carts/${cartID}/items/${itemID}/`,
    {
      method: "delete",
    },
    fetcher
  );

  return {
    deletionData: data,
    deletionLoading: !error && !data,
    deletionIsError: error,
  };
}

// const { deletionData, deletionLoading, deletionIsError } = swrDelete(cartID, itemID)

// export const DeleteItem = async (itemID, cartID) => {
//   const res = await fetch(
//     `http://127.0.0.1:8000/api/carts/${cartID}/items/${itemID}/`,
//     {
//       method: "DELETE",
//       // headers: {
//       //   //   Authorization: `Bearer ${token}`,
//       //   Authorization: null,
//       //   "Content-Type": "application/json",
//       //   accept: "application/json",
//       //   "Access-Control-Allow-Headers": "*",
//       //   "Access-Control-Allow-Origin": "*",
//       // },
//     }
//   );

//   // return (data.message)
//   console.log("here is the response of deletetion:", res);
//   return res;
//   //    else {
//   //     router.reload()
//   //   }
// };

//   if (getCookie("MyCartAsGuest").length < 1) {
//     const newCart = await fetch("http://127.0.0.1:8000/api/carts/", {
//       // const newCart = await fetch("https://reqres.in/api/posts", {
//       method: "POST",
//       // headers: { "Content-Type": "application/json" },
//       // headers: { "Content-Type": "application/x-www-form-urlencoded" },
//     });

//     const response = await newCart.json();
//     console.log("newCart.json()::::", response);
//     const newCartId = response.id;
//     console.log("newCartId", newCartId);
//     setCookie("MyCartAsGuest", newCartId);
//     return response;
//   } else {
//     const currentCartId = getCookie("MyCartAsGuest");
//     console.log('getCookie("MyCartAsGuest"):', getCookie("MyCartAsGuest"));
//     const myCart = await fetch(
//       `http://127.0.0.1:8000/api/carts/${currentCartId}`,
//       {
//         // const newCart = await fetch("https://reqres.in/api/posts", {
//         method: "GET",
//         // headers: { "Content-Type": "application/json" },
//         // headers: { "Content-Type": "application/x-www-form-urlencoded" },
//       }
//     );

//     // const response = await myCart.json();

//     // console.log("my cart materiallllls:", response);
//     return myCart.json();
//   }
// };
