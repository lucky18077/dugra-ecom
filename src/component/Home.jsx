import Slider from "./Slider";

export default function Home() {
  return (
    <>
      <Slider/>
      <div className="container">
        <div className="banners-container mb-2">
          <div
            className="banners-slider owl-carousel owl-theme"
            data-owl-options="{
						'dots': false
					}"
          >
            <div
              className="banner banner1 banner-sm-vw d-flex align-items-center appear-animate"
              style={{ backgroundColor: "#ccc" }}
              data-animation-name="fadeInLeftShorter"
              data-animation-delay={500}
            >
              <figure className="w-100">
                <img
                  src="assets/images/banner-11.jpg"
                  alt="banner"
                  width={380}
                  height={175}
                />
              </figure>
              <div className="banner-layer">
                <h3 className="m-b-2">Porto Watches</h3>
                <h4 className="m-b-3 text-primary">
                  <sup className="text-dark">
                    <del>20%</del>
                  </sup>
                  30%<sup>OFF</sup>
                </h4>
                <a href="category.html" className="btn btn-sm btn-dark">
                  Shop Now
                </a>
              </div>
            </div>
            {/* End .banner */}
            <div
              className="banner banner2 banner-sm-vw text-uppercase d-flex align-items-center appear-animate"
              data-animation-name="fadeInUpShorter"
              data-animation-delay={200}
            >
              <figure className="w-100">
                <img
                  src="assets/images/banner-22.jpg"
                  style={{ backgroundColor: "#ccc" }}
                  alt="banner"
                  width={380}
                  height={175}
                />
              </figure>
              <div className="banner-layer text-center">
                <div className="row align-items-lg-center">
                  <div className="col-lg-7 text-lg-right">
                    <h3>Deal Promos</h3>
                    <h4 className="pb-4 pb-lg-0 mb-0 text-body">
                      Starting at $99
                    </h4>
                  </div>
                  <div className="col-lg-5 text-lg-left px-0 px-xl-3">
                    <a href="category.html" className="btn btn-sm btn-dark">
                      Shop Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
            {/* End .banner */}
            <div
              className="banner banner3 banner-sm-vw d-flex align-items-center appear-animate"
              style={{ backgroundColor: "#ccc" }}
              data-animation-name="fadeInRightShorter"
              data-animation-delay={500}
            >
              <figure className="w-100">
                <img
                  src="assets/images/banner-33.jpg"
                  alt="banner"
                  width={380}
                  height={175}
                />
              </figure>
              <div className="banner-layer text-right">
                <h3 className="m-b-2">Handbags</h3>
                <h4 className="m-b-2 text-secondary text-uppercase">
                  Starting at $99
                </h4>
                <a href="category.html" className="btn btn-sm btn-dark">
                  Shop Now
                </a>
              </div>
            </div>
            {/* End .banner */}
          </div>
        </div>
      </div>

      <section className="featured-products-section">
        <div className="container">
          <h2 className="section-title heading-border ls-20 border-0">
            Shop By Category
          </h2>
          <div className="row">
            <div
              className="col-lg-3 col-sm-6 pb-5 pb-md-0 appear-animate"
              data-animation-delay={500}
              data-animation-name="fadeInLeftShorter"
            >
              <div className="product-default left-details product-widget">
                <figure>
                  <a href="product.html">
                    <img
                      alt="product"
                      height={84}
                      src="assets/images/cat1.jpg"
                      width={84}
                    />
                  </a>
                </figure>
                <div className="product-details">
                  <h3 className="product-title">
                    <a href="product.html">Blue Backpack for the Young - S</a>
                  </h3>
                  <div className="ratings-container">
                    <div className="product-ratings">
                      <span
                        className="ratings"
                        style={{ width: "100%" }}
                      ></span>
                      <span className="tooltiptext tooltip-top">5.00</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="product-default left-details product-widget">
                <figure>
                  <a href="product.html">
                    <img
                      alt="product"
                      height={84}
                      src="assets/images/cat2.jpg"
                      width={84}
                    />
                  </a>
                </figure>
                <div className="product-details">
                  <h3 className="product-title">
                    <a href="product.html">Casual Spring Blue Shoes</a>
                  </h3>
                  <div className="ratings-container">
                    <div className="product-ratings">
                      <span
                        className="ratings"
                        style={{ width: "100%" }}
                      ></span>
                      {/* End .ratings */}
                      <span className="tooltiptext tooltip-top"></span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="product-default left-details product-widget">
                <figure>
                  <a href="product.html">
                    <img
                      alt="product"
                      height={84}
                      src="assets/images/cat5.jpg"
                      width={84}
                    />
                  </a>
                </figure>
                <div className="product-details">
                  <h3 className="product-title">
                    <a href="product.html">Men Black Gentle Belt</a>
                  </h3>
                  <div className="ratings-container">
                    <div className="product-ratings">
                      <span
                        className="ratings"
                        style={{ width: "100%" }}
                      ></span>
                      <span className="tooltiptext tooltip-top">5.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-lg-3 col-sm-6 pb-5 pb-md-0 appear-animate"
              data-animation-delay={800}
              data-animation-name="fadeInLeftShorter"
            >
              <div className="product-default left-details product-widget">
                <figure>
                  <a href="product.html">
                    <img
                      alt="product"
                      height={84}
                      src="assets/images/cat1.jpg"
                      width={84}
                    />
                  </a>
                </figure>
                <div className="product-details">
                  <h3 className="product-title">
                    <a href="product.html">Blue Backpack for the Young - S</a>
                  </h3>
                  <div className="ratings-container">
                    <div className="product-ratings">
                      <span
                        className="ratings"
                        style={{ width: "100%" }}
                      ></span>
                      <span className="tooltiptext tooltip-top">5.00</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="product-default left-details product-widget">
                <figure>
                  <a href="product.html">
                    <img
                      alt="product"
                      height={84}
                      src="assets/images/cat2.jpg"
                      width={84}
                    />
                  </a>
                </figure>
                <div className="product-details">
                  <h3 className="product-title">
                    <a href="product.html">Casual Spring Blue Shoes</a>
                  </h3>
                  <div className="ratings-container">
                    <div className="product-ratings">
                      <span
                        className="ratings"
                        style={{ width: "100%" }}
                      ></span>
                      {/* End .ratings */}
                      <span className="tooltiptext tooltip-top"></span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="product-default left-details product-widget">
                <figure>
                  <a href="product.html">
                    <img
                      alt="product"
                      height={84}
                      src="assets/images/cat5.jpg"
                      width={84}
                    />
                  </a>
                </figure>
                <div className="product-details">
                  <h3 className="product-title">
                    <a href="product.html">Men Black Gentle Belt</a>
                  </h3>
                  <div className="ratings-container">
                    <div className="product-ratings">
                      <span
                        className="ratings"
                        style={{ width: "100%" }}
                      ></span>
                      <span className="tooltiptext tooltip-top">5.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-lg-3 col-sm-6 pb-5 pb-md-0 appear-animate"
              data-animation-delay={1100}
              data-animation-name="fadeInLeftShorter"
            >
              <div className="product-default left-details product-widget">
                <figure>
                  <a href="product.html">
                    <img
                      alt="product"
                      height={84}
                      src="assets/images/cat1.jpg"
                      width={84}
                    />
                  </a>
                </figure>
                <div className="product-details">
                  <h3 className="product-title">
                    <a href="product.html">Blue Backpack for the Young - S</a>
                  </h3>
                  <div className="ratings-container">
                    <div className="product-ratings">
                      <span
                        className="ratings"
                        style={{ width: "100%" }}
                      ></span>
                      <span className="tooltiptext tooltip-top">5.00</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="product-default left-details product-widget">
                <figure>
                  <a href="product.html">
                    <img
                      alt="product"
                      height={84}
                      src="assets/images/cat2.jpg"
                      width={84}
                    />
                  </a>
                </figure>
                <div className="product-details">
                  <h3 className="product-title">
                    <a href="product.html">Casual Spring Blue Shoes</a>
                  </h3>
                  <div className="ratings-container">
                    <div className="product-ratings">
                      <span
                        className="ratings"
                        style={{ width: "100%" }}
                      ></span>
                      {/* End .ratings */}
                      <span className="tooltiptext tooltip-top"></span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="product-default left-details product-widget">
                <figure>
                  <a href="product.html">
                    <img
                      alt="product"
                      height={84}
                      src="assets/images/cat5.jpg"
                      width={84}
                    />
                  </a>
                </figure>
                <div className="product-details">
                  <h3 className="product-title">
                    <a href="product.html">Men Black Gentle Belt</a>
                  </h3>
                  <div className="ratings-container">
                    <div className="product-ratings">
                      <span
                        className="ratings"
                        style={{ width: "100%" }}
                      ></span>
                      <span className="tooltiptext tooltip-top">5.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-lg-3 col-sm-6 pb-5 pb-md-0 appear-animate"
              data-animation-delay={800}
              data-animation-name="fadeInLeftShorter"
            >
              <div className="product-default left-details product-widget">
                <figure>
                  <a href="product.html">
                    <img
                      alt="product"
                      height={84}
                      src="assets/images/cat1.jpg"
                      width={84}
                    />
                  </a>
                </figure>
                <div className="product-details">
                  <h3 className="product-title">
                    <a href="product.html">Blue Backpack for the Young - S</a>
                  </h3>
                  <div className="ratings-container">
                    <div className="product-ratings">
                      <span
                        className="ratings"
                        style={{ width: "100%" }}
                      ></span>
                      <span className="tooltiptext tooltip-top">5.00</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="product-default left-details product-widget">
                <figure>
                  <a href="product.html">
                    <img
                      alt="product"
                      height={84}
                      src="assets/images/cat2.jpg"
                      width={84}
                    />
                  </a>
                </figure>
                <div className="product-details">
                  <h3 className="product-title">
                    <a href="product.html">Casual Spring Blue Shoes</a>
                  </h3>
                  <div className="ratings-container">
                    <div className="product-ratings">
                      <span
                        className="ratings"
                        style={{ width: "100%" }}
                      ></span>
                      {/* End .ratings */}
                      <span className="tooltiptext tooltip-top"></span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="product-default left-details product-widget">
                <figure>
                  <a href="product.html">
                    <img
                      alt="product"
                      height={84}
                      src="assets/images/cat5.jpg"
                      width={84}
                    />
                  </a>
                </figure>
                <div className="product-details">
                  <h3 className="product-title">
                    <a href="product.html">Men Black Gentle Belt</a>
                  </h3>
                  <div className="ratings-container">
                    <div className="product-ratings">
                      <span
                        className="ratings"
                        style={{ width: "100%" }}
                      ></span>
                      <span className="tooltiptext tooltip-top">5.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div
        className="promo-section bg-gray mt-5"
        data-image-src="assets/images/bannermiddle.jpg"
        data-parallax="{'speed': 2, 'enableOnMobile': true}"
      >
        <div className="promo-banner banner container text-uppercase">
          <div className="banner-content row align-items-center text-center">
            <div className="col-md-4 ml-xl-auto text-md-right left-text">
              <h2 className="mb-md-0" style={{ color: "white" }}>
                Top electronic
                <br />
                Deals
              </h2>
            </div>
            <div className="col-md-3 pb-4 pb-md-0">
              <a className="btn btn-primary ls-10" href="#">
                Shop Now
              </a>
            </div>
            <div className="col-md-4 mr-xl-auto text-md-left right-text">
              <h4 className="mb-1 coupon-sale-text p-0 d-block text-transform-none">
                <b className="bg-dark text-white font1">Exclusive COUPON</b>
              </h4>
              <h5 className="mb-2 coupon-sale-text ls-10 p-0">
                <i className="ls-0">UP TO</i>
                <b className="text-white bg-secondary">$100</b>
                OFF
              </h5>
            </div>
          </div>
        </div>
      </div>

      <div className="home-product-tabs product-slider-tab pt-5 pt-md-0 mt-5">
        <div className="container">
          <h2 className="section-title heading-border ls-20 border-0">
            Shop By Brand
          </h2>
          <div className="tab-content m-b-4">
            <div
              aria-labelledby="featured-products-tab"
              className="tab-pane fade show active"
              id="featured-products"
              role="tabpanel"
            >
              <div
                className="tab-products-carousel owl-carousel owl-theme quantity-inputs show-nav-hover nav-outer nav-image-center"
                data-owl-options="{
									'loop': false
								}"
              >
                <div className="product-default inner-quickview inner-icon quantity-input">
                  <figure>
                    <a href="demo14-product.html">
                      <img
                        alt="product"
                        height={280}
                        src="assets/images/product-6.jpg"
                        width={280}
                      />
                    </a>
                    <a
                      className="btn-quickview"
                      href="ajax/product-quick-view.html"
                      title="Quick View"
                    >
                      Shop Now
                    </a>
                  </figure>
                  <div className="product-details">
                    <h3 className="product-title">
                      <a href="demo14-product.html">Headphone Black</a>
                    </h3>
                  </div>
                </div>
                <div className="product-default inner-quickview inner-icon quantity-input">
                  <figure>
                    <a href="demo14-product.html">
                      <img
                        alt="product"
                        height={280}
                        src="assets/images/product-7.jpg"
                        width={280}
                      />
                    </a>
                    <a
                      className="btn-quickview"
                      href="ajax/product-quick-view.html"
                      title="Quick View"
                    >
                      Quick View
                    </a>
                  </figure>
                  <div className="product-details">
                    <h3 className="product-title">
                      <a href="demo14-product.html">Headphone Black</a>
                    </h3>
                  </div>
                </div>
                <div className="product-default inner-quickview inner-icon quantity-input">
                  <figure>
                    <a href="demo14-product.html">
                      <img
                        alt="product"
                        height={280}
                        src="assets/images/product-8.jpg"
                        width={280}
                      />
                    </a>
                    <a
                      className="btn-quickview"
                      href="ajax/product-quick-view.html"
                      title="Quick View"
                    >
                      Quick View
                    </a>
                  </figure>
                  <div className="product-details">
                    <h3 className="product-title">
                      <a href="demo14-product.html">Computer Mouse</a>
                    </h3>
                  </div>
                </div>
                <div className="product-default inner-quickview inner-icon quantity-input">
                  <figure>
                    <a href="demo14-product.html">
                      <img
                        alt="product"
                        height={280}
                        src="assets/images/product-7.jpg"
                        width={280}
                      />
                    </a>
                    <a
                      className="btn-quickview"
                      href="ajax/product-quick-view.html"
                      title="Quick View"
                    >
                      Quick View
                    </a>
                  </figure>
                  <div className="product-details">
                    <h3 className="product-title">
                      <a href="demo14-product.html">Headphone Black</a>
                    </h3>
                  </div>
                </div>
                <div className="product-default inner-quickview inner-icon quantity-input">
                  <figure>
                    <a href="demo14-product.html">
                      <img
                        alt="product"
                        height={280}
                        src="assets/images/product-8.jpg"
                        width={280}
                      />
                    </a>
                    <a
                      className="btn-quickview"
                      href="ajax/product-quick-view.html"
                      title="Quick View"
                    >
                      Quick View
                    </a>
                  </figure>
                  <div className="product-details">
                    <h3 className="product-title">
                      <a href="demo14-product.html">Computer Mouse</a>
                    </h3>
                  </div>
                </div>
                <div className="product-default inner-quickview inner-icon quantity-input">
                  <figure>
                    <a href="demo14-product.html">
                      <img
                        alt="product"
                        height={280}
                        src="assets/images/product-6.jpg"
                        width={280}
                      />
                    </a>
                    <a
                      className="btn-quickview"
                      href="ajax/product-quick-view.html"
                      title="Quick View"
                    >
                      Shop Now
                    </a>
                  </figure>
                  <div className="product-details">
                    <h3 className="product-title">
                      <a href="demo14-product.html">Headphone Black</a>
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="banner banner-big-sale appear-animate"
        data-animation-delay={200}
        data-animation-name="fadeInUpShorter"
        style={{
          background:
            '#2A95CB center/cover url("assets/images/bannerline.jpg")',
        }}
      >
        <div className="banner-content row align-items-center mx-0">
          <div className="col-md-9 col-sm-8">
            <h2 className="text-white text-uppercase text-center text-sm-left ls-n-20 mb-md-0 px-4">
              <b className="d-inline-block mr-3 mb-1 mb-md-0">Big Sale</b> All
              new fashion brands items up to 70% off
              <small className="text-transform-none align-middle">
                Online Purchases Only
              </small>
            </h2>
          </div>
          <div className="col-md-3 col-sm-4 text-center text-sm-right">
            <a className="btn btn-light btn-white btn-lg" href="category.html">
              View Sale
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
