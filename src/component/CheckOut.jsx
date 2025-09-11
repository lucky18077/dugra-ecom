import React, { useEffect, useState } from "react";
import axios from "axios";
import feather from "feather-icons";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toTitleCase } from "../Hooks/Helper";
import { LIVE_URL } from "../Api/Route";

export default function CheckOut() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const [customerDetails, setCustomerDetails] = useState({});
  const [loading, setLoading] = useState(true);

  const [selectedBilling, setSelectedBilling] = useState(null);
  const [selectedShipping, setSelectedShipping] = useState(null);

  // 👇 shipping addresses array
  const [shippingAddresses, setShippingAddresses] = useState([]);

  // 👇 address form
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    pincode: "",
    city: "",
    state: "",
    district: "",
    remarks: "",
  });

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

        const defaultAddr = {
          name: response.data.data.customer_details.name,
          address: response.data.data.customer_details.customer_address,
          pincode: response.data.data.customer_details.customer_pincode,
          phone: response.data.data.customer_details.customer_number,
          email: response.data.data.customer_details.customer_email,
          state: response.data.data.customer_details.customer_state,
          district: response.data.data.customer_details.customer_district,
          city: response.data.data.customer_details.customer_city,
        };

        // init billing + shipping
        setSelectedBilling(defaultAddr);
        setSelectedShipping(defaultAddr);

        // init shippingAddresses array
        setShippingAddresses([defaultAddr]);
      }
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // save new address
  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!formData.address || !formData.phone) {
      alert("Please fill address & phone");
      return;
    }

    const newAddress = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      state: formData.state,
      district: formData.district,
      city: formData.city,
      pincode: formData.pincode,
    };

    setShippingAddresses((prev) => [...prev, newAddress]);
    setSelectedShipping(newAddress);
    setShowAddressForm(false);
    setFormData({
      name: "",
      phone: "",
      address: "",
      pincode: "",
      city: "",
      state: "",
      district: "",
      remarks: "",
    });
  };

  // calculations
  const getSubtotal = () =>
    cartItems
      .reduce(
        (acc, item) =>
          acc + (parseFloat(item.mrp ?? item.base_price) || 0) * item.qty,
        0
      )
      .toFixed(2);

  const getGSTTotal = () =>
    cartItems
      .reduce((acc, item) => {
        const price = parseFloat(item.mrp ?? item.base_price) || 0;
        const qty = item.qty || 0;
        const gstPercent = parseFloat(item.gst) || 0;
        return acc + (price * qty * gstPercent) / 100;
      }, 0)
      .toFixed(2);

  const getCessTotal = () =>
    cartItems
      .reduce((acc, item) => {
        const price = parseFloat(item.mrp ?? item.base_price) || 0;
        const qty = item.qty || 0;
        const cessPercent = parseFloat(item.cess_tax) || 0;
        return acc + (price * qty * cessPercent) / 100;
      }, 0)
      .toFixed(2);

  const getTotal = () =>
    (
      parseFloat(getSubtotal()) +
      parseFloat(getGSTTotal()) +
      parseFloat(getCessTotal())
    ).toFixed(2);

  // place order
  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("customer_token");

    if (!selectedBilling?.address) {
      alert("Please select a billing address.");
      return;
    }
    if (!selectedShipping?.address) {
      alert("Please select a shipping address.");
      return;
    }

    const payload = {
      customer_id: customerDetails.id,
      name: selectedShipping?.name || "",
      delivery_address: selectedShipping?.address || "",
      delivery_pincode: selectedShipping?.pincode || "",
      delivery_phone: selectedShipping?.phone || "",
      delivery_city: selectedShipping?.city || "",
      delivery_state: selectedShipping?.state || "",
      delivery_district: selectedShipping?.district || "",
      billing_address: selectedBilling?.address || "",
      billing_pincode: selectedBilling?.pincode || "",
      billing_phone: selectedBilling?.phone || "",
      remarks: formData?.remarks || "",
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
          text: "Please wait for your order estimate confirmation.",
          confirmButtonText: "View Order Estimate",
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
    <section
      className="checkout-section-2 section-b-space"
      style={{ backgroundColor: "#fff4e842" }}
    >
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
                        colors="primary:#437a3a,secondary:#437a3a"
                        className="lord-icon"
                      ></lord-icon>
                    </div>

                    <div className="checkout-box">
                      <div
                        className="checkout-title"
                        style={{
                          backgroundColor: "#437a3a",
                          padding: "15px 10px 15px",
                          borderTopLeftRadius: "5px",
                          borderTopRightRadius: "5px",
                        }}
                      >
                        <h4 className="text-white">Billing Address</h4>
                      </div>
                      <div
                        className="checkout-detail"
                        style={{ padding: "15px 10px 15px" }}
                      >
                        <div className="row g-4">
                          {customerDetails && (
                            <div className="col-12">
                              <div
                                className="delivery-address-box p-3"
                                style={{
                                  border: "1px solid #ddd",
                                  borderRadius: "8px",
                                  background: "#fff",
                                }}
                              >
                                <div className="d-flex align-items-center">
                                  {/* Radio Button */}
                                  <div className="me-3">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="billing_address"
                                      id="billing_address"
                                      checked={
                                        selectedBilling?.address ===
                                        customerDetails.customer_address
                                      }
                                      onChange={() =>
                                        setSelectedBilling({
                                          address:
                                            customerDetails.customer_address,
                                          pincode:
                                            customerDetails.customer_pincode,
                                          phone:
                                            customerDetails.customer_number,
                                        })
                                      }
                                      style={{
                                        backgroundColor: "#437a3a",
                                        borderColor: "#437a3a",
                                      }}
                                    />
                                  </div>

                                  {/* Card Content */}
                                  <div
                                    className="d-flex justify-content-between flex-grow-1"
                                    style={{ gap: "20px" }}
                                  >
                                    <div style={{ width: "10%" }}>
                                      <strong>Name</strong>
                                      <div style={{ fontSize: "12px" }}>
                                        {customerDetails.name}
                                      </div>
                                    </div>
                                    <div style={{ width: "40%" }}>
                                      <strong>Address</strong>
                                      <div style={{ fontSize: "12px" }}>
                                        {customerDetails.customer_address}
                                      </div>
                                    </div>
                                    <div style={{ width: "15%" }}>
                                      <strong>Pin Code</strong>
                                      <div style={{ fontSize: "12px" }}>
                                        {customerDetails.customer_pincode}
                                      </div>
                                    </div>
                                    <div style={{ width: "25%" }}>
                                      <strong>Email</strong>
                                      <div style={{ fontSize: "12px" }}>
                                        {customerDetails.customer_email}
                                      </div>
                                    </div>
                                    <div style={{ width: "20%" }}>
                                      <strong>Phone</strong>
                                      <div style={{ fontSize: "12px" }}>
                                        +91-{customerDetails.customer_number}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="ml-3" style={{ marginLeft: "70px" }}>
                      <div className="mt-3" role="alert">
                        <strong>Note:</strong> We are currently deliver to
                        Himachal Pradesh, Punjab, Haryana, and Chandigarh only.
                      </div>
                    </div>
                  </li>

                  <li>
                    <div className="checkout-icon">
                      <lord-icon
                        src="https://cdn.lordicon.com/ggihhudh.json"
                        trigger="loop-on-hover"
                        colors="primary:#437a3a,secondary:#437a3a"
                        className="lord-icon"
                      ></lord-icon>
                    </div>
                    <div className="checkout-box">
                      <div
                        className="checkout-title"
                        style={{
                          backgroundColor: "#437a3a",
                          padding: "5px 10px 5px",
                          borderTopLeftRadius: "5px",
                          borderTopRightRadius: "5px",
                        }}
                      >
                        <h4 className="text-white">Shipping Address </h4>
                        <button
                          className="btn theme-bg-color text-white fw-bold"
                          type="button"
                          onClick={() => setShowAddressForm(!showAddressForm)}
                        >
                          {showAddressForm ? "Cancel" : "Add Address"}
                        </button>
                      </div>
                      <div
                        className="checkout-detail"
                        style={{ padding: "15px 10px 15px" }}
                      >
                        <div className="row g-4">
                          {shippingAddresses.map((addr, i) => (
                            <div
                              className="col-xxl-12 col-lg-12 col-md-12"
                              key={i}
                            >
                              <div
                                className="delivery-address-box p-3"
                                style={{
                                  border: "1px solid #ddd",
                                  borderRadius: "8px",
                                  background: "#fff",
                                }}
                              >
                                <div className="d-flex align-items-center">
                                  {/* Radio */}
                                  <div className="me-3">
                                    <input
                                      type="radio"
                                      className="form-check-input"
                                      name="shipping_address"
                                      checked={
                                        selectedShipping?.address ===
                                        addr.address
                                      }
                                      onChange={() => setSelectedShipping(addr)}
                                      style={{
                                        backgroundColor: "#437a3a",
                                        borderColor: "#437a3a",
                                      }}
                                    />
                                  </div>

                                  {/* Card content */}
                                  <div
                                    className="d-flex justify-content-between flex-grow-1"
                                    style={{ gap: "20px" }}
                                  >
                                    <div style={{ width: "10%" }}>
                                      <strong>Name</strong>
                                      <div style={{ fontSize: "12px" }}>
                                        {addr.name}
                                      </div>
                                    </div>
                                    <div style={{ width: "35%" }}>
                                      <strong>Address</strong>
                                      <div style={{ fontSize: "12px" }}>
                                        {addr.address}
                                      </div>
                                    </div>
                                    <div style={{ width: "15%" }}>
                                      <strong>Pin Code</strong>
                                      <div style={{ fontSize: "12px" }}>
                                        {addr.pincode}
                                      </div>
                                    </div>
                                    <div style={{ width: "25%" }}>
                                      <strong>Email</strong>
                                      <div style={{ fontSize: "12px" }}>
                                        {addr.email}
                                      </div>
                                    </div>
                                    <div style={{ width: "20%" }}>
                                      <strong>Phone</strong>
                                      <div style={{ fontSize: "12px" }}>
                                        +91-{addr.phone}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        {showAddressForm && (
                          <form
                            onSubmit={handleSaveAddress}
                            className="row g-3 mt-3"
                          >
                            <div className="col-6">
                              <input
                                id="name"
                                className="form-control"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="col-6">
                              <input
                                id="phone"
                                className="form-control"
                                placeholder="Phone"
                                value={formData.phone}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="col-6">
                              <input
                                id="email"
                                className="form-control"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                              />
                            </div>

                            <div className="col-6">
                              <input
                                id="state"
                                className="form-control"
                                placeholder="State"
                                value={formData.state}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="col-6">
                              <input
                                id="district"
                                className="form-control"
                                placeholder="District"
                                value={formData.district}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="col-6">
                              <input
                                id="city"
                                className="form-control"
                                placeholder="City"
                                value={formData.city}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="col-6">
                              <input
                                id="pincode"
                                className="form-control"
                                placeholder="Pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="col-12">
                              <textarea
                                id="address"
                                className="form-control"
                                placeholder="Address"
                                value={formData.address}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="col-12">
                              <button
                                type="submit"
                                className="btn theme-bg-color text-white w-100 fw-bold"
                              >
                                Save Address
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    </div>
                  </li>

                  <li>
                    <div className="checkout-icon">
                      <lord-icon
                        src="https://cdn.lordicon.com/qmcsqnle.json"
                        trigger="loop-on-hover"
                        colors="primary:#437a3a,secondary:#437a3a"
                        className="lord-icon"
                      ></lord-icon>
                    </div>
                    <div className="checkout-box">
                      <div
                        className="checkout-title"
                        style={{
                          backgroundColor: "#437a3a",
                          padding: "15px 10px 15px",
                          borderTopLeftRadius: "5px",
                          borderTopRightRadius: "5px",
                        }}
                      >
                        <h4 className="text-white">Payment Wallet</h4>
                      </div>
                      <div
                        className="checkout-detail"
                        style={{ padding: "15px 10px 15px" }}
                      >
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
                <div
                  className="summery-header"
                  style={{
                    backgroundColor: "#437a3a",
                    padding: "15px 10px 15px",
                    borderTopLeftRadius: "5px",
                    borderTopRightRadius: "5px",
                    marginBottom:"0px",
                  }}
                >
                  <h3 className="text-white">Order Summary</h3>
                </div>
                <ul
                  className="summery-contain"
                  style={{ padding: 0, margin: 0, listStyle: "none" }}
                >
                  {cartItems.map((item, index) => (
                    <li
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "10px",
                        padding: "12px 10px",
                        backgroundColor: index % 2 === 0 ? "#fff" : "#f8f9fa",  
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <span style={{ marginRight: "10px" }}>{index + 1}</span>
                      <img
                        src={
                          item.image
                            ? `https://store.bulkbasketindia.com/product images/${item.image}`
                            : "/assets/images/shop7.png"
                        }
                        className="img-fluid checkout-image"
                        alt={item.name}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "contain",
                        }}
                      />
                      <h4
                        className="custom-tooltip"
                        style={{ flex: 1, margin: 0 }}
                      >
                        {item.name.length > 24
                          ? toTitleCase(item.name.substring(0, 24)) + "..."
                          : toTitleCase(item.name)}
                        <span className="tooltip-text">
                          {toTitleCase(item.name)}
                        </span>{" "}
                        <span>X {item.qty}</span>
                      </h4>
                      <h4 className="price" style={{ margin: 0 }}>
                        ₹{item.base_price}
                      </h4>
                    </li>
                  ))}
                </ul>

                <ul
                  className="summery-total"
                  style={{ padding: "15px 10px 15px" }}
                >
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
                  <li className="list-total mt-3">
                    <h4>Total (INR)</h4>
                    <h4 className="price">₹{getTotal()}</h4>
                  </li>
                </ul>
                <div
                  className="col-12 mt-3"
                  style={{ padding: "15px 10px 15px" }}
                >
                  <textarea
                    className="form-control"
                    id="remarks"
                    placeholder="Remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                  />
                </div>
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
