import MainNavigation from "./MainNavigation";
import MainFooter from "./MainFooter";

function Layout(props) {
  return (
    <>
      <MainNavigation />
      <main>{props.children}</main>
      <MainFooter />
    </>
  );
}

export default Layout;
