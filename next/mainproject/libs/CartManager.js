import { getCookie, setCookie } from "./cookies";
import useSWR, { mutate, trigger } from "swr";

// export const CartManager = async (mounted) => {
async function FindTheCratID(mounted) {
  // getCookie(key)
  // setCookie(key, value)
  console.log("getcooookiiii:", getCookie("MyCartAsGuest"));

  if (getCookie("MyCartAsGuest").length < 1) {
    const newCart = await fetch("http://127.0.0.1:8000/api/carts/", {
      // const newCart = await fetch("https://reqres.in/api/posts", {
      method: "POST",
      // headers: { "Content-Type": "application/json" },
      // headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const response = await newCart.json();
    console.log("newCart.json()::::", response);
    const newCartId = response.id;
    console.log("newCartId", newCartId);
    setCookie("MyCartAsGuest", newCartId);
    return response.id;
  }
}
// } else {

// بالای اینجا رو یه تابع میکنم پایینشو یه تابع دیگه
// از تابع بالایی شماره کارتو میگیره و ازش در تابع پایینی استفاده میکنم . بعد که تابع پایینی آماده شد باید بصورت هوک ازش استفاده کنم ( نه به صورت تابع )
// از مثال ورصل برای تعریف و استفاده مجدد استفاده کنم برای نوشتن تابع زیری :

//     Make It Reusable
// When building a web app, you might need to reuse the data in many places of the UI. It is incredibly easy to create reusable data hooks on top of SWR:

// function useUser (id) {
//   const { data, error } = useSWR(`/api/user/${id}`, fetcher)

//   return {
//     user: data,
//     isLoading: !error && !data,
//     isError: error
//   }
// }
// And use it in your components:

// function Avatar ({ id }) {
//   const { user, isLoading, isError } = useUser(id)

//   if (isLoading) return <Spinner />
//   if (isError) return <Error />
//   return <img src={user.avatar} />
// }
// By adopting this pattern, you can forget about fetching data in the imperative way: start the request, update the loading state, and return the final result. Instead, your code is more declarative: you just need to specify what data is used by the component.
function LoadCartContent(mounted) {
  // const currentCartId =
  //   getCookie("MyCartAsGuest").length > 0
  //     ? getCookie("MyCartAsGuest")
  //     : FindTheCratID(mounted);
  // console.log('getCookie("MyCartAsGuest"):', getCookie("MyCartAsGuest"));
  const { data, error } = useSWR(
    mounted ? `http://127.0.0.1:8000/api/carts/${currentCartId}` : null
  );

  return {
    user: data,
    isLoading: !error && !data,
    isError: error,
  };
}

// const response = await myCart.json();

// console.log("my cart materiallllls:", response);

// const myCart = await fetch(
//   `http://127.0.0.1:8000/api/carts/${currentCartId}`,
//   {
//     method: "GET",
//   }
