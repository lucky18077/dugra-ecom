import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toTitleCase } from "../Hooks/Helper";
import { LIVE_URL } from "../Api/Route";
import { toast } from "react-toastify"; // make sure react-toastify is installed

export default function Wishlist({ setRefreshNavbar }) {
  const token = localStorage.getItem("customer_token");
  const [products, setProducts] = useState([]);
  const [wishlisted, setWishlisted] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await axios.get(`${LIVE_URL}/whishlist-view`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const wishlistProducts = res.data.data || [];
        setProducts(wishlistProducts.map((p) => ({ ...p, quantity: 0 })));
        setWishlisted(wishlistProducts.map((p) => p.id));
      } catch (err) {
        console.error("Wishlist fetch error:", err);
      }
    };
    fetchWishlist();
  }, []);

  const handleCartUpdate = async (product_id, qty = null, qtyType = null) => {
    try {
      await axios.post(
        `${LIVE_URL}/add-to-cart`,
        { product_id, qty, qtyType },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRefreshNavbar((prev) => !prev);
    } catch (error) {
      console.error("Cart update error:", error);
    }
  };

  const increment = async (product_id) => {
    const currentProduct = products.find((p) => p.product_id === product_id);
    const newQty = currentProduct.quantity + 1;
    setProducts((prev) =>
      prev.map((p) =>
        p.product_id === product_id ? { ...p, quantity: newQty } : p
      )
    );
    await handleCartUpdate(product_id, newQty, "plus");
  };

  const decrement = async (product_id) => {
    const currentProduct = products.find((p) => p.product_id === product_id);
    const newQty = Math.max(0, currentProduct.quantity - 1);
    setProducts((prev) =>
      prev.map((p) =>
        p.product_id === product_id ? { ...p, quantity: newQty } : p
      )
    );
    await handleCartUpdate(product_id, newQty, "minus");
  };

  const updateQuantity = async (product_id, qty) => {
    if (qty < 1 || isNaN(qty)) return;
    setProducts((prev) =>
      prev.map((p) =>
        p.product_id === product_id ? { ...p, quantity: qty } : p
      )
    );
    await handleCartUpdate(product_id, qty);
  };

  const handleAddToCart = async (product_id) => {
    const currentProduct = products.find((p) => p.product_id === product_id);
    const newQty = currentProduct.quantity > 0 ? currentProduct.quantity : 1;

    setProducts((prev) =>
      prev.map((p) =>
        p.product_id === product_id ? { ...p, quantity: newQty } : p
      )
    );

    await handleCartUpdate(product_id, newQty, "plus");
  };

  const handleTierClick = async (product, qty) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.product_id === product.product_id ? { ...p, quantity: qty } : p
      )
    );
    await handleCartUpdate(product.product_id, qty);
  };

  const handleRemoveWishlist = async (productId) => {
    try {
      const response = await axios.post(
        `${LIVE_URL}/remove-wishlist`,
        { product_id: productId },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Removed from wishlist!");
        setWishlisted((prev) => prev.filter((id) => id !== productId));
        setProducts((prev) => prev.filter((p) => p.product_id !== productId));
      } else {
        toast.error(response.data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Wishlist remove error:", error);
      toast.error("Failed to remove from wishlist!");
    }
  };

  return (
    <>
      <section className="breadcrumb-section pt-0">
        <div className="container-fluid-lg">
          <div className="row">
            <div className="col-12">
              <div className="breadcrumb-contain">
                <h2>Wishlist</h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="blog-section"
        style={{ background: "#fff", padding: "0px" }}
      >
        <div className="container-fluid-lg mt-5">
          <div className="row g-sm-4 g-3">
            <div
              className="product-section col-12 ratio_50"
              style={{ padding: 0 }}
            >
              <div className="row">
                {products.map((product) => (
                  <div
                    className="col-3 col-sm-6 col-md-3 mb-2"
                    key={product.id}
                  >
                    <div className="product-card">
                      <button
                        className="wishlist-btn"
                        onClick={() => handleRemoveWishlist(product.product_id)}  
                      >
                        <i
                          className="fa fa-heart"
                          style={{
                            color: "red",
                            WebkitTextStroke: "1px #ff0000",
                          }}
                        ></i>
                      </button>

                      <div>
                        <Link to={`/product-detail/${product.product_id}`}>
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
                        <Link
                          to={`/product-detail/${product.product_id}`}
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

                      {product.details && product.details.length > 0 && (
                        <div className="tire-bg mt-2">
                          {product.details.slice(0, 3).map((tier, idx) => (
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
                                Buy {tier.qty} & Save ₹
                                {(
                                  (Number(product.base_price) - tier.price) *
                                  tier.qty
                                ).toFixed(2)}
                                <div className="sm-line"></div>
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
                            onClick={() => handleAddToCart(product.product_id)}
                          >
                            ADD <span className="plus">+</span>
                          </button>
                        ) : (
                          <div className="qty-controls">
                            <button
                              onClick={() => decrement(product.product_id)}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={product.quantity}
                              onChange={(e) =>
                                updateQuantity(
                                  product.product_id,
                                  Number(e.target.value)
                                )
                              }
                            />
                            <button
                              onClick={() => increment(product.product_id)}
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {products.length === 0 && (
                  <div className="text-center mt-5">
                    <img
                      src="/assets/images/empty-cart.png"
                      alt="Empty Cart"
                      style={{ maxWidth: "200px", marginTop: "10px" }}
                    />
                    <h5 className="mt-2">No products in your wishlist.</h5>
                    <Link to="/">
                      <button
                        className="mt-4"
                        style={{
                          backgroundColor: "#d34b0b",
                          color: "#fff",
                          border: "none",
                          padding: "12px 25px",
                          fontSize: "16px",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                      >
                        Back to Shopping
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
