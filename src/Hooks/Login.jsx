import React, { useState,useRef } from "react";
import axios from "axios";
import { auth, sendOtp } from "./firebase";
import { LIVE_URL } from "../Api/Route";

export default function Login({ setIsLoggedIn, setRefreshNavbar }) {
  const [number, setNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("number");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false); // ✅ button disable state
const inputs = useRef([]);
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setLoading(true);

    try {
      const response = await axios.post(`${LIVE_URL}/send-otp`, { number });
      if (response.data.status) {
        await sendOtp("+91" + number);
        setStep("otp");
        setMessage({ type: "success", text: "OTP sent successfully ✅" });
      } else {
        setMessage({ type: "error", text: response.data.message });
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      setMessage({ type: "error", text: "Failed to send OTP ❌" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setLoading(true);

    try {
      const confirmationResult = window.confirmationResult;
      const result = await confirmationResult.confirm(otp);
      if (result.user) {
        const verifyRes = await axios.post(`${LIVE_URL}/verify-otp`, {
          number,
        });
        if (verifyRes.data.status && verifyRes.data.token) {
          localStorage.setItem("customer_token", verifyRes.data.token);
          localStorage.setItem("customer_name", verifyRes.data.user.name);
          setIsLoggedIn(true);
          setRefreshNavbar((prev) => prev + 1);

          const modalEl = document.getElementById("deal-box");
          const modalInstance = bootstrap.Modal.getInstance(modalEl);
          modalInstance.hide();
        } else {
          setMessage({ type: "error", text: "Verification failed ❌" });
        }
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setMessage({ type: "error", text: "Invalid OTP ❌" });
    } finally {
      setLoading(false);
    }
  };
 const handleChange = (e, index) => {
    const value = e.target.value;
    
    // Allow only one character
    if (value.length > 1) {
      e.target.value = value.charAt(value.length - 1);
    }

    // Move to next input if value entered
    if (value && index < inputs.current.length - 1) {
      inputs.current[index + 1].focus();
    }

    // Move back if deleted
    if (!value && index > 0) {
      inputs.current[index - 1].focus();
    }
  };
  return (
    <div
      className="modal fade theme-modal deal-modal"
      id="deal-box"
      tabIndex={-1}
    >
      <div className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
        <div className="modal-content">
          <div className="modal-header padingLeft">
            {/* <h5 className="modal-title w-100">Login with OTP</h5> */}
             <img
                src="/assets/images/login-logo.png"
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
            <div className="deal-offer-box">
             <h3 className="modal-title w-100" id="deal_today text-left">

              Login Or Sign Up    
            </h3>
              {/* <img
                src="/assets/images/phone.png"
                alt="Phone Icon"
                className="img-fluid"
                style={{ height: "90px" }}
              /> */}
              <div className="input-box mt-2">
                <form
                  onSubmit={step === "number" ? handleSendOtp : handleVerifyOtp}
                >
                  
                  <h5 className="mb-4">
                    {step === "number" ? "Enter your mobile number" : "Verify OTP"}
                  </h5>
               <div className="col-12">
                  <div className="form-floating theme-form-floating log-in-form mb-3">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Phone"
                      required
                      value={number}
                      onChange={(e) => {
                        const input = e.target.value;
                        if (input.length <= 10) setNumber(input);
                      }}
                      // disabled={step !== "otp"}
                    />
                    {/* <label htmlFor="phone">Phone</label> */}
                  </div>
                  </div>  
                  {/* {step !== "otp" && (
                    <div className="form-floating theme-form-floating log-in-form mb-3">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="OTP"
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                      <label htmlFor="otp">OTP</label>
                    </div>
                  )} */}

                  

                  <div id="recaptcha-container" ></div>
                  <div>
                    {/*<p className="mt-2 text-content">
                      Don't have an account?{" "}
                      <a href="/sign-up">
                        <span style={{ color: "#d34b0b" }}>
                          Please Sign up!
                        </span>
                      </a>
                    </p>*/}
                    
                  </div>
                  <button
                   className="btn btn-animation w-100 justify-content-center login"
                    type="submit"
                  >
                    {loading
                      ? step === "number"
                        ? "GET OTP"
                        : "Verifying..."
                      : step === "otp"
                      ? "SEND OTP"
                      : "Verify OTP"}
                  </button>
                </form>
                  <div>
                    
                     <p class="mt-1 text-center forgot-txt" style={{padding:'15px;',
                      borderBottomWidth: '0.5px solid;', borderColor:'#ececec'}}>
                      Forgot Password?{" "}
                      <a href="/sign-up">
                       
                      </a>
                    </p>
                    <p class="mt-1 text-content">
                      New Customer?{" "}
                      <a href="/sign-up">
                        <span  className="account" style={{ color: "#007F2F !important;" }}>
                          Create an account
                        </span>
                      </a>
                    </p>
                   {step == "otp"&& <p>
                      <span className="pt-3">We've sent a 6-digit OTP to your mobile number.</span>
                     </p>}
                     <div className="position-relative">
                     {step == "otp"&& <>
                 <div className="cardd">
           
                      <div id="otp" className="inputs d-flex flex-row r mt-2 col-11">
                        {[...Array(5)].map((_, i) => (
                            <input key={i} className="m-2 text-center form-control rounded" 
                            type="text" maxlength="1"
                              ref={(el) => (inputs.current[i] = el)}
                          onChange={(e) => handleChange(e, i)} />

                        ))}
                    </div>
                  <div>
                    <div className="col-12 phone-number-email-view" style={{ flexDirection:  "row",display:'flex' }}>
                    <div  className="col-6" style={{ flexDirection:  "row" }}>
                     <span class="contact-number"><h5>Resend in 30 s</h5>
                      </span>
                    </div>
                    <div className="col-6"  style={{ textAlign: 'right',alignSelf:'flex-end'}}>
                     <a href="/#">
                        <h4  className="account" style={{ color: "#007F2F !important;" }}>
                         Resend OTP
                        </h4>
                      </a>
                    </div>
                  </div>
                    <p class="mt-1 text-content pt-4">
                      Already have an account?{" "}
                      <a href="/#">
                        <span  className="account" style={{ color: "#007F2F !important;" }}>
                         Log in
                        </span>
                      </a>
                    </p>
                  </div>
                  </div>
                   </>}

                  </div>
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
