import React, { useRef, useState, useEffect } from "react";
import { toTitleCase } from "../Hooks/Helper";
import axios from "axios";
import { Link } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import { LIVE_URL } from "../Api/Route";
import { BASE_LIVE_URL } from "../Api/Route";

export default function Footer({ isLoggedIn, openLoginModal }) {
  const [fBanner, setFbanner] = useState(null);

  const fetchFooterBanner = async () => {
    try {
      const response = await axios.get(`${LIVE_URL}/get-footer-banner`);
      const banner = response.data.data || [];
      setFbanner(banner);
    } catch (error) {
      console.error("Error fetching footer banner:", error);
    }
  };
  useEffect(() => {
    fetchFooterBanner();
  }, []);

  const carouselRef = useRef(null);
  return (
    <>
      {/* Bottom Banner */}
      <section
        className="section-b-space"
        style={{ backgroundColor: "#e8f1e6" }}
      >
        <div className="container">
          <div className="row">
            <Carousel
              data-bs-theme="dark"
              controls={false}
              indicators={false}
              interval={3000}
              pause={false}
              ref={carouselRef}
            >
              {fBanner && fBanner.length > 0 ? (
                fBanner.map((banner, index) => (
                  <Carousel.Item key={index}>
                    <img
                      className="d-block w-100"
                      src={`http://127.0.0.1:8000/sliders/${banner.image}`}
                      alt={`Footer Banner ${index + 1}`}
                    />
                  </Carousel.Item>
                ))
              ) : (
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="/placeholder.jpg"
                    alt="Default Footer Banner"
                  />
                </Carousel.Item>
              )}
            </Carousel>
          </div>
        </div>
      </section>
      <footer
        className="section-t-space"
        style={{ backgroundColor: "#477a37" }}
      >
        <div className="container-fluid-lg">
          <div className="main-footer section-b-space section-t-space">
            <div className="row g-md-4 g-3">
              <div className="col-xl-3 col-lg-3 col-sm-6">
                <div className="footer-logo">
                  <div className="theme-logo">
                    <a href="#">
                      <img
                        src="/assets/images/footer-logo.png"
                        className="blur-up lazyload"
                        alt=""
                      />
                    </a>
                  </div>
                  <div className="footer-logo-contain">
                    <p>
                      We are a friendly bar serving a variety of cocktails,
                      wines and beers. Our bar is a perfect place for a couple.
                    </p>
                    <ul className="address">
                      <li>
                        <i data-feather="home" />
                        <a>
                          Chandigarh
                        </a>
                      </li>
                      <li>
                        <i data-feather="phone" />
                        <a>+91-9876521909</a>
                      </li>
                      <li>
                        <i data-feather="mail" />
                        <a>info@bulkbasketindia.com</a>
                      </li>
                    </ul>
                    <li className="social-app mb-0 mt-2">
                      <h5 className="mb-2 text-contents">Download App :</h5>
                      <ul>
                        <li className="mb-0">
                          <a
                            href="https://play.google.com/store/apps"
                            target="_blank"
                          >
                            <img
                              src="/assets/images/playstore.svg"
                              className="blur-up lazyload"
                              alt=""
                            />
                          </a>
                        </li>
                        <li className="mb-0">
                          <a
                            href="https://www.apple.com/in/app-store/"
                            target="_blank"
                          >
                            <img
                              src="/assets/images/appstore.svg"
                              className="blur-up lazyload"
                              alt=""
                            />
                          </a>
                        </li>
                      </ul>
                    </li>
                  </div>
                </div>
              </div>
              <div
                className="col-xl-3 col-lg-3  col-sm-6"
                style={{ width: "20%" }}
              >
                <div className="footer-title">
                  <h4>Shop By Categories</h4>
                </div>
                <div className="footer-contain">
                  <ul>
                    <li>
                      <Link
                        to={`${BASE_LIVE_URL}/shop/category/1`}
                        className="text-contents"
                      >
                        {toTitleCase("Edible Oil & Fats")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`${BASE_LIVE_URL}/shop/category/2`}
                        className="text-contents"
                      >
                        {toTitleCase("ATTA, MAIDA & FLOURS")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`${BASE_LIVE_URL}/shop/category/7`}
                        className="text-contents"
                      >
                        {toTitleCase("TEA , COFFEE , SUGAR & SALT")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`${BASE_LIVE_URL}/shop/category/12`}
                        className="text-contents"
                      >
                        {toTitleCase("DAIRY & RELATED PRODUCTS")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`${BASE_LIVE_URL}/shop/category/9`}
                        className="text-contents"
                      >
                        {toTitleCase("SPICES")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`${BASE_LIVE_URL}/shop/category/13`}
                        className="text-contents"
                      >
                        {toTitleCase("Frozen Products")}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3  col-sm-6 mt-5">
                <div className="footer-contain">
                  <ul>
                    <li>
                      <Link
                        to={`${BASE_LIVE_URL}/shop/category/6`}
                        className="text-contents"
                      >
                        {toTitleCase("Imported Items")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`${BASE_LIVE_URL}/shop/category/11`}
                        className="text-contents"
                      >
                        {toTitleCase("Instant Food")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`${BASE_LIVE_URL}/shop/category/16`}
                        className="text-contents"
                      >
                        {toTitleCase("Dry Fruits, Nuts & Cereals")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`${BASE_LIVE_URL}/shop/category/14`}
                        className="text-contents"
                      >
                        {toTitleCase("Disposables & Packaging Material")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`${BASE_LIVE_URL}/shop/category/10`}
                        className="text-contents"
                      >
                        {toTitleCase("Pickle, Sauces & Seasoning")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`${BASE_LIVE_URL}/shop/category/4`}
                        className="text-contents"
                      >
                        {toTitleCase("Bakery Essentials")}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-xl-2 col-lg-3 col-sm-6">
                <div className="footer-title">
                  <h4>Useful Links</h4>
                </div>
                <div className="footer-contain">
                  <ul>
                    <li>
                      {isLoggedIn ? (
                        <Link to="profile" className="text-contents">
                          My Account
                        </Link>
                      ) : (
                        <a
                          href="#"
                          onClick={openLoginModal}
                          className="text-contents"
                        >
                          My Account
                        </a>
                      )}
                    </li>

                    <li>
                      {isLoggedIn ? (
                        <Link to="view-wishlist" className="text-contents">
                          Wish List
                        </Link>
                      ) : (
                        <a
                          href="#"
                          onClick={openLoginModal}
                          className="text-contents"
                        >
                          Wish List
                        </a>
                      )}
                    </li>

                    <li>
                      {isLoggedIn ? (
                        <Link to="view-cart" className="text-contents">
                          View Cart
                        </Link>
                      ) : (
                        <a
                          href="#"
                          onClick={openLoginModal}
                          className="text-contents"
                        >
                          View Cart
                        </a>
                      )}
                    </li>

                    <li>
                      <Link to="/returns" className="text-contents">
                        Returns And Refunds
                      </Link>
                    </li>

                    <li>
                      <Link to="/privacy" className="text-contents">
                        Privacy Policy
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="sub-footer section-small-space">
            <div className="reserve">
              <h6 className="text-contents">
                ©2025 Bulk Basket India All rights reserved
              </h6>
            </div>
            <div className="payment">
              <img
                src="/assets/images/1_2.png"
                className="blur-up lazyload"
                alt=""
              />
            </div>
            <div className="social-link">
              <h6 className="text-contents">Stay connected :</h6>
              <ul>
                <li>
                  <a href="https://www.facebook.com/" target="_blank">
                    <i className="fa-brands fa-facebook-f" />
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com/" target="_blank">
                    <i className="fa-brands fa-twitter" />
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/" target="_blank">
                    <i className="fa-brands fa-instagram" />
                  </a>
                </li>
                <li>
                  <a href="https://in.pinterest.com/" target="_blank">
                    <i className="fa-brands fa-pinterest-p" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* <div
        className="modal fade theme-modal deal-modal"
        id="deal-box"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h5 className="modal-title w-100" id="deal_today">
                  Login
                </h5>
              </div>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <div className="modal-body">
              <div className="deal-offer-box">
                <img
                  src="/assets/images/phone.png"
                  alt="Phone Icon"
                  class="img-fluid"
                  style={{ height: "90px" }}
                />
                <div className="input-box">
                  <form className="row g-4">
                    <h3>Enter Mobile Number</h3>
                    <div className="col-12">
                      <div className="form-floating theme-form-floating log-in-form">
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Phone"
                          required
                        />
                        <label htmlFor="phone">Phone</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating theme-form-floating log-in-form">
                        <input
                          type="password"
                          className="form-control"
                          id="password"
                          placeholder="Password"
                          required
                        />
                        <label htmlFor="password">Password</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <button
                        className="btn btn-animation w-100 justify-content-center"
                        type="submit"
                      >
                        Log In
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
}
