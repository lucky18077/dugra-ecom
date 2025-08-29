import React, { useState } from "react";
import axios from "axios";
import { sendOtp } from "./firebase";
import { LIVE_URL } from "../Api/Route";
import Swal from "sweetalert2";

export default function Login({ setIsLoggedIn, setRefreshNavbar }) {
  const [number, setNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("number");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setLoading(true);
    
    setStep("otp");

    try {
      const response = await axios.post(`${LIVE_URL}/send-otp`, { number });

      if (response.data.status) {
        await sendOtp("+91" + number);
        setStep("otp");
      }
      setMessage({
        type: response.data.status ? "success" : "error",
        text: response.data.message,
      });
    } catch (error) {
      console.error("Send OTP error:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message,
      });
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
        const { status, message, token, user, redirect } = verifyRes.data;

        setMessage({ type: status ? "success" : "error", text: message });

        if (status && token) {
          localStorage.setItem("customer_token", token);
          localStorage.setItem("customer_name", user.name);
          localStorage.setItem("customer_number", number);
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
              src="/assets/images/login-logo.png"
              alt="Login Logo"
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
                Login
              </h3>
              <div className="input-box mt-2">
                <form
                  onSubmit={step === "number" ? handleSendOtp : handleVerifyOtp}
                >
                  <h5 className="mb-4">
                    {step === "number"
                      ? "Enter your mobile number"
                      : "Verify OTP"}
                  </h5>

                  {/* ✅ Alert messages */}
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
                          {message.type === "success" ? (
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              height="20"
                              width="20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 
                                16zm3.707-9.293a1 1 0 00-1.414-1.414L9 
                                10.586 7.707 9.293a1 1 0 
                                00-1.414 1.414l2 2a1 1 0 001.414 
                                0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              height="20"
                              width="20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 
                                16zM8.707 7.293a1 1 0 
                                00-1.414 1.414L8.586 10l-1.293 
                                1.293a1 1 0 101.414 1.414L10 
                                11.414l1.293 1.293a1 1 0 
                                001.414-1.414L11.414 10l1.293-1.293a1 
                                1 0 00-1.414-1.414L10 8.586 
                                8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </span>
                        <div>{message.text}</div>
                      </div>
                    </div>
                  )}

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
                        disabled={step === "otp"}
                      />
                    </div>
                  </div>

                  {step === "otp" && (
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
                      ? step === "number"
                        ? "Sending..."
                        : "Verifying..."
                      : step === "number"
                      ? "GET OTP"
                      : "Verify OTP"}
                  </button>
                </form>

                <div>
                  <p
                    className="mt-1 text-center forgot-txt"
                    style={{
                      padding: "15px",
                      borderBottom: "0.5px solid #ececec",
                    }}
                  ></p>
                </div>

                <div
                  className="col-12 phone-number-email-view d-flex"
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
