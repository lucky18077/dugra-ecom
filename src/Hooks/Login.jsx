import React, { useState } from "react";
import axios from "axios";
import { sendOtp } from "./firebase";
import { LIVE_URL } from "../Api/Route";

export default function Login({ setIsLoggedIn, setRefreshNavbar }) {
  const [number, setNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState("number");
  const [mode, setMode] = useState("otp");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const storeUserData = (token, user, number) => {
    if (token) {
      sessionStorage.setItem("customer_token", token);
      localStorage.setItem("customer_token", token);
    }
    if (user?.name) {
      sessionStorage.setItem("customer_name", user.name);
      localStorage.setItem("customer_name", user.name);
    }
    if (number) {
      sessionStorage.setItem("customer_number", number);
      localStorage.setItem("customer_number", number);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setStep("otp");
    setLoading(true);

    try {
      const response = await axios.post(`${LIVE_URL}/send-otp`, { number });

      if (response.data.status) {
        sessionStorage.setItem("customer_number", number);
        localStorage.setItem("customer_number", number); 
        sendOtp("+91" + number)
          .then(() => {
            console.log("Firebase OTP sent successfully");
          })
          .catch((err) => {
            console.error("Firebase OTP error:", err);
            setMessage({
              type: "error",
              text: "Failed to send OTP via Firebase",
            });
          });
      }

      setMessage({
        type: response.data.status ? "success" : "error",
        text: response.data.message,
      });
    } catch (error) {
      console.error("Send OTP error:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to send OTP",
      });
      setStep("number"); 
    } finally {
      setLoading(false);
    }
  };

  // 🔹 OTP Flow: Verify OTP
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
        const { status, message, token, user, redirect } = verifyRes.data;

        setMessage({ type: status ? "success" : "error", text: message });

        if (status && token) {
          storeUserData(token, user, number);
          setIsLoggedIn(true);
          setRefreshNavbar((prev) => prev + 1);
          window.location.href = "/";
        } else {
          if (redirect === "signup") {
            window.location.href = "/sign-up";
          } else if (redirect === "pending") {
            window.location.href = "/";
          } else if (redirect === "inactive") {
            window.location.href = "/";
          }
        }
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Password Login
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setLoading(true);

    try {
      const response = await axios.post(`${LIVE_URL}/customer-login`, {
        number,
        password,
      });

      const { status, message, token, user } = response.data;
      setMessage({ type: status ? "success" : "error", text: message });

      if (status && token) {
        storeUserData(token, user, number);
        setIsLoggedIn(true);
        setRefreshNavbar((prev) => prev + 1);
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Password login error:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Login failed",
      });
    } finally {
      setLoading(false);
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
            <img
              src="/assets/images/bulk-basket.png"
              alt="Login Logo"
              className="img-fluid"
              style={{ height: "60px" }}
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
                Login & Sign Up
              </h3>
              <div className="input-box mt-2">
                <form
                  onSubmit={
                    mode === "otp"
                      ? step === "number"
                        ? handleSendOtp
                        : handleVerifyOtp
                      : handlePasswordLogin
                  }
                >
                  <h5 className="mb-4">
                    {mode === "otp"
                      ? step === "number"
                        ? "Enter your mobile number"
                        : "Verify OTP"
                      : "Login with Phone & Password"}
                  </h5>

                  {message.text && (
                    <div
                      className={`alert ${
                        message.type === "success"
                          ? "alert-success"
                          : "alert-danger"
                      }`}
                    >
                      <div className="alert-content d-flex align-items-center">
                        <span className="alert-icon me-2">
                          {message.type === "success" ? "✔️" : "❌"}
                        </span>
                        <div>{message.text}</div>
                      </div>
                    </div>
                  )}

                  {/* 📱 Phone number */}
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
                        disabled={mode === "otp" && step === "otp"}
                      />
                      <label>Phone</label>
                    </div>
                  </div>

                  {/* 🔑 Password input (only if password mode) */}
                  {mode === "password" && (
                    <div className="col-12">
                      <div className="form-floating theme-form-floating log-in-form mb-3">
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <label>Password</label>
                      </div>
                    </div>
                  )}

                  {/* 🔢 OTP inputs (only if otp step) */}
                  {mode === "otp" && step === "otp" && (
                    <div className="otp-input-container d-flex mb-3">
                      {Array(6)
                        .fill("")
                        .map((_, i) => (
                          <input
                            key={i}
                            type="text"
                            className="form-control otp-input text-center mx-1"
                            maxLength={1}
                            value={otp[i] || ""}
                            onChange={(e) => {
                              let value = e.target.value.replace(/[^0-9]/g, "");
                              let newOtp = otp.split("");
                              newOtp[i] = value;
                              setOtp(newOtp.join(""));
                              if (value && i < 5) {
                                document.getElementById(`otp-${i + 1}`).focus();
                              }
                            }}
                            id={`otp-${i}`}
                          />
                        ))}
                    </div>
                  )}

                  <div id="recaptcha-container"></div>

                  <button
                    className="btn btn-animation w-100 justify-content-center login"
                    type="submit"
                  >
                    {loading
                      ? mode === "otp"
                        ? step === "number"
                          ? "Sending..."
                          : "Verifying..."
                        : "Logging in..."
                      : mode === "otp"
                      ? step === "number"
                        ? "GET OTP"
                        : "Verify OTP"
                      : "Login"}
                  </button>
                </form>

                {/* Toggle login mode */}
                <div className="text-center">
                  <p
                    className="mt-3 text-content"
                    style={{ color: "#d34b0b", cursor: "pointer" }}
                    onClick={() => {
                      setMode(mode === "otp" ? "password" : "otp");
                      setStep("number");
                    }}
                  >
                    {mode === "otp"
                      ? "Login With Password?"
                      : "Login With OTP?"}
                  </p>
                </div>

                {/* Footer contact info */}
                <div
                  className="col-12 phone-number-email-view d-flex mt-3"
                  style={{ flexDirection: "row" }}
                >
                  <div className="col-6 d-flex align-items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-phone"
                      color="#007F2F"
                    >
                      <path
                        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 
                      19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 
                      1-6-6 19.79 19.79 0 0 
                      1-3.07-8.67A2 2 0 0 1 4.11 
                      2h3a2 2 0 0 1 2 1.72 12.84 
                      12.84 0 0 0 .7 2.81 2 2 0 
                      1-.45 2.11L8.09 9.91a16 16 0 
                      0 0 6 6l1.27-1.27a2 2 0 0 
                      1 2.11-.45 12.84 12.84 0 0 
                      0 2.81.7A2 2 0 0 1 22 16.92z"
                      />
                    </svg>
                    <span className="contact-number ms-2">
                      <h5>+91 9876521909</h5>
                    </span>
                  </div>
                  <div className="col-6 text-end align-self-end">
                    <span className="contact-number">
                      <h5>info@bulkbasketindia.com</h5>
                    </span>
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
