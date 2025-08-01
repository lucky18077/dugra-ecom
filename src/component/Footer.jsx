import React from "react";

export default function Footer() {
  return (
    <>
      <footer className="footer bg-dark">
        <div className="footer-middle">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-sm-6">
                <div className="widget">
                  <h4 className="widget-title">Contact Info</h4>
                  <ul className="contact-info">
                    <li>
                      <span className="contact-info-label">Address:</span>123
                      Street Name, City, England
                    </li>
                    <li>
                      <span className="contact-info-label">Phone:</span>
                      <a href="tel:">(123) 456-7890</a>
                    </li>
                    <li>
                      <span className="contact-info-label">Email:</span>{" "}
                      <a href="/cdn-cgi/l/email-protection#e28f838b8ea2879a838f928e87cc818d8f">
                        <span
                          className="__cf_email__"
                          data-cfemail="4924282025092c31282439252c672a2624"
                        >
                          [email&nbsp;protected]
                        </span>
                      </a>
                    </li>
                    <li>
                      <span className="contact-info-label">
                        Working Days/Hours:
                      </span>{" "}
                      Mon - Sun / 9:00 AM - 8:00 PM
                    </li>
                  </ul>
                  <div className="social-icons">
                    <a
                      href="#"
                      className="social-icon social-facebook icon-facebook"
                      target="_blank"
                      title="Facebook"
                    />
                    <a
                      href="#"
                      className="social-icon social-twitter icon-twitter"
                      target="_blank"
                      title="Twitter"
                    />
                    <a
                      href="#"
                      className="social-icon social-instagram icon-instagram"
                      target="_blank"
                      title="Instagram"
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-sm-6">
                <div className="widget">
                  <h4 className="widget-title">Customer Service</h4>
                  <ul className="links">
                    <li>
                      <a href="#">Help &amp; FAQs</a>
                    </li>
                    <li>
                      <a href="#">Order Tracking</a>
                    </li>
                    <li>
                      <a href="#">Shipping &amp; Delivery</a>
                    </li>
                    <li>
                      <a href="#">Orders History</a>
                    </li>
                    <li>
                      <a href="#">Advanced Search</a>
                    </li>
                    <li>
                      <a href="dashboard.html">My Account</a>
                    </li>
                    <li>
                      <a href="#">Careers</a>
                    </li>
                    <li>
                      <a href="about.html">About Us</a>
                    </li>
                    <li>
                      <a href="#">Corporate Sales</a>
                    </li>
                    <li>
                      <a href="#">Privacy</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-3 col-sm-6">
                <div className="widget">
                  <h4 className="widget-title">Popular Tags</h4>
                  <div className="tagcloud">
                    <a href="#">Bag</a>
                    <a href="#">Black</a>
                    <a href="#">Blue</a>
                    <a href="#">Clothes</a>
                    <a href="#">Fashion</a>
                    <a href="#">Hub</a>
                    <a href="#">Shirt</a>
                    <a href="#">Shoes</a>
                    <a href="#">Skirt</a>
                    <a href="#">Sports</a>
                    <a href="#">Sweater</a>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-sm-6">
                <div className="widget widget-newsletter">
                  <h4 className="widget-title">Subscribe newsletter</h4>
                  <p>
                    Get all the latest information on events, sales and offers.
                    Sign up for newsletter:
                  </p>
                  <form action="#" className="mb-0">
                    <input
                      type="email"
                      className="form-control m-b-3"
                      placeholder="Email address"
                      required=""
                    />
                    <input
                      type="submit"
                      className="btn btn-primary shadow-none"
                      defaultValue="Subscribe"
                    />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="footer-bottom">
            <div className="container d-sm-flex align-items-center">
              <div className="footer-left">
                <span className="footer-copyright">
                  © DSP. 20241. All Rights Reserved
                </span>
              </div>
              <div className="footer-right ml-auto mt-1 mt-sm-0">
                <div className="payment-icons">
                  <span
                    className="payment-icon visa"
                    style={{
                      backgroundImage:
                        "url(assets/images/payment-visa.svg)",
                    }}
                  />
                  <span
                    className="payment-icon paypal"
                    style={{
                      backgroundImage:
                        "url(assets/images/payment-paypal.svg)",
                    }}
                  />
                  <span
                    className="payment-icon stripe"
                    style={{
                      backgroundImage:
                        "url(assets/images/payment-stripe.png)",
                    }}
                  />
                  <span
                    className="payment-icon verisign"
                    style={{
                      backgroundImage:
                        "url(assets/images/payment-verisign.svg)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* End .footer-bottom */}
        </div>
      </footer>
    </>
  );
}
