import React, { useState, useEffect } from "react";
import { LIVE_URL } from "../Api/Route";
import axios from "axios";
import Swal from "sweetalert2";

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
    email: "",
    password: "",
    number: "",
    address: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const savedNumber =
      sessionStorage.getItem("customer_number") ||
      localStorage.getItem("customer_number");
    if (savedNumber) {
      setFormData((prev) => ({ ...prev, number: savedNumber }));
    }
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        number: formData.number || localStorage.getItem("customer_number"),
      };

      const response = await axios.post(`${LIVE_URL}/customer-signup`, payload);

      if (response.data.status) {
        Swal.fire({
          icon: "success",
          title: "Success 🎉",
          text: response.data.message,
          confirmButtonText: "Okay",
        });

        setFormData((prev) => ({
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
          number: prev.number,
          email: "",
          password: "",
          address: "",
          city: "",
          district: "",
          state: "",
          pincode: "",
        }));
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const apiData = error.response.data;

        if (apiData.errors) {
          const allErrors = Object.values(apiData.errors).flat().join("\n");
          Swal.fire({
            icon: "error",
            title: "Validation Error",
            text: allErrors,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: apiData.message || "Something went wrong",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Network Error",
          text: "Please check your connection.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="log-in-section section-b-space">
      <div className="container-fluid-lg w-100">
        <div className="row">
          <div className="col-xxl-4 col-xl-4 col-lg-4 d-lg-block d-none ms-auto">
            <div className="image-contain">
              <img
                src="/assets/images/sign-up.png"
                className="img-fluid"
                alt="signup"
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
                  {/* Supplier */}
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

                  {/* Business Type */}
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

                  {/* Company Info */}
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

                  {/* Contact Person */}
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

                  {/* ✅ Removed Number field from form */}

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
                    />
                  </div>

                  {/* Address */}
                  <div className="col-12">
                    <textarea
                      className="form-control"
                      id="address"
                      placeholder="Delivery Address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    ></textarea>
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
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
