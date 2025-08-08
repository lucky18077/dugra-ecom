import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import feather from "feather-icons";
import axios from "axios";
import { LIVE_URL } from "../Api/Route";

export default function Navbar({ isLoggedIn, setIsLoggedIn, refreshNavbar }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [cartQty, setCartQty] = useState(0);
  const navigate = useNavigate();

  const fetchCartCount = async () => {
    const token = localStorage.getItem("customer_token");

    if (!token) {
      setCartQty(0);
      return;
    }
    try {
      const res = await axios.get(`${LIVE_URL}/get-cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data && typeof res.data.total_qty === "number") {
        setCartQty(res.data.total_qty);
      } else {
        setCartQty(0);
      }
    } catch (err) {
      console.error("Cart fetch error:", err);
      setCartQty(0);
    }
  };

  useEffect(() => {
    let interval;
    if (isLoggedIn) {
      fetchCartCount();  
      interval = setInterval(fetchCartCount, 2000); 
    }
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  useEffect(() => {
    feather.replace();
  }, [cartQty]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("customer_token");

      if (token) {
        await fetch(`${LIVE_URL}/customer-logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      localStorage.removeItem("customer_token");
      localStorage.removeItem("customer_user");
      localStorage.removeItem("customer_id");
      setIsLoggedIn(false);
      setCartQty(0);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/shop/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <>
      <header className="sticky-top bg-white z-3 nab-bottom">
        <div className="top-nav top-header sticky-header mb-mobile">
          <div className="container-fluid-lg">
            <div className="row">
              <div className="col-12">
                <div className="navbar-top">
                  {/* Logo */}
                  <Link to="/" className="web-logo nav-logo">
                    <img
                      src="/assets/images/logo.png"
                      className="img-fluid blur-up lazyload"
                      alt="Logo"
                    />
                  </Link>

                  {/* Search Box */}
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
                        <button
                          className="btn"
                          type="button"
                          onClick={handleSearch}
                        >
                          <i data-feather="search" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Contact Number */}
                  <div className="d-flex mobile-hide" style={{ gap: "20px" }}>
                    <div className="delivery-icon">
                      <i data-feather="phone-call" />
                    </div>
                    <div className="delivery-detail mt-1">
                      <h5>+91 1234567890</h5>
                    </div>
                  </div>

                  {/* Right Side Navigation */}
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
                        <li className="right-side">
                          <div className="delivery-login-box">
                            <div className="delivery-icon">
                              <div className="search-box">
                                <i data-feather="search" />
                              </div>
                            </div>
                          </div>
                        </li>

                        {/* Cart Icon */}
                        <li className="right-side">
                          <Link
                            to="/view-cart"
                            className="btn p-0 position-relative header-wishlist"
                          >
                            <i data-feather="shopping-cart" />
                            {cartQty > 0 && (
                              <span className="position-absolute top-0 start-100 translate-middle badge">
                                {cartQty}
                                <span className="visually-hidden">
                                  cart quantity
                                </span>
                              </span>
                            )}
                          </Link>
                        </li>

                        {/* User Dropdown */}
                        <li className="right-side onhover-dropdown">
                          <div className="delivery-login-box">
                            <div className="delivery-icon">
                              <i data-feather="user" />
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

      {/* Mobile Bottom Menu */}
      <div className="mobile-menu d-md-none d-block mobile-cart">
        <ul>
          <li className="active">
            <Link to="/">
              <i className="iconly-Home icli" />
              <span>Home</span>
            </Link>
          </li>
          <li className="mobile-category">
            <Link to="/categories">
              <i className="iconly-Category icli js-link" />
              <span>Category</span>
            </Link>
          </li>
          <li>
            <Link to="/view-cart">
              <i className="iconly-Bag-2 icli fly-cate" />
              <span>Cart</span>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
