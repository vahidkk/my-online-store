import useSWR from "swr";
import { endpoint } from "../utils/constants";

const fetcher = (...args) => fetch(...args).then((res) => res.json());
// export default function

export default function swrDelete(cartID, itemID) {
  const { data, error } = useSWR(
    `${endpoint}/carts/${cartID}/items/${itemID}/`,
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
