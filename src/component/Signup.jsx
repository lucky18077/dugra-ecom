import React, { useState } from "react";
import { LIVE_URL } from "../Api/Route";
import axios from "axios";

export default function Signup() {
  const [formData, setFormData] = useState({
    supplier_id: "",
    type: "",
    customer_type: "",
    company_name: "",
    company_number: "",
    company_email: "",
    company_gst: "",
    company_address: "",
    company_city: "",
    company_district: "",
    company_state: "",
    company_pincode: "",
    name: "",
    number: "",
    email: "",
    password: "",
    address: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(`${LIVE_URL}/customer-signup`, formData);
      if (response.data.status) {
        setMessage("Customer registered successfully!");
        setFormData({
          supplier_id: "",
          type: "",
          customer_type: "",
          company_name: "",
          company_number: "",
          company_email: "",
          company_gst: "",
          company_address: "",
          company_city: "",
          company_district: "",
          company_state: "",
          company_pincode: "",
          name: "",
          number: "",
          email: "",
          password: "",
          address: "",
          city: "",
          district: "",
          state: "",
          pincode: "",
        });
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message || "Error submitting form");
      } else {
        setMessage("Network error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="log-in-section section-b-space">
        <div className="container-fluid-lg w-100">
          <div className="row">
            <div className="col-xxl-4 col-xl-4 col-lg-4 d-lg-block d-none ms-auto">
              <div className="image-contain">
                <img
                  src="/assets/images/sign-up.png"
                  className="img-fluid"
                  alt=""
                />
              </div>
            </div>
            <div className="col-xxl-8 col-xl-8 col-lg-8 col-sm-8 mx-auto">
              <div className="log-in-box">
                <div className="log-in-title">
                  <h3>Welcome To DSP Super Store</h3>
                  <h4>Company Details</h4>
                </div>
                <div className="input-box">
                  <form className="row g-4" onSubmit={handleSubmit}>
                    {/* Example: Supplier select */}
                    <div className="col-6">
                      <label htmlFor="supplier_id">Supplier</label>
                      <select
                        id="supplier_id"
                        className="form-control select-h"
                        value={formData.supplier_id}
                        onChange={handleChange}
                        required
                      >
                        <option value="">-- Select Supplier --</option>
                        <option value={1}>DURGA PROVISION STORE</option>
                      </select>
                    </div>

                    <div className="col-6">
                      <label htmlFor="type">Business Type:</label>
                      <select
                        id="type"
                        className="form-control select-h"
                        value={formData.type}
                        onChange={handleChange}
                        required
                      >
                        <option value="">-- Select Business Type --</option>
                        <option value="Proprietorship">Proprietorship</option>
                        <option value="Partnership">Partnership</option>
                        <option value="LLP">LLP</option>
                        <option value="Pvt Ltd">Pvt Ltd</option>
                        <option value="Public Ltd">Public Ltd</option>
                        <option value="OPC">OPC</option>
                        <option value="Section 8">Section 8</option>
                        <option value="HUF">HUF</option>
                        <option value="Co-operative">Co-operative</option>
                      </select>
                    </div>

                    {/* Customer Type */}
                    <div className="col-6">
                      <select
                        id="customer_type"
                        className="form-control select-h"
                        value={formData.customer_type}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Customer Type</option>
                        <option value="restaurants">Restaurants</option>
                        <option value="hotels">Hotels</option>
                        <option value="caterers">Caterers</option>
                      </select>
                    </div>

                    {/* Company & Contact Inputs */}
                    <div className="col-6">
                      <input
                        type="text"
                        id="company_name"
                        className="form-control"
                        placeholder="Company Name"
                        value={formData.company_name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-6">
                      <input
                        type="text"
                        id="company_number"
                        className="form-control"
                        placeholder="Company Number"
                        value={formData.company_number}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-6">
                      <input
                        type="email"
                        id="company_email"
                        className="form-control"
                        placeholder="Company Email"
                        value={formData.company_email}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-6">
                      <input
                        type="text"
                        id="company_gst"
                        className="form-control"
                        placeholder="GST"
                        value={formData.company_gst}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Contact Person Details */}
                    <div className="col-6">
                      <input
                        type="text"
                        id="name"
                        className="form-control"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-6">
                      <input
                        type="text"
                        id="number"
                        className="form-control"
                        placeholder="Phone"
                        value={formData.number}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-6">
                      <input
                        type="email"
                        id="email"
                        className="form-control"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-6">
                      <input
                        type="password"
                        id="password"
                        className="form-control"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-4 text-center">
                      <button
                        type="submit"
                        className="btn btn-animation w-100"
                        disabled={loading}
                      >
                        {loading ? "Submitting..." : "Sign Up"}
                      </button>
                    </div>

                    {message && (
                      <div className="col-12 mt-3 text-center text-danger">
                        {message}
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
