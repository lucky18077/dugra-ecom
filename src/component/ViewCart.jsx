import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { LIVE_URL } from "../Api/Route";

export default function ViewCart() {
  const [cartItems, setCartItems] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const token = localStorage.getItem("customer_token");
  const navigate = useNavigate();

  // Fetch cart items from the backend
  const fetchCart = async () => {
    try {
      const response = await fetch(`${LIVE_URL}/cart-view/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const result = await response.json();
      if (result && result.data) {
        setCartItems(result.data);
        const total = result.data.reduce((acc, item) => {
          const price = parseFloat(item.base_price) || 0;
          return acc + price * item.qty;
        }, 0);
        setSubTotal(total);
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
  return (
    <section className="cart-section section-b-space">
      <div className="container-fluid-lg">
        <div className="row g-sm-5 g-3">
          <div className="col-md-8">
            <div className="cart-table">
              <div className="table-responsive-xl">
                <table className="table">
                  <tbody>
                    {cartItems.map((item) => (
                      <tr className="product-box-contain" key={item.product_id}>
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
                                  {item.name.length > 30
                                    ? item.name.substring(0, 30) + "..."
                                    : item.name}
                                  <span className="tooltip-text">
                                    {item.name}
                                  </span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </td>

                        <td className="price">
                          <h4 className="table-title text-content">Price</h4>
                          <h5>₹{parseFloat(item.base_price).toFixed(2)}</h5>
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
                      </tr>
                    ))}

                    {cartItems.length === 0 && (
                      <tr>
                        <td colSpan="3">Your cart is empty.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="col-md-4">
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
                  <h4 className="price theme-color">₹{subTotal.toFixed(2)}</h4>
                </li>
              </ul>
              <div className="button-group cart-button">
                <ul>
                  <li>
                    <button
                      className="btn btn-animation proceed-btn fw-bold"
                      onClick={() => navigate("/checkout")}
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
