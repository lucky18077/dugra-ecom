import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import feather from "feather-icons";
import axios from "axios";
import { toTitleCase } from "../Hooks/Helper";
import { LIVE_URL } from "../Api/Route";

export default function Navbar({ isLoggedIn, setIsLoggedIn, refreshNavbar }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [cartQty, setCartQty] = useState(0);
  const [customerName, setCustomerName] = useState(
    localStorage.getItem("customer_name") || "Guest"
  );

  const navigate = useNavigate();

  const fetchCartCount = async () => {
    const token = localStorage.getItem("customer_token");
    if (!token) {
      setCartQty(0);
      return;
    }

    try {
      const res = await axios.get(`${LIVE_URL}/get-cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartQty(res.data?.total_qty || 0);
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
    if (isLoggedIn) {
      fetchCartCount();
      setCustomerName(localStorage.getItem("customer_name") || "Guest");
    } else {
      setCustomerName("Guest");
      setCartQty(0);
    }
  }, [isLoggedIn, refreshNavbar]);

  // Replace feather icons after every render
  useEffect(() => {
    feather.replace();
  }, [cartQty, customerName]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
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
                <div className="navbar-top d-flex align-items-center justify-content-between">
                  {/* Logo */}
                  <Link to="/" className="web-logo nav-logo">
                    <img
                      src="/assets/images/logo.png"
                      className="img-fluid blur-up lazyload"
                      alt="Logo"
                    />
                  </Link>

                  {/* Search Box */}
                  <div className="middle-box" style={{ marginRight: "233px" }}>
                    <div className="search-box">
                      <div
                        className="position-relative"
                        style={{
                          width: "440px",
                          borderRadius: "12px",
                        }}
                      >
                        <input
                          type="search"
                          className="form-control pe-5" // padding right for button
                          placeholder="Search By Product Name, Category, SKU"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSearch();
                          }}
                          style={{
                            borderRadius: "12px",
                          }}
                        />
                        <button
                          className="btn position-absolute top-0 end-0 h-100"
                          type="button"
                          onClick={handleSearch}
                          style={{
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                          }}
                        >
                          <i data-feather="search" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Side */}
                  <div className="rightside-box d-flex align-items-center gap-3">
                    {!isLoggedIn ? (
                      <button
                        className="btn btn-animation"
                        data-bs-toggle="modal"
                        data-bs-target="#deal-box"
                      >
                        Login/Register{" "}
                        <i className="fa-solid fa-right-long icon"></i>
                      </button>
                    ) : (
                      <>
                        <Link
                          to="/view-wishlist"
                          className="btn p-0 position-relative"
                        >
                          <i data-feather="heart" />
                        </Link>

                        <Link
                          to="/view-cart"
                          className="btn p-0 position-relative"
                        >
                          <i data-feather="shopping-cart" />
                          <span className="position-absolute top-0 start-100 translate-middle badge bg-danger">
                            {cartQty || 0}
                          </span>
                        </Link>

                        <Link
                          to="/profile"
                          className="btn p-0 position-relative d-flex align-items-center gap-1"
                        >
                          <i data-feather="user" />
                          <span style={{ fontSize: "14px", fontWeight: 500 }}>
                            Welcome, {toTitleCase(customerName)}
                          </span>
                        </Link>
                      </>
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
        <ul className="d-flex justify-content-around">
          <li className="active">
            <Link to="/">
              <i className="iconly-Home icli" />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link to="/categories">
              <i className="iconly-Category icli" />
              <span>Category</span>
            </Link>
          </li>
          <li>
            <Link to="/view-cart">
              <i className="iconly-Bag-2 icli" />
              <span>Cart</span>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
