import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import feather from "feather-icons";

export default function Navbar({ isLoggedIn, setIsLoggedIn, refreshNavbar }) {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    feather.replace();
  }, [isLoggedIn, refreshNavbar]);

  const handleLogout = () => {
    localStorage.removeItem("customer_token");
    localStorage.removeItem("customer_user");
    setIsLoggedIn(false);
  };

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/shop/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <>
      <header className="sticky-top bg-white z-3">
        <div className="top-nav top-header sticky-header">
          <div className="container-fluid-lg">
            <div className="row">
              <div className="col-12">
                <div className="navbar-top">
                  <button
                    className="navbar-toggler d-xl-none d-inline navbar-menu-button"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#primaryMenu"
                  >
                    <span className="navbar-toggler-icon">
                      <i className="fa-solid fa-bars" />
                    </span>
                  </button>

                  <Link to="/" className="web-logo nav-logo">
                    <img
                      src="/assets/images/logo.png"
                      className="img-fluid blur-up lazyload"
                      alt="Logo"
                    />
                  </Link>

                  {/* ✅ SEARCH BOX */}
                  <div className="middle-box">
                    <div className="search-box">
                      <div className="input-group">
                        <input
                          type="search"
                          className="form-control"
                          placeholder="I'm searching for..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSearch();
                          }}
                        />
                        <button className="btn" type="button" onClick={handleSearch}>
                          <i data-feather="search" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Side */}
                  <div className="rightside-box">
                    {!isLoggedIn ? (
                      <div
                        className="btn btn-animation mt-xxl-4 home-button mend-auto"
                        data-bs-toggle="modal"
                        data-bs-target="#deal-box"
                      >
                        Login/Signup
                        <i className="fa-solid fa-right-long icon"></i>
                      </div>
                    ) : (
                      <ul className="right-side-menu">
                        {/* Cart */}
                        <li className="right-side">
                          <div className="onhover-dropdown header-badge">
                            <button
                              type="button"
                              className="btn p-0 position-relative header-wishlist"
                            >
                              <i data-feather="shopping-cart" />
                              <span className="position-absolute top-0 start-100 translate-middle badge">
                                2
                              </span>
                            </button>
                            <div className="onhover-div">
                              <ul className="cart-list">
                                <li className="product-box-contain">
                                  <div className="drop-cart">
                                    <Link to="/" className="drop-image">
                                      <img
                                        src="/assets/images/1.png"
                                        className="blur-up lazyload"
                                        alt=""
                                      />
                                    </Link>
                                    <div className="drop-contain">
                                      <Link to="/">
                                        <h5>Fantasy Crunchy Choco Chip Cookies</h5>
                                      </Link>
                                      <h6>
                                        <span>1 x</span> $80.58
                                      </h6>
                                      <button className="close-button close_button">
                                        <i className="fa-solid fa-xmark" />
                                      </button>
                                    </div>
                                  </div>
                                </li>
                                <li className="product-box-contain">
                                  <div className="drop-cart">
                                    <Link to="/" className="drop-image">
                                      <img
                                        src="/assets/images/2.png"
                                        className="blur-up lazyload"
                                        alt=""
                                      />
                                    </Link>
                                    <div className="drop-contain">
                                      <Link to="/">
                                        <h5>Peanut Butter Bite Premium Cookies 600 g</h5>
                                      </Link>
                                      <h6>
                                        <span>1 x</span> $25.68
                                      </h6>
                                      <button className="close-button close_button">
                                        <i className="fa-solid fa-xmark" />
                                      </button>
                                    </div>
                                  </div>
                                </li>
                              </ul>
                              <div className="price-box">
                                <h5>Total :</h5>
                                <h4 className="theme-color fw-bold">$106.58</h4>
                              </div>
                              <div className="button-group">
                                <Link to="/" className="btn btn-sm cart-button">
                                  View Cart
                                </Link>
                                <Link to="/" className="btn btn-sm cart-button theme-bg-color text-white">
                                  Checkout
                                </Link>
                              </div>
                            </div>
                          </div>
                        </li>

                        {/* User */}
                        <li className="right-side onhover-dropdown">
                          <div className="delivery-login-box">
                            <div className="delivery-icon">
                              <i data-feather="user" />
                            </div>
                            <div className="delivery-detail">
                              <h6>Hello,</h6>
                              <h5>My Account</h5>
                            </div>
                          </div>
                          <div className="onhover-div onhover-div-login">
                            <ul className="user-box-name">
                              <li className="product-box-contain">
                                <Link to="/" onClick={handleLogout}>
                                  Log Out
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className="mobile-menu d-md-none d-block mobile-cart">
        <ul>
          <li className="active">
            <Link to="/">
              <i className="iconly-Home icli" />
              <span>Home</span>
            </Link>
          </li>
          <li className="mobile-category">
            <Link to="/">
              <i className="iconly-Category icli js-link" />
              <span>Category</span>
            </Link>
          </li>
          <li>
            <Link to="/" className="search-box">
              <i className="iconly-Search icli" />
              <span>Search</span>
            </Link>
          </li>
          <li>
            <Link to="/" className="notifi-wishlist">
              <i className="iconly-Heart icli" />
              <span>My Wish</span>
            </Link>
          </li>
          <li>
            <Link to="/">
              <i className="iconly-Bag-2 icli fly-cate" />
              <span>Cart</span>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
