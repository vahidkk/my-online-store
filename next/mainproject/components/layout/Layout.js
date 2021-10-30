import MainNavigation from "./MainNavigation";
import MainFooter from "./MainFooter";

function Layout(props) {
  return (
    <div>
      <MainNavigation />
      <main>{props.children}</main>
      <MainFooter />
    </div>
  );
}

export default Layout;
