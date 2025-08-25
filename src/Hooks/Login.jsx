import React, { useState } from "react";
import axios from "axios";
import { auth, sendOtp } from "./firebase";
import { LIVE_URL } from "../Api/Route";

export default function Login({ setIsLoggedIn, setRefreshNavbar }) {
  const [number, setNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("number");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false); // ✅ button disable state

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

  return (
    <div
      className="modal fade theme-modal deal-modal"
      id="deal-box"
      tabIndex={-1}
    >
      <div className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title w-100">Login with OTP</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal">
              <i className="fa-solid fa-xmark" />
            </button>
          </div>

          <div className="modal-body">
            <div className="deal-offer-box text-center">
              <img
                src="/assets/images/phone.png"
                alt="Phone Icon"
                className="img-fluid"
                style={{ height: "90px" }}
              />
              <div className="input-box mt-2">
                <form
                  onSubmit={step === "number" ? handleSendOtp : handleVerifyOtp}
                >
                  <h3 className="mb-4">
                    {step === "number" ? "Enter Mobile Number" : "Verify OTP"}
                  </h3>

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
                    <label htmlFor="phone">Phone</label>
                  </div>

                  {step === "otp" && (
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
                  )}

                  

                  <div id="recaptcha-container" ></div>
                  <div>
                    <p className="mt-2 text-content">
                      Don't have an account?{" "}
                      <a href="/sign-up">
                        <span style={{ color: "#d34b0b" }}>
                          Please Sign up!
                        </span>
                      </a>
                    </p>
                  </div>
                  <button
                    className="btn btn-animation w-100 mt-2"
                    type="submit"
                  >
                    {loading
                      ? step === "number"
                        ? "Sending..."
                        : "Verifying..."
                      : step === "number"
                      ? "Send OTP"
                      : "Verify OTP"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
