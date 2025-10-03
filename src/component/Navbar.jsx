import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import feather from "feather-icons";
import axios from "axios";
import { toTitleCase } from "../Hooks/Helper";
import { LIVE_URL } from "../Api/Route";

export default function Navbar({ isLoggedIn, setIsLoggedIn, refreshNavbar }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [cartQty, setCartQty] = useState(0);
  const [wallet, setWallet] = useState(null);
  const [customerName, setCustomerName] = useState(
    localStorage.getItem("customer_name") || "Guest"
  );

  const dropdownRef = useRef(null);
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

  const fetchWallet = async () => {
    const token = localStorage.getItem("customer_token");
    if (!token) {
      setWallet(null);
      return;
    }
    try {
      const reswallet = await axios.get(`${LIVE_URL}/customer-detail`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setWallet(reswallet.data.data.company);
    } catch (err) {
      console.error("Wallet fetch error:", err);
      setWallet(null);
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
      fetchWallet();
      setCustomerName(localStorage.getItem("customer_name") || "Guest");
    } else {
      setCustomerName("Guest");
      setCartQty(0);
      setWallet(null);
    }
  }, [isLoggedIn, refreshNavbar]);

  useEffect(() => {
    feather.replace();
  }, [cartQty, customerName]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!searchTerm.trim()) {
        setResults([]);
        setShowDropdown(false);
        return;
      }
      try {
        const response = await axios.get(`${LIVE_URL}/search-products`, {
          params: { query: searchTerm },
        });
        const data = response.data?.data?.data || [];
        setResults(data);
        setShowDropdown(true);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setResults([]);
        setShowDropdown(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("customer_token");
    try {
      if (token) {
        await axios.post(
          `${LIVE_URL}/customer-logout`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch {
    } finally {
      localStorage.removeItem("customer_token");
      localStorage.removeItem("customer_name");
      delete axios.defaults.headers?.common?.Authorization;
      window.location.replace("/");
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
                  <Link
                    to="/"
                    className="web-logo nav-logo"
                    style={{ padding: "15px" }}
                  >
                    <img
                      src="/assets/images/bulk-basket.png"
                      className="img-fluid blur-up lazyload"
                      alt="Logo"
                    />
                  </Link>

                  {/* Search Box */}
                  <div className="middle-box" style={{ marginRight: "80px" }}>
                    <div
                      className="search-box position-relative"
                      ref={dropdownRef}
                    >
                      <input
                        type="search"
                        className="form-control pe-5"
                        placeholder="Search By Product Name, Category, SKU"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ borderRadius: "12px", width: "440px" }}
                      />
                      <button
                        className="btn position-absolute top-0 end-0 h-100"
                        type="button"
                        onClick={() => navigate(`/search?query=${searchTerm}`)}
                        style={{
                          borderTopLeftRadius: 0,
                          borderBottomLeftRadius: 0,
                        }}
                      >
                        <i data-feather="search" />
                      </button>

                      {/* Search Results Dropdown */}
                      {showDropdown && (
                        <div
                          className="search-results position-absolute bg-white shadow p-2 mt-1"
                          style={{
                            width: "440px",
                            borderRadius: "12px",
                            zIndex: 999,
                            maxHeight: "500px",
                            overflowY: "auto",
                          }}
                        >
                          {results.length > 0 ? (
                            results.map((product) => (
                              <div
                                key={product.id}
                                className="d-flex align-items-center p-2 border-bottom"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  navigate(
                                    `/shop/category/${product.category_id}/subcategory/${product.sub_category_id}`
                                  );
                                  setShowDropdown(false);
                                }}
                              >
                                <img
                                  src={`http://127.0.0.1:8000/product images/${product.image}`}
                                  alt={product.name}
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                  }}
                                />
                                <span className="ms-2">
                                  {toTitleCase(product.name)}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className="p-2 text-muted text-center">
                              No products found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Side */}
                  <div className="rightside-box d-flex align-items-center gap-4">
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
                        {/* Wallet */}
                        <Link to="/wallet-ledger">
                          <div className="btn p-0 position-relative wallet-tooltip">
                            <i data-feather="credit-card"></i>
                            <span className="tooltip-box">
                              💰 Wallet Balance: ₹
                              {wallet
                                ? (
                                    Number(wallet.wallet) -
                                    Number(wallet.used_wallet)
                                  ).toFixed(2)
                                : "0.00"}
                            </span>
                          </div>
                        </Link>

                        {/* Wishlist */}
                        <Link
                          to="/view-wishlist"
                          className="btn p-0 position-relative wallet-tooltip"
                        >
                          <i data-feather="heart" />
                          <span className="tooltip-box">Wish List</span>
                        </Link>

                        {/* Cart */}
                        <Link
                          to="/view-cart"
                          className="btn p-0 position-relative wallet-tooltip"
                        >
                          <i data-feather="shopping-cart" />
                          <span className="tooltip-box">Cart</span>
                          <span className="position-absolute top-0 start-100 translate-middle badge bg-danger">
                            {cartQty || 0}
                          </span>
                        </Link>

                        {/* Profile */}
                        <Link
                          to="/profile"
                          className="btn p-0 position-relative d-flex align-items-center gap-1 wallet-tooltip"
                        >
                          <i data-feather="user" />
                          <span className="tooltip-box">Profile</span>
                          <span style={{ fontSize: "16px", fontWeight: 500 }}>
                            Welcome, {toTitleCase(customerName)}
                          </span>
                        </Link>

                        <button
                          className="btn btn-sm wallet-tooltip"
                          onClick={handleLogout} style={{ padding:"0px" }}
                        >
                          <i data-feather="log-out" className="me-1"></i>
                          <span className="tooltip-box">Logout</span>
                        </button>
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
