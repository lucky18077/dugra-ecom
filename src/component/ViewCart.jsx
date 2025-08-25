import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { LIVE_URL } from "../Api/Route";

export default function ViewCart() {
  const [cartItems, setCartItems] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [totalgst, setTotalGST] = useState(0);
  const [cessTotal, setCessTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const token = localStorage.getItem("customer_token");
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${LIVE_URL}/cart-view`, {
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
      await fetchCart();
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
        `${LIVE_URL}/remove-cart`,
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

  return (
    <section className="cart-section section-b-space">
      <div className="container-fluid">
        <div className="row g-sm-5 g-3">
          <div className="col-md-9">
            <div className="cart-table">
              <div className="table-responsive-xl">
                <table className="table">
                  <tbody>
                    {cartItems.map((item) => (
                      <React.Fragment key={item.product_id}>
                        {/* Actual product row */}
                        <tr className="product-box-contain">
                          <td className="product-detail">
                            <div className="product border-0">
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
                              <div className="product-detail">
                                <ul>
                                  <li className="name custom-tooltip">
                                    {item.name.length > 25
                                      ? item.name.substring(0, 25) + "..."
                                      : item.name}

                                    {item.details &&
                                      item.details.length > 0 && (
                                        <div style={{ marginTop: "8px" }}>
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
                                                    handleTierClick(
                                                      item,
                                                      tier.qty
                                                    )
                                                  }
                                                >
                                                  ₹{tier.price}/{item.uom}{" "}
                                                  for {tier.qty} {item.uom}+
                                                </div>
                                              );
                                            })}
                                        </div>
                                      )}
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </td>
                          <td className="price width-fix">
                            <h4 className="table-title text-content">Price</h4>
                            <h5>
                              ₹
                              {parseFloat(item.mrp ?? item.base_price).toFixed(
                                2
                              )}
                            </h5>
                          </td>
                          <td className="gst width-fix">
                            <h4 className="table-title text-content">GST</h4>
                            <h5>{parseFloat(item.gst || 0).toFixed(2)}%</h5>
                          </td>
                          <td className="cess width-fix">
                            <h4 className="table-title text-content">CESS</h4>
                            <h5>
                              {parseFloat(item.cess_tax || 0).toFixed(2)}%
                            </h5>
                          </td>
                          <td className="quantity">
                            <h4 className="table-title text-content">Qty</h4>
                            <div
                              className="quantity-price"
                              style={{ width: "75%" }}
                            >
                              <div className="cart_qty">
                                <div className="input-group">
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
                            <button
                              type="button"
                              className="remove close_button btn btn-link p-0"
                              onClick={() => removeItem(item.product_id)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}

                    {cartItems.length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ textAlign: "center" }}>
                          <div>
                            <img
                              src="/assets/images/empty-cart.png"
                              alt="Empty Cart"
                              style={{ maxWidth: "200px", marginTop: "10px" }}
                            />
                            <p>Your cart is empty.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="summery-box p-sticky">
              <div className="summery-header">
                <h3>Cart Total</h3>
              </div>
              <div className="summery-contain">
                <ul>
                  <li>
                    <h4>Subtotal</h4>
                    <h4 className="price">₹{subTotal.toFixed(2)}</h4>
                  </li>
                  <li>
                    <h4>GST</h4>
                    <h4 className="price">₹{totalgst.toFixed(2)}</h4>
                  </li>
                  <li>
                    <h4>CESS</h4>
                    <h4 className="price">₹{cessTotal.toFixed(2)}</h4>
                  </li>
                  <li>
                    <h4>Coupon Discount</h4>
                    <h4 className="price">₹0.00</h4>
                  </li>
                  <li>
                    <h4>Shipping</h4>
                    <h4 className="price">₹0.00</h4>
                  </li>
                </ul>
              </div>
              <ul className="summery-total">
                <li className="list-total border-top-0">
                  <h4>Total (INR)</h4>
                  <h4 className="price theme-color">
                    ₹{grandTotal.toFixed(2)}
                  </h4>
                </li>
              </ul>
              <div className="button-group cart-button">
                <ul>
                  <li>
                    <button
                      className="btn btn-animation proceed-btn fw-bold"
                      onClick={() => navigate("/checkout")}
                      disabled={cartItems.length === 0}
                    >
                      Process To Checkout
                    </button>
                  </li>
                  <li>
                    <button
                      className="btn btn-light shopping-button text-dark"
                      onClick={() => navigate("/")}
                    >
                      <i className="fa-solid fa-arrow-left-long" />
                      Return To Shopping
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
