import Head from "next/head";
import Image from "next/image";
import IndexSlider from "../components/IndexSlider";
import IndexCategories from "../components/IndexCategories";
import IndexFeaturedItems from "../components/IndexFeaturedItems";
export default function Home() {

  return( <>
  <IndexSlider/>
  <IndexCategories/>
  <IndexFeaturedItems/>
  </>);
}