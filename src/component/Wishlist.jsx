import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toTitleCase } from "../Hooks/Helper";
import { LIVE_URL } from "../Api/Route";

export default function Wishlist({ setRefreshNavbar }) {
  const [cartItems, setCartItems] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [totalgst, setTotalGST] = useState(0);
  const [cessTotal, setCessTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [grandTotal, setGrandTotal] = useState(0);
  const [isAddingAll, setIsAddingAll] = useState(false);
  const token = localStorage.getItem("customer_token");
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${LIVE_URL}/whishlist-view`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const result = response.data;
      if (result && result.data) {
        setCartItems(result.data);

        let subtotal = 0;
        let gstTotal = 0;
        let cessTotal = 0;

        result.data.forEach((item) => {
          const price =
            item.mrp !== null && !isNaN(parseFloat(item.mrp))
              ? parseFloat(item.mrp)
              : parseFloat(item.base_price) || 0;

          const qty = item.qty || 0;
          const gstPercent = parseFloat(item.gst) || 0;
          const cessPercent = parseFloat(item.cess_tax) || 0;

          const lineTotal = price * qty;
          const lineGST = (lineTotal * gstPercent) / 100;
          const lineCess = (lineTotal * cessPercent) / 100;

          subtotal += lineTotal;
          gstTotal += lineGST;
          cessTotal += lineCess;
        });

        setSubTotal(subtotal);
        setTotalGST(gstTotal);
        setCessTotal(cessTotal);
        setGrandTotal(subtotal + cessTotal + gstTotal);
      }
    } catch (err) {
      console.error("Failed to load cart data:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleCartUpdate = async (productId, qty = null, qtyType = null) => {
    try {
      await axios.post(
        `${LIVE_URL}/add-to-wishlist`,
        { product_id: productId, qty, qtyType },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchCart();
    } catch (error) {
      console.error("Cart update error:", error);
    }
  };

  const handleCart = async (productId, qty = 1, qtyType = null) => {
    try {
      await axios.post(
        `${LIVE_URL}/add-to-cart`,
        { product_id: productId, qty, qtyType },
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

  const increment = async (item) => {
    const newQty = item.qty + 1;
    await handleCartUpdate(item.product_id, newQty);
  };

  const decrement = async (item) => {
    await handleCartUpdate(item.product_id, 1, "minus");
  };

  const updateQuantity = async (item, qty) => {
    const qtyNum = parseInt(qty);
    if (!isNaN(qtyNum) && qtyNum > 0) {
      await handleCartUpdate(item.product_id, qtyNum);
    }
  };

  const removeItem = async (productId) => {
    try {
      await axios.post(
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
      setCartItems((prev) =>
        prev.filter((item) => item.product_id !== productId)
      );
    } catch (error) {
      console.error("Remove item error:", error?.response?.data || error);
    }
  };
  const handleTierClick = async (item, tierQty) => {
    await handleCartUpdate(item.product_id, tierQty);
  };
  const filteredItems = cartItems.filter((item) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalEstimate = cartItems.reduce(
    (acc, item) => acc + (parseFloat(item.base_price) || 0) * (item.qty || 0),
    0
  );
  const handleAddAllToCart = async () => {
    if (cartItems.length === 0) return;

    setIsAddingAll(true);
    try {
      for (const item of cartItems) {
        await axios.post(
          `${LIVE_URL}/add-to-cart`,
          { product_id: item.product_id, qty: item.qty },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      toast.success("All products added to cart!");
      setRefreshNavbar((prev) => !prev);
    } catch (error) {
      console.error("Error adding all to cart:", error);
      toast.error("Failed to add all products to cart.");
    } finally {
      setIsAddingAll(false);
    }
  };
  return (
    <section
      className="cart-section section-b-space"
      style={{ backgroundColor: "#fff4e842" }}
    >
      <div className="container-fluid-lg">
        <div className="row g-sm-5 g-3">
          <div className="cart-table table-padding">
            <div className="table-responsive custom-table">
              <div className="cart-header mb-4">
                <div className="d-flex justify-content-between align-items-center header-bar">
                  <h3 className="text-theme font-sm" style={{ color: "white" }}>
                    My Products Wish List
                  </h3>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ maxWidth: "300px", marginRight: "65px" }}
                  />
                </div>
              </div>

              {/* Table */}
              <table className="table">
                <tbody>
                  {filteredItems.map((item, index) => (
                    <React.Fragment key={item.product_id}>
                      <tr className="product-box-contain">
                        {/* ✅ same table design — no change */}
                        <td className="product-detail" style={{ width: "40%",paddingLeft:"60px" }}>
                          <div className="product border-0">
                            <span style={{ marginRight: "10px" }}>
                              {index + 1}
                            </span>
                            <Link to="#" className="product-image">
                              <img
                                src={
                                  item.image
                                    ? `http://127.0.0.1:8000/product images/${item.image}`
                                    : "/assets/images/shop7.png"
                                }
                                className="img-fluid blur-up lazyload"
                                alt=""
                              />
                            </Link>
                            <div>
                              <ul>
                                <li
                                  className="name custom-tooltip"
                                  style={{ fontSize: "15px" }}
                                >
                                  {toTitleCase(item.name)}
                                  {item.details && item.details.length > 0 && (
                                    <div style={{ marginTop: "8px" }}>
                                      {" "}
                                      {item.details
                                        .slice(0, 2)
                                        .map((tier, idx) => {
                                          const perUnitSaving = (
                                            item.base_price - tier.price
                                          ).toFixed(2);
                                          return (
                                            <div
                                              key={idx}
                                              className="blink-message"
                                              style={{
                                                cursor: "pointer",
                                                marginBottom: "4px",
                                              }}
                                              onClick={() =>
                                                handleTierClick(item, tier.qty)
                                              }
                                            >
                                              {" "}
                                              ₹{tier.price}/{item.uom} for{" "}
                                              {tier.qty} {item.uom}+{" "}
                                            </div>
                                          );
                                        })}{" "}
                                    </div>
                                  )}
                                </li>
                              </ul>
                            </div>
                          </div>
                        </td>
                        <td className="price">
                          <h4 className="table-title text-content">Price</h4>
                          <h5>
                            ₹
                            {parseFloat(item.base_price ?? item.mrp).toFixed(2)}
                          </h5>
                        </td>
                        <td className="quantity width-fix">
                          <h4 className="table-title text-content">Quantity</h4>
                          <div
                            className="quantity-price"
                            style={{ width: "75%" }}
                          >
                            <div className="cart_qty">
                              <div
                                className="input-group"
                                style={{ width: "70%" }}
                              >
                                <button
                                  type="button"
                                  className="btn qty-left-minus"
                                  onClick={() => decrement(item)}
                                >
                                  <i className="fa fa-minus ms-0" />
                                </button>
                                <input
                                  className="form-control input-number qty-input"
                                  type="number"
                                  min="1"
                                  value={item.qty}
                                  onChange={(e) =>
                                    updateQuantity(item, e.target.value)
                                  }
                                />
                                <button
                                  type="button"
                                  className="btn qty-right-plus"
                                  onClick={() => increment(item)}
                                >
                                  <i className="fa fa-plus ms-0" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="save-remove">
                          <h4 className="table-title text-content">Action</h4>
                          <div className="d-flex" style={{ gap: "10px" }}>
                            <button
                              className="wish-btn"
                              onClick={() =>
                                handleCart(
                                  item.product_id,
                                  item.qty > 0 ? item.qty : 1
                                )
                              }
                            >
                              Add Cart
                            </button>
                            <button
                              type="button"
                              className="wish-remove"
                              onClick={() => removeItem(item.product_id)}
                            >
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}

                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center" }}>
                        <div>
                          <img
                            src="/assets/images/empty-cart.png"
                            alt="Empty Cart"
                            style={{ maxWidth: "200px", marginTop: "10px" }}
                          />
                          <p>No matching products found.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="1" className="text-end ">
                      <h5 style={{ fontWeight: "600", fontSize: "20px" }}>
                        {" "}
                        Total Estimate:
                      </h5>
                    </td>
                    <td
                      className="2"
                      style={{ fontWeight: "600", fontSize: "20px" }}
                    >
                      ₹{totalEstimate.toFixed(2)}
                    </td>
                    <td className=""> </td>
                    <td>
                      <button
                        className="wish-btn"
                        onClick={handleAddAllToCart}
                        disabled={isAddingAll}
                        style={{ fontSize: "16px", marginLeft: "20px" }}
                      >
                        {isAddingAll ? "Adding..." : "Add All To Cart"}
                      </button>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
