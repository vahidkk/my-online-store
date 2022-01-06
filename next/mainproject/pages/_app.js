import "../assets/css/bootstrap.min.css";
import Head from "next/dist/shared/lib/head";
import Layout from "../components/layout/Layout";
import "../assets/css/fontawesome.min.css";
import "../assets/css/main.css";
import "../node_modules/react-simple-tree-menu/dist/main.css";
import { useEffect } from "react";
import { wrapper } from "../store/store";
import { SWRConfig } from "swr";
import "../node_modules/react-popper-tooltip/dist/styles.css";
import NextNProgress from "nextjs-progressbar";

const WrappedApp = ({ Component, pageProps }) => {
  useEffect(() => {
    import("../assets/js/bootstrap.bundle.min");
  }, []);
  return (
    <>
      <SWRConfig
        value={{ fetcher: (url) => fetch(url).then((res) => res.json()) }}
      >
        <NextNProgress
          color="#59AB6E"
          startPosition={0.3}
          stopDelayMs={200}
          height={3}
          showOnShallow={true}
        />
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;200;300;400;500;700;900&display=swap"
          ></link>
          <link
            rel="shortcut icon"
            type="image/x-icon"
            href="/public/favicon.ico"
          ></link>
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SWRConfig>
    </>
  );
};

export default wrapper.withRedux(WrappedApp);
