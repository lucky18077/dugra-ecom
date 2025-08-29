import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { toTitleCase } from "../Hooks/Helper";
import { LIVE_URL } from "../Api/Route";

export default function BrandItem({
  isLoggedIn,
  openLoginModal,
  setRefreshNavbar,
}) {
  const token = localStorage.getItem("customer_token");
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [wishlisted, setWishlisted] = useState([]);

  const { brandName, brandId, subcategoryId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    const fetchData = async () => {
      try {
        let res;
        if (subcategoryId) {
          res = await axios.get(
            `${LIVE_URL}/get-brands/${brandId}/brands/${subcategoryId}`
          );
        } else {
          res = await axios.get(`${LIVE_URL}/get-brands/${brandId}/brands`);
        }
        const products = res.data.products || [];
        const subcategories = res.data.subcategories || [];
        let cartItems = [];
        if (token) {
          try {
            const cartRes = await axios.get(`${LIVE_URL}/cart-view`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            cartItems = cartRes.data.data || [];
          } catch (err) {
            console.error("Cart fetch error:", err);
          }
        }
        const mergedProducts = products.map((p) => {
          const cartItem = cartItems.find((c) => c.product_id === p.id);
          return { ...p, quantity: cartItem ? cartItem.qty : 0 };
        });

        setSubcategories(subcategories);
        setProducts(mergedProducts);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
  }, [brandId, subcategoryId, token, searchQuery]);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${LIVE_URL}/whishlist-view`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlisted(
          res.data.data?.map((item) => item.product_id || item.id) || []
        );
      } catch (err) {
        console.error("Wishlist fetch error:", err);
      }
    };
    fetchWishlist();
  }, [token]);

  const handleSubcategoryClick = (subId) => {
    navigate(`/brand/${brandName}/${brandId}/subcategory/${subId}`);
  };

  const handleCartUpdate = async (productId, qty = null, qtyType = null) => {
    try {
      await axios.post(
        `${LIVE_URL}/add-to-cart`,
        { product_id: productId, qty, qtyType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRefreshNavbar((prev) => !prev);
    } catch (error) {
      console.error("Cart update error:", error);
    }
  };

  const increment = async (id) => {
    if (!isLoggedIn) return openLoginModal();
    const current = products.find((p) => p.id === id);
    const newQty = current.quantity + 1;
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: newQty } : p))
    );
    await handleCartUpdate(id, newQty, "plus");
  };

  const decrement = async (id) => {
    if (!isLoggedIn) return openLoginModal();
    const current = products.find((p) => p.id === id);
    const newQty = Math.max(0, current.quantity - 1);
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: newQty } : p))
    );
    if (newQty === 0) {
      await axios.post(
        `${LIVE_URL}/remove-cart`,
        { product_id: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else {
      await handleCartUpdate(id, newQty, "minus");
    }
  };

  const updateQuantity = async (id, qty) => {
    if (!isLoggedIn) return openLoginModal();
    if (qty < 1 || isNaN(qty)) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, quantity: 0 } : p))
      );
      await axios.post(
        `${LIVE_URL}/remove-cart`,
        { product_id: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return;
    }
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: qty } : p))
    );
    await handleCartUpdate(id, qty);
  };

  const handleAddToCart = async (id) => {
    if (!isLoggedIn) return openLoginModal();
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: 1 } : p))
    );
    await handleCartUpdate(id, 1);
  };

  const handleTierClick = async (product, qty) => {
    if (!isLoggedIn) return openLoginModal();
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, quantity: qty } : p))
    );
    await handleCartUpdate(product.id, qty);
  };

  const handleWishlistToggle = async (productId) => {
    if (!isLoggedIn) return openLoginModal();
    const isWishlisted = wishlisted.includes(productId);
    const url = isWishlisted
      ? `${LIVE_URL}/remove-wishlist`
      : `${LIVE_URL}/add-to-wishlist`;
    try {
      const res = await axios.post(
        url,
        { product_id: productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setWishlisted((prev) =>
          isWishlisted
            ? prev.filter((id) => id !== productId)
            : [...prev, productId]
        );
        toast.success(
          isWishlisted ? "Removed from wishlist!" : "Added to wishlist!"
        );
      } else {
        toast.error(res.data.message || "Something went wrong!");
      }
    } catch (err) {
      console.error("Wishlist toggle error:", err);
      toast.error("Failed to update wishlist!");
    }
  };

  return (
    <section
      className="blog-section section-b-space"
      style={{ background: "#fff" }}
    >
      <div className="container-fluid-lg">
        <div className="row g-sm-4 g-3">
          {/* Sidebar Subcategories */}
          <div
            className="col-xxl-4 col-xl-4 col-lg-4 d-lg-block d-none sidebar-shop sticky-top"
            style={{ height: "675px", zIndex: 1 }}
          >
            <div className="left-sidebar-box">
              <div className="accordion left-accordion-box">
                <div className="accordion-item">
                  <div className="accordion-collapse collapse show">
                    <div className="accordion-body pt-0 on-scroll">
                      {subcategories.map((sub) => (
                        <div className="recent-post-box" key={sub.id}>
                          <div
                            className={`recent-box d-flex ${
                              Number(subcategoryId) === sub.id
                                ? "text-category"
                                : ""
                            }`}
                            onClick={() => handleSubcategoryClick(sub.id)}
                            style={{ cursor: "pointer" }}
                          >
                            <div className="py-1">
                              <img
                                src="/assets/images/shop7.png"
                                alt=""
                                className="img-fluid blur-up lazyload"
                                style={{
                                  width: "75px",
                                  height: "70px",
                                  borderRadius: "50%",
                                }}
                              />
                            </div>
                            <div className="recent-detail">
                              <h5 className="recent-name">{sub.name}</h5>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div
            className="product-section col-xxl-8 col-xl-8 col-lg-8 ratio_50"
            style={{ padding: 0 }}
          >
            <div className="row">
              {products.length > 0 ? (
                products.map((product) => (
                  <div
                    className="col-6 col-sm-6 col-md-4 mb-2"
                    key={product.id}
                  >
                    <div className="product-card ">
                      <button
                        className="wishlist-btn"
                        onClick={() => handleWishlistToggle(product.id)}
                      >
                        <i
                          className="fa fa-heart"
                          style={{
                            color: wishlisted.includes(product.id)
                              ? "red"
                              : "white",
                            WebkitTextStroke: wishlisted.includes(product.id)
                              ? "1px #ff0000"
                              : "none",
                          }}
                        ></i>
                      </button>

                      <div className="fix-height">
                        <Link to={`/product-detail/${product.id}`}>
                          <img
                            src={
                              product.image
                                ? `http://127.0.0.1:8000/product images/${product.image}`
                                : "/assets/images/shop7.png"
                            }
                            alt=""
                            className="product-img"
                          />
                        </Link>
                        <h6 className="product-title" style={{ color: "gray" }}>
                          {product.category}
                        </h6>
                        <Link
                          to={`/product-detail/${product.id}`}
                          style={{ color: "black" }}
                        >
                          <h6
                            className="product-title"
                            style={{ fontSize: "15px" }}
                          >
                            {toTitleCase(product.name)}
                          </h6>
                        </Link>
                        <p className="product-qty">1 {product.uom}</p>
                      </div>

                      {/* Tier Pricing */}
                      {isLoggedIn && product.details?.length > 0 && (
                        <div className="tire-bg mt-2">
                          {product.details.slice(0, 2).map((tier, idx) => (
                            <div
                              key={idx}
                              className="line-tire-wrapper d-flex tire-line"
                              style={{ marginBottom: "6px", gap: "5px" }}
                            >
                              <div
                                className="line-tire"
                                style={{ fontSize: "13px" }}
                                onClick={() =>
                                  handleTierClick(product, tier.qty)
                                }
                              >
                                ₹{tier.price}/{product.uom} for {tier.qty}{" "}
                                {product.uom}+<div className="sm-line"></div>
                              </div>
                              <div className="mt-3">
                                <span
                                  className="add-qty-c"
                                  onClick={() =>
                                    handleTierClick(product, tier.qty)
                                  }
                                  style={{
                                    cursor: "pointer",
                                    fontSize: "13px",
                                  }}
                                >
                                  Add <span className="plus">{tier.qty}</span>
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Price + Cart */}
                      {isLoggedIn && (
                        <>
                          <div className="line-light"></div>
                          <div className="price-action-wrap">
                            <div>
                              <span className="price">
                                ₹{Number(product.base_price).toFixed(2)}
                              </span>
                              {Number(product.mrp) > 0 && (
                                <del className="mrp">
                                  ₹{Number(product.mrp).toFixed(2)}
                                </del>
                              )}
                            </div>
                            {product.quantity === 0 ? (
                              <button
                                className="add-btn w-800"
                                onClick={() => handleAddToCart(product.id)}
                              >
                                ADD <span className="plus">+</span>
                              </button>
                            ) : (
                              <div className="qty-controls">
                                <button onClick={() => decrement(product.id)}>
                                  -
                                </button>
                                <input
                                  type="number"
                                  min="1"
                                  value={product.quantity}
                                  onChange={(e) =>
                                    updateQuantity(
                                      product.id,
                                      Number(e.target.value)
                                    )
                                  }
                                />
                                <button onClick={() => increment(product.id)}>
                                  +
                                </button>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center mt-5">
                  <h5>No products found for this brand/subcategory.</h5>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
