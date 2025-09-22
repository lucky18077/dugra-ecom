import React, { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";
import axios from "axios";
import { LIVE_URL } from "../Api/Route";
import Swal from "sweetalert2";

export default function Signup() {
  const [formData, setFormData] = useState({
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
    reciver_contact: "",
    district: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    // load states of India (ISO Code = "IN")
    const indiaStates = State.getStatesOfCountry("IN");
    setStates(indiaStates);
  }, []);

  const handleStateChange = (e) => {
    const stateCode = e.target.value;
    const stateObj = states.find((s) => s.isoCode === stateCode);

    setFormData((prev) => ({
      ...prev,  
      state: stateObj?.name || "",
      district: "",
      city: "",
    }));

    // load districts (in India, these are represented as "cities" with different filters)
    const distList = City.getCitiesOfState("IN", stateCode);
    setDistricts(distList);
    setCities([]); // reset cities until district is selected
  };

  const handleDistrictChange = (e) => {
    const districtCode = e.target.value;
    const districtObj = districts.find((d) => d.name === districtCode);

    setFormData((prev) => ({
      ...prev,
      district: districtObj?.name || "",
      city: "",
    }));

    // Many APIs don’t give a 2-level (district + city) hierarchy for India,
    // If your package doesn’t support district→city, you can directly treat "districts" as "cities".
    setCities([districtObj?.name]);
  };

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
        Swal.fire("Success 🎉", response.data.message, "success");
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong!", "error");
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
                <h3 style={{ color:"#477a37" }}>Welcome To Bulk Basket India</h3>
                <h4>Account Registration</h4>
              </div>
              <div className="input-box">
                <form className="row g-4" onSubmit={handleSubmit}>
                  {/* Business Type */}
                  <div className="col-6">
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
                      type="number"
                      id="company_number"
                      className="form-control"
                      placeholder="Company Mobile No."
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

                  {/* Pincode */}
                  <div className="col-6">
                    <input
                      type="text"
                      id="pincode"
                      className="form-control"
                      placeholder="PIN Code"
                      value={formData.pincode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label htmlFor="state">State</label>
                    <select
                      id="state"
                      className="form-control"
                      onChange={handleStateChange}
                      required
                    >
                      <option value="">-- Select State --</option>
                      {states.map((s) => (
                        <option key={s.isoCode} value={s.isoCode}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* District Dropdown */}
                  <div className="col-6">
                    <label htmlFor="district">District</label>
                    <select
                      id="district"
                      className="form-control"
                      onChange={handleDistrictChange}
                      required
                    >
                      <option value="">-- Select District --</option>
                      {districts.map((d) => (
                        <option key={d.name} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* City */}
                  <div className="col-6">
                    <input
                      type="text"
                      id="city"
                      className="form-control"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Reciver Contact */}
                  <div className="col-6">
                    <input
                      type="text"
                      id="reciver_contact"
                      className="form-control"
                      placeholder="Receiver Contact"
                      value={formData.reciver_contact}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Address */}
                  <div className="col-12">
                    <textarea
                      className="form-control"
                      id="address"
                      placeholder="Billing Address"
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
