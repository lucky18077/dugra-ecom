import React from "react";

export default function Slider() {
  return (
    <>
      <main className="main">
        <div
          className="home-slider slide-animate owl-carousel owl-theme show-nav-hover nav-big mb-2 text-uppercase"
          data-owl-options="{
				'loop': false
			}"
        >
          <div className="home-slide home-slide1 banner">
            <img
              alt="slider image"
              className="slide-bg"
              height={499}
              src="assets/images/slide1.jpg"
              width={1903}
            />
            {/* <div className="container d-flex align-items-center">
              <div
                className="banner-layer appear-animate"
                data-animation-name="fadeInUpShorter"
              >
                <h4 className="text-transform-none m-b-3">
                  Find the Boundaries. Push Through!
                </h4>
                <h2 className="text-transform-none mb-0">Summer Sale</h2>
                <h3 className="m-b-3">70% Off</h3>
                <h5 className="d-inline-block mb-0">
                  <span>Starting At</span>
                  <b className="coupon-sale-text text-white bg-secondary align-middle">
                    <sup>$</sup>
                    <em className="align-text-top">199</em>
                    <sup>99</sup>
                  </b>
                </h5>
                <a className="btn btn-dark btn-lg" href="category.html">
                  Shop Now!
                </a>
              </div>
            </div> */}
          </div>
          <div className="home-slide home-slide2 banner banner-md-vw">
            <img
              alt="slider image"
              className="slide-bg"
              height={499}
              src="assets/images/slide1.jpg"
              style={{ backgroundColor: "#ccc" }}
              width={1903}
            />
            {/* <div className="container d-flex align-items-center">
              <div
                className="banner-layer d-flex justify-content-center appear-animate"
                data-animation-name="fadeInUpShorter"
              >
                <div className="mx-auto">
                  <h4 className="m-b-1">Extra</h4>
                  <h3 className="m-b-2">20% off</h3>
                  <h3 className="mb-2 heading-border">Accessories</h3>
                  <h2 className="text-transform-none m-b-4">Summer Sale</h2>
                  <a className="btn btn-block btn-dark" href="category.html">
                    Shop All Sale
                  </a>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </main>
    </>
  );
}
