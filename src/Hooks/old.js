import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { LIVE_URL } from "../Api/Route";

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

  return (
    <div
      className="modal fade theme-modal deal-modal"
      id="deal-box"
      tabIndex={-1}
    >
      <div className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title w-100" id="deal_today">
              Login
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="deal-close-btn"
            >
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

              <div className="input-box mt-3">
                <form className="row g-4" onSubmit={handleLogin}>
                  <h3>Enter Mobile Number</h3>

                  <div className="col-12">
                    <div className="form-floating theme-form-floating log-in-form">
                      <input
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
                      />
                      <label htmlFor="phone">Phone</label>
                    </div>
                  </div>

                  <div className="col-12">
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
                  </div>
                  <div>
                    <p class="mt-1 text-content">
                      Don't have an account?{" "}
                      <a href="/sign-up">
                        <span style={{ color: "#d34b0b !important;" }}>
                          Please Sign up!
                        </span>
                      </a>
                    </p>
                  </div>
                  <div className="col-12">
                    <button
                      className="btn btn-animation w-100 justify-content-center"
                      type="submit"
                    >
                      Log In
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}