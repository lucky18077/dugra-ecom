import React, { useEffect, useState } from "react";
import axios from "axios";
import feather from "feather-icons";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { LIVE_URL } from "../Api/Route";

export default function CheckOut() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const [customerDetails, setCustomerDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    fetchCartData();
    feather.replace();
  }, []);

  const fetchCartData = async () => {
    try {
      const token = localStorage.getItem("customer_token");
      const response = await axios.get(`${LIVE_URL}/checkout`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status) {
        setCartItems(response.data.data.cart_items);
        setCustomerDetails(response.data.data.customer_details);
        setSelectedAddress({
          address: response.data.data.customer_details.customer_address,
          pincode: response.data.data.customer_details.customer_pincode,
          phone: response.data.data.customer_details.customer_number,
        });
      }
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSubtotal = () => {
    return cartItems
      .reduce(
        (acc, item) =>
          acc + (parseFloat(item.mrp ?? item.base_price) || 0) * item.qty,
        0
      )
      .toFixed(2);
  };

  const getGSTTotal = () => {
    return cartItems
      .reduce((acc, item) => {
        const price = parseFloat(item.mrp ?? item.base_price) || 0;
        const qty = item.qty || 0;
        const gstPercent = parseFloat(item.gst) || 0;
        return acc + (price * qty * gstPercent) / 100;
      }, 0)
      .toFixed(2);
  };
  const getCessTotal = () => {
    return cartItems
      .reduce((acc, item) => {
        const price = parseFloat(item.mrp ?? item.base_price) || 0;
        const qty = item.qty || 0;
        const cessPercent = parseFloat(item.cess_tax) || 0;
        return acc + (price * qty * cessPercent) / 100;
      }, 0)
      .toFixed(2);
  };

  const getTotal = () => {
    return (
      parseFloat(getSubtotal()) +
      parseFloat(getGSTTotal()) +
      parseFloat(getCessTotal())
    ).toFixed(2);
  };

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("customer_token");

    if (!selectedAddress?.address) {
      alert("Please select a delivery address.");
      return;
    }

    const payload = {
      customer_id: customerDetails.id,
      delivery_address: selectedAddress.address,
      delivery_pincode: selectedAddress.pincode,
      delivery_phone: selectedAddress.phone,
      cart_items: cartItems.map((item) => ({
        product_id: item.product_id || item.id,
        qty: item.qty,
        price: parseFloat(item.mrp ?? item.base_price) || 0,
      })),
      total_amount: parseFloat(getTotal()),
      pay_mode: "wallet",
    };

    try {
      const response = await axios.post(`${LIVE_URL}/place-order`, payload, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status) {
        Swal.fire({
          icon: "success",
          title: "Order Confirmed 🎉",
          text: "Your order has been placed successfully!",
          confirmButtonText: "View Invoice",
        }).then(() => {
          navigate(`/invoice/${response.data.order_id}`, {
            state: {
              orderId: response.data.order_id,
              orderDetails: response.data.data,
            },
          });
        });
      } else {
        alert(`❌ ${response.data.message}`);
      }
    } catch (error) {
      console.error("Order placement failed:", error.response || error);
      alert(
        error.response?.data?.message ||
          "Something went wrong while placing the order."
      );
    }
  };

  return (
    <section className="checkout-section-2 section-b-space">
      <div className="container-fluid-lg">
        <div className="row g-sm-4 g-3">
          <div className="col-lg-8">
            <div className="left-sidebar-checkout">
              <div className="checkout-detail-box">
                <ul>
                  <li>
                    <div className="checkout-icon">
                      <lord-icon
                        src="https://cdn.lordicon.com/ggihhudh.json"
                        trigger="loop-on-hover"
                        colors="primary:#d34b0b,secondary:#d34b0b"
                        className="lord-icon"
                      ></lord-icon>
                    </div>
                    <div className="checkout-box">
                      <div className="checkout-title">
                        <h4>Delivery Address</h4>
                      </div>
                      <div className="checkout-detail">
                        <div className="row g-4">
                          {customerDetails && (
                            <div className="col-xxl-6 col-lg-12 col-md-6">
                              <div className="delivery-address-box">
                                <div>
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="delivery_address"
                                      id="delivery_address"
                                      checked={
                                        selectedAddress?.address ===
                                        customerDetails.customer_address
                                      }
                                      onChange={() =>
                                        setSelectedAddress({
                                          address:
                                            customerDetails.customer_address,
                                          pincode:
                                            customerDetails.customer_pincode,
                                          phone:
                                            customerDetails.customer_number,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="label">
                                    <label htmlFor="delivery_address">
                                      Home
                                    </label>
                                  </div>
                                  <ul className="delivery-address-detail">
                                    <li>
                                      <h4 className="fw-500">
                                        {customerDetails.name}
                                      </h4>
                                    </li>
                                    <li>
                                      <p className="text-content">
                                        <span className="text-title">
                                          Address:{" "}
                                        </span>
                                        {customerDetails.customer_address}
                                      </p>
                                    </li>
                                    <li>
                                      <h6 className="text-content">
                                        <span className="text-title">
                                          Pin Code:{" "}
                                        </span>
                                        {customerDetails.customer_pincode}
                                      </h6>
                                    </li>
                                    <li>
                                      <h6 className="text-content mb-0">
                                        <span className="text-title">
                                          Phone:{" "}
                                        </span>
                                        +91-{customerDetails.customer_number}
                                      </h6>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>

                  <li>
                    <div className="checkout-icon">
                      <lord-icon
                        src="https://cdn.lordicon.com/qmcsqnle.json"
                        trigger="loop-on-hover"
                        colors="primary:#d34b0b,secondary:#d34b0b"
                        className="lord-icon"
                      ></lord-icon>
                    </div>
                    <div className="checkout-box">
                      <div className="checkout-title">
                        <h4>Payment Wallet</h4>
                      </div>
                      <div className="checkout-detail">
                        <h4 className="text-content">
                          <strong>
                            ₹
                            {(
                              parseFloat(customerDetails.wallet || 0) -
                              parseFloat(customerDetails.used_wallet || 0)
                            ).toFixed(2)}
                          </strong>
                        </h4>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="right-side-summery-box">
              <div className="summery-box-2">
                <div className="summery-header">
                  <h3>Order Summary</h3>
                </div>
                <ul className="summery-contain">
                  {cartItems.map((item, index) => (
                    <li key={index}>
                      <img
                        src={
                          item.image
                            ? `http://127.0.0.1:8000/product images/${item.image}`
                            : "/assets/images/shop7.png"
                        }
                        className="img-fluid checkout-image"
                        alt={item.name}
                      />
                      <h4 className="custom-tooltip">
                        {item.name.length > 14
                          ? item.name.substring(0, 10) + "..."
                          : item.name}
                        <span className="tooltip-text">{item.name}</span>{" "}
                        <span>X {item.qty}</span>
                      </h4>
                      <h4 className="price">₹{item.base_price}</h4>
                    </li>
                  ))}
                </ul>
                <ul className="summery-total">
                  <li>
                    <h4>Subtotal</h4>
                    <h4 className="price">₹{getSubtotal()}</h4>
                  </li>
                  <li>
                    <h4>GST</h4>
                    <h4 className="price">₹{getGSTTotal()}</h4>
                  </li>
                  <li>
                    <h4>CESS</h4>
                    <h4 className="price">₹{getCessTotal()}</h4>
                  </li>
                  {/* <li>
                    <h4>Shipping</h4>
                    <h4 className="price">₹0.00</h4>
                  </li>
                  <li>
                    <h4>Coupon/Code</h4>
                    <h4 className="price">₹-0.00</h4>
                  </li> */}
                  <li className="list-total">
                    <h4>Total (INR)</h4>
                    <h4 className="price">₹{getTotal()}</h4>
                  </li>
                </ul>
              </div>
              <button
                className="btn theme-bg-color text-white btn-md w-100 mt-4 fw-bold"
                onClick={handlePlaceOrder}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
