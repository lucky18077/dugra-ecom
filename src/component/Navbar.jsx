import React from "react";

export default function Navbar({ onLoginClick }) {
  return (
    <>
      <div className="page-wrapper">
        <header className="header">
          <div
            className="header-middle sticky-header"
            data-sticky-options="{'mobile': true}"
          >
            <div className="container">
              <div className="header-left col-lg-2 w-auto pl-0">
                <a className="logo" href="demo4.html">
                  <img
                    alt="Porto Logo"
                    height={44}
                    src="assets/images/logo.png"
                    width={111}
                  />
                </a>
              </div>
              <div className="header-right w-lg-max">
                <div className="header-icon header-search header-search-inline header-search-category w-lg-max text-right mt-0">
                  <a className="search-toggle" href="#" role="button">
                    <i className="icon-search-3"></i>
                  </a>
                  <form action="#" method="get">
                    <div className="header-search-wrapper">
                      <input
                        className="form-control"
                        id="q"
                        name="q"
                        placeholder="Search..."
                        required=""
                        type="search"
                      />
                      <div className="select-custom">
                        <select id="cat" name="cat">
                          <option value="">All Categories</option>
                          <option value={4}>Fashion</option>
                          <option value={12}>- Women</option>
                          <option value={13}>- Men</option>
                          <option value={66}>- Jewellery</option>
                          <option value={67}>- Kids Fashion</option>
                          <option value={5}>Electronics</option>
                          <option value={21}>- Smart TVs</option>
                          <option value={22}>- Cameras</option>
                          <option value={63}>- Games</option>
                          <option value={7}>Home &amp; Garden</option>
                          <option value={11}>Motors</option>
                          <option value={31}>- Cars and Trucks</option>
                          <option value={32}>
                            - Motorcycles &amp; Powersports
                          </option>
                          <option value={33}>- Parts &amp; Accessories</option>
                          <option value={34}>- Boats</option>
                          <option value={57}>
                            - Auto Tools &amp; Supplies
                          </option>
                        </select>
                      </div>
                      <button
                        className="btn icon-magnifier p-0"
                        title="search"
                        type="submit"
                      ></button>
                    </div>
                  </form>
                </div>
                <div className="header-contact d-none d-lg-flex pl-4 pr-4">
                  <img
                    alt="phone"
                    className="pb-1"
                    height={30}
                    src="assets/images/phone.png"
                    width={30}
                  />
                  <h6>
                    <span>Call us now</span>
                    <a className="text-dark font1" href="tel:#">
                      +123 5678 890
                    </a>
                  </h6>
                </div>
                <a
                  className="header-icon login-modal"
                  href="#"
                  title="login"
                  onClick={(e) => {
                    e.preventDefault();
                    onLoginClick();
                  }}
                >
                  <i className="icon-user-2"></i>
                </a>
                {/* <div className="dropdown cart-dropdown">
                  <a
                    aria-expanded="false"
                    aria-haspopup="true"
                    className="dropdown-toggle dropdown-arrow cart-toggle"
                    data-display="static"
                    data-toggle="dropdown"
                    href="#"
                    role="button"
                    title="Cart"
                  >
                    <i className="minicart-icon"></i>
                    <span className="cart-count badge-circle">3</span>
                  </a>
                  <div className="cart-overlay"></div>
                  <div className="dropdown-menu mobile-cart">
                    <a className="btn-close" href="#" title="Close (Esc)">
                      ×
                    </a>
                    <div className="dropdownmenu-wrapper custom-scrollbar">
                      <div className="dropdown-cart-header">Shopping Cart</div>
                      <div className="dropdown-cart-products">
                        <div className="product">
                          <div className="product-details">
                            <h4 className="product-title">
                              <a href="product.html">
                                Ultimate 3D Bluetooth Speaker
                              </a>
                            </h4>
                            <span className="cart-product-info">
                              <span className="cart-product-qty">1</span>×
                              $99.00
                            </span>
                          </div>
                          <figure className="product-image-container">
                            <a className="product-image" href="product.html">
                              <img
                                alt="product"
                                height={80}
                                src="assets/images/product-1.jpg"
                                width={80}
                              />
                            </a>
                            <a
                              className="btn-remove"
                              href="#"
                              title="Remove Product"
                            >
                              <span>×</span>
                            </a>
                          </figure>
                        </div>
                        <div className="product">
                          <div className="product-details">
                            <h4 className="product-title">
                              <a href="product.html">
                                Brown Women Casual HandBag
                              </a>
                            </h4>
                            <span className="cart-product-info">
                              <span className="cart-product-qty">1</span>×
                              $35.00
                            </span>
                          </div>
                          <figure className="product-image-container">
                            <a className="product-image" href="product.html">
                              <img
                                alt="product"
                                height={80}
                                src="assets/images/product-2.jpg"
                                width={80}
                              />
                            </a>
                            <a
                              className="btn-remove"
                              href="#"
                              title="Remove Product"
                            >
                              <span>×</span>
                            </a>
                          </figure>
                        </div>
                        <div className="product">
                          <div className="product-details">
                            <h4 className="product-title">
                              <a href="product.html">
                                Circled Ultimate 3D Speaker
                              </a>
                            </h4>
                            <span className="cart-product-info">
                              <span className="cart-product-qty">1</span>×
                              $35.00
                            </span>
                          </div>
                          <figure className="product-image-container">
                            <a className="product-image" href="product.html">
                              <img
                                alt="product"
                                height={80}
                                src="assets/images/product-3.jpg"
                                width={80}
                              />
                            </a>
                            <a
                              className="btn-remove"
                              href="#"
                              title="Remove Product"
                            >
                              <span>×</span>
                            </a>
                          </figure>
                        </div>
                      </div>
                      <div className="dropdown-cart-total">
                        <span>SUBTOTAL:</span>
                        <span className="cart-total-price float-right">
                          $134.00
                        </span>
                      </div>
                      <div className="dropdown-cart-action">
                        <a
                          className="btn btn-gray btn-block view-cart"
                          href="cart.html"
                        >
                          View Cart
                        </a>
                        <a
                          className="btn btn-dark btn-block"
                          href="checkout.html"
                        >
                          Checkout
                        </a>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </header>
      </div>
    </>
  );
}
