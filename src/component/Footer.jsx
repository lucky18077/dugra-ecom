import React, { useRef, useState, useEffect } from "react";
import { toTitleCase } from "../Hooks/Helper";
import axios from "axios";
import Carousel from "react-bootstrap/Carousel";
import { LIVE_URL } from "../Api/Route";

export default function Footer() {
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
      <section className="section-b-space">
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
      <footer className="section-t-space">
        <div className="container-fluid-lg">
          <div className="service-section">
            <div className="row g-3">
              <div className="col-12">
                <div className="service-contain">
                  <div className="service-box">
                    <div className="service-image">
                      <img
                        src="/assets/images/product.svg"
                        className="blur-up lazyload"
                        alt=""
                      />
                    </div>
                    <div className="service-detail">
                      <h5>Every Fresh Products</h5>
                    </div>
                  </div>
                  <div className="service-box">
                    <div className="service-image">
                      <img
                        src="/assets/images/delivery.svg"
                        className="blur-up lazyload"
                        alt=""
                      />
                    </div>
                    <div className="service-detail">
                      <h5>Free Delivery For Order Over $50</h5>
                    </div>
                  </div>
                  <div className="service-box">
                    <div className="service-image">
                      <img
                        src="/assets/images/discount.svg"
                        className="blur-up lazyload"
                        alt=""
                      />
                    </div>
                    <div className="service-detail">
                      <h5>Daily Mega Discounts</h5>
                    </div>
                  </div>
                  <div className="service-box">
                    <div className="service-image">
                      <img
                        src="/assets/images/market.svg"
                        className="blur-up lazyload"
                        alt=""
                      />
                    </div>
                    <div className="service-detail">
                      <h5>Best Price On The Market</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="main-footer section-b-space section-t-space">
            <div className="row g-md-4 g-3">
              <div className="col-xl-3 col-lg-4 col-sm-6">
                <div className="footer-logo">
                  <div className="theme-logo">
                    <a href="#">
                      <img
                        src="/assets/images/logo.png"
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
                        <a href="javascript:void(0)">
                          Sushma infinium, zirakpur
                        </a>
                      </li>
                      <li>
                        <i data-feather="mail" />
                        <a href="javascript:void(0)">durga@gmail.com</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6">
                <div className="footer-title">
                  <h4>Top Categories</h4>
                </div>
                <div className="footer-contain">
                  <ul>
                    <li>
                      <a href="#" className="text-content">
                        {toTitleCase(" EDIBLE OIL & FATS")}
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-content">
                        {toTitleCase(" ATTA, MAIDA & FLOURS")}
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-content">
                        {toTitleCase(" TEA , COFFEE , SUGAR & SALT")}
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-content">
                        {toTitleCase("  DAIRY & RELATED PRODUCTS")}
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-content">
                        {toTitleCase(" SPICES")}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-xl col-lg-2 col-sm-3">
                <div className="footer-title">
                  <h4>Useful Links</h4>
                </div>
                <div className="footer-contain">
                  <ul>
                    <li>
                      <a href="/" className="text-content">
                        Home
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-content">
                        Shop
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-content">
                        About Us
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-content">
                        Blog
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-content">
                        Contact Us
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-xl-2 col-sm-3">
                <div className="footer-title">
                  <h4>Help Center</h4>
                </div>
                <div className="footer-contain">
                  <ul>
                    <li>
                      <a href="#" className="text-content">
                        Your Order
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-content">
                        Your Account
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-content">
                        Track Order
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-content">
                        Search
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-xl-3 col-lg-4 col-sm-6">
                <div className="footer-title">
                  <h4>Contact Us</h4>
                </div>
                <div className="footer-contact">
                  <ul>
                    <li>
                      <div className="footer-number">
                        <i data-feather="phone" />
                        <div className="contact-number">
                          <h6 className="text-content">Hotline 24/7 :</h6>
                          <h5>+91 1234567890</h5>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="footer-number">
                        <i data-feather="mail" />
                        <div className="contact-number">
                          <h6 className="text-content">Email Address :</h6>
                          <h5>durga@gmail.com</h5>
                        </div>
                      </div>
                    </li>
                    <li className="social-app mb-0">
                      <h5 className="mb-2 text-content">Download App :</h5>
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
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="sub-footer section-small-space">
            <div className="reserve">
              <h6 className="text-content">
                ©2025 Bulk Basket All rights reserved
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
              <h6 className="text-content">Stay connected :</h6>
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
