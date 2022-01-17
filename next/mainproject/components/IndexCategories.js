import Image from "next/image";
import Link from "next/link";

import wristWatch from "../public/wristwatch.png";
import chair from "../public/chair.png";
import book from "../public/book.png";

export default function IndexCategories() {
  return (
    <>
      <section className="container py-5">
        <div className="row text-center pt-3">
          <div className="col-lg-6 m-auto">
            <h1 className="h1">Categories of The Month</h1>
            <p>
              Exceqwpteur siqnwt ocqwcaecat cupidwaqtat nowqn proqwident, sunwqt
              iwnq cuqwlpa qqwui offiwqwcia deseruqnt moqllit aniqm idq qest
              lqqaborwum.
            </p>
          </div>
        </div>
        <div className="row ">
          <div className="col-12 col-md-4 p-5 mt-3 text-center">
            {/* <Link href={"#"}> */}
            <Image
              src={wristWatch}
              alt="wrist watch"
              width={180}
              height={180}
              placeholder="blur"
            />
            {/* </Link> */}
            <h5 className="text-center mt-3 mb-3">Watch</h5>
            <p className="text-center">
              <Link href="/category/watch">
                <a className="btn btn-success">Shop Now</a>
              </Link>
            </p>
          </div>
          <div className="col-12 col-md-4 p-5 mt-3 text-center ">
            <Image
              src={book}
              alt="watch"
              width={180}
              height={180}
              placeholder="blur"
            />

            <h2 className="h5 text-center mt-3 mb-3">Book</h2>
            <p className="text-center">
              <Link href="/category/books">
                <a className="btn btn-success">Shop Now</a>
              </Link>
            </p>
          </div>
          <div className="col-12 col-md-4 p-5 mt-3 text-center">
            {/* <Link href="category/chair"> */}
            <Image
              src={chair}
              alt="chair"
              width={180}
              height={180}
              placeholder="blur"
            />
            {/* </Link> */}
            <h2 className="h5 text-center mt-3 mb-3">Chair</h2>
            <p className="text-center">
              <Link href="/category/chair">
                <a className="btn btn-success">Shop Now</a>
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
