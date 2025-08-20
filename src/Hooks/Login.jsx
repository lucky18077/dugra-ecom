import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { LIVE_URL } from "../Api/Route";
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { getCountryCallingCode } from "libphonenumber-js";
export default function Login({ setIsLoggedIn, setRefreshNavbar }) {
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${LIVE_URL}/customer-login`, {
        number: number,
        password: password,
      });

      const result = response.data;

      if (result.status && result.token) {
        localStorage.setItem("customer_token", result.token);
        setIsLoggedIn(true);
        setRefreshNavbar((prev) => prev + 1);

        const modalEl = document.getElementById("deal-box");
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        modalInstance.hide();
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Try again.");
    }
  };
const  CountryCodeSelect=({ value, onChange, options, ...rest }) =>{
  {console.log('optionoption',options)}
  return (
   <select {...rest} value={value || ""} onChange={(e) => onChange(e.target.value)} className="col-2 country-code form-control">
      {options.map((option) => {
        if (!option.value) {
          // Handle empty option
          return (
            <option key="default" value="">
              Select Code
            </option>
          );
        }
        let dialCode = "";
        try {
          dialCode = getCountryCallingCode(option.value);
        } catch {
          return null; // skip invalid
        }
        return (
          <option key={option.value} value={option.value}>
            +{dialCode}
          </option>
        );
      })}
    </select>
  );
}

  return (
    <div
      className="modal fade theme-modal deal-modal"
      id="deal-box"
      tabIndex={-1}
    >
      <div className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
        <div className="modal-content">
          <div className="modal-header">
            {/* <h5 className="modal-title w-100" id="deal_today">
              Login
            </h5> */}
             <img
                src="/assets/images/log-in-logo.png"
                alt="Phone Icon"
                className="img-fluid"
                style={{ height: "90px" }}
              />
            <button
              type="button"
              className="btn-close right-btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="deal-close-btn"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>

          <div className="modal-body">
             <h3 className="modal-title w-100" id="deal_today text-left">
              Login Or Sign Up
            </h3>
            <div className="deal-offer-box">
             
              {/* <img
                src="/assets/images/phone.png"
                alt="Phone Icon"
                className="img-fluid"
                style={{ height: "90px" }}
              /> */}
 
              <div className="input-box mt-3">
                <form className="row g-4" onSubmit={handleLogin}>
                  <h5>Enter your mobile number</h5>

                  <div className="col-12">
                    <div className="form-floating theme-form-floating log-in-form">
                       <PhoneInput
                       defaultCountry={"IN"}
                        placeholder="Phone"
                        value={number}
                        onChange={setNumber}
                        className="phone-number-ipute form-control "
                         countrySelectComponent={CountryCodeSelect}/>
                      {/* <input
                        type="number"
                        className="form-control"
                        placeholder="Phone"
                        required
                        value={number}
                        onChange={(e) => {
                          const input = e.target.value;
                          if (input.length <= 10) {
                            setNumber(input);
                          }
                        }}
                      /> */}
                      {/* <label htmlFor="phone">Phone</label> */}
                    </div>
                  </div>

                  {/* <div className="col-12">
                    <div className="form-floating theme-form-floating log-in-form">
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <label htmlFor="password">Password</label>
                    </div>
                  </div> */}
                  <div>
                    {/* <p class="mt-1 text-content">
                      Don't have an account?{" "}
                      <a href="/sign-up">
                        <span style={{ color: "#d34b0b !important;" }}>
                          Please Sign up!
                        </span>
                      </a>
                    </p> */}
                     {/* <p class="mt-1 text-center">
                      Forgot Password?{" "}
                      <a href="/sign-up">
                       
                      </a>
                    </p> */}
                    {/* <p class="mt-1 text-content">
                      New Customer?{" "}
                      <a href="/sign-up">
                        <span style={{ color: "#007F2F !important;" }}>
                          Create an account
                        </span>
                      </a>
                    </p> */}
                  </div>
                  <div className="col-12">
                    <button
                      className="btn btn-animation w-100 justify-content-center login"
                      type="submit"
                    >
                     Get OTP
                    </button>
                  </div>
                </form>
                 <div>
                    {/* <p class="mt-1 text-content">
                      Don't have an account?{" "}
                      <a href="/sign-up">
                        <span style={{ color: "#d34b0b !important;" }}>
                          Please Sign up!
                        </span>
                      </a>
                    </p> */}
                     <p class="mt-1 text-center forgot-txt" style={{padding:'15px;',
    borderBottomWidth: '0.5px solid;', borderColor:'#ececec'}}>
                      Forgot Password?{" "}
                      <a href="/sign-up">
                       
                      </a>
                    </p>
                    <p class="mt-1 text-content">
                      New Customer?{" "}
                      <a href="/sign-up">
                        <span style={{ color: "#007F2F !important;" }}>
                          Create an account
                        </span>
                      </a>
                    </p>
                  </div>
                <div className="col-12 phone-number-email-view" style={{ flexDirection:  "row",display:'flex' }}>
                  <div  className="col-6" style={{ flexDirection:  "row" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-phone" color="#007F2F">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg><span class="contact-number"><h5>+91 1234567890</h5>
                  </span>
                  </div>
                  <div className="col-6"  style={{ textAlign: 'right',alignSelf:'flex-end'}}>
                   <span class="contact-number" style={{ textAlign: 'right'}}><h5>durga@gmail.com</h5></span> 
                  </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
