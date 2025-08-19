import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import feather from "feather-icons";
import axios from "axios";
import { LIVE_URL } from "../Api/Route";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("customer_token");

  useEffect(() => {
    axios
      .get(`${LIVE_URL}/customer-detail`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data.status);
        if (res.data.status) {
          setProfile(res.data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (!profile)
    return <p style={{ textAlign: "center" }}>Profile not found.</p>;

  const {
    company,
    customer_details,
    order_count,
    monthlyOrders,
    wallet_statement,
    order_mst,
  } = profile;
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const chartData = monthlyOrders.map((count, index) => ({
    month: monthNames[index],
    orders: count,
  }));

  return (
    <>
      {/* User Dashboard Section Start */}
      <section className="user-dashboard-section section-b-space">
        <div className="container-fluid-lg">
          <div className="row">
            <div className="col-xxl-3 col-lg-4">
              <div className="dashboard-left-sidebar">
                <div className="close-button d-flex d-lg-none">
                  <button className="close-sidebar">
                    <i className="fa-solid fa-xmark" />
                  </button>
                </div>
                <div className="profile-box">
                  <div className="cover-image">
                    <img
                      src="assets/images/cover-img.jpg"
                      className="img-fluid blur-up lazyload"
                      alt=""
                    />
                  </div>
                  <div className="profile-contain">
                    <div className="profile-image">
                      <div className="position-relative">
                        <img
                          src="assets/images/user.jpg"
                          className="blur-up lazyload update_img"
                          alt=""
                        />
                      </div>
                    </div>
                    <div className="profile-name">
                      <h3>{customer_details?.name}</h3>
                      <h6 className="text-content">
                        +91-{customer_details?.number}
                      </h6>
                      <h6 className="text-content">
                        {customer_details?.email}
                      </h6>
                    </div>
                  </div>
                </div>
                <ul
                  className="nav nav-pills user-nav-pills"
                  id="pills-tab"
                  role="tablist"
                >
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active"
                      id="pills-dashboard-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-dashboard"
                      type="button"
                    >
                      <i data-feather="home" />
                      DashBoard
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="pills-order-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-order"
                      type="button"
                    >
                      <i data-feather="shopping-bag" />
                      Order
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="pills-profile-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-profile"
                      type="button"
                      role="tab"
                    >
                      <i data-feather="user" />
                      Profile
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="pills-download-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-download"
                      type="button"
                      role="tab"
                    >
                      <i data-feather="download" />
                      Wallet Ledger
                    </button>
                  </li>
                  {/* <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="pills-security-tab"
                      type="button"
                      role="tab"
                    >
                      <i data-feather="shield" />
                      Logout
                    </button>
                  </li> */}
                </ul>
              </div>
            </div>
            <div className="col-xxl-9 col-lg-8">
              <button className="btn left-dashboard-show btn-animation btn-md fw-bold d-block mb-4 d-lg-none">
                Show Menu
              </button>
              <div className="dashboard-right-sidebar">
                <div className="tab-content" id="pills-tabContent">
                  <div
                    className="tab-pane fade show active"
                    id="pills-dashboard"
                    role="tabpanel"
                  >
                    <div className="dashboard-home">
                      <div className="title">
                        <h2>My Dashboard</h2>
                      </div>
                      <div className="total-box">
                        <div className="row g-sm-4 g-3">
                          <div className="col-xxl-4 col-lg-6 col-md-4 col-sm-6">
                            <div className="total-contain">
                              <img
                                src="assets/images/order.svg"
                                className="img-1 blur-up lazyload"
                                alt=""
                              />
                              <img
                                src="assets/images/order.svg"
                                className="blur-up lazyload"
                                alt=""
                              />
                              <div className="total-detail">
                                <h5>Total Order</h5>
                                <h3>{order_count?.total_order}</h3>
                              </div>
                            </div>
                          </div>
                          <div className="col-xxl-4 col-lg-6 col-md-4 col-sm-6">
                            <div className="total-contain">
                              <img
                                src="assets/images/pending.svg"
                                className="img-1 blur-up lazyload"
                                alt=""
                              />
                              <img
                                src="assets/images/pending.svg"
                                className="blur-up lazyload"
                                alt=""
                              />
                              <div className="total-detail">
                                <h5>Total Pending Order</h5>
                                <h3>{order_count?.pending_order}</h3>
                              </div>
                            </div>
                          </div>
                          <div className="col-xxl-4 col-lg-6 col-md-4 col-sm-6">
                            <div className="total-contain">
                              <img
                                src="assets/images/wishlist.svg"
                                className="img-1 blur-up lazyload"
                                alt=""
                              />
                              <img
                                src="assets/images/wishlist.svg"
                                className="blur-up lazyload"
                                alt=""
                              />
                              <div className="total-detail">
                                <h5>Complete</h5>
                                <h3>{order_count?.complete_order}</h3>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="dashboard-title">
                        <h3>Month Wise Order Report (2025)</h3>
                      </div>

                      <div style={{ width: "100%", height: 300 }}>
                        <ResponsiveContainer>
                          <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="orders" fill="#d34b0b" barSize={40} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="pills-order"
                    role="tabpanel"
                  >
                    <div className="dashboard-order">
                      <div className="title">
                        <h2>My Orders History</h2>
                        <span className="title-leaf title-leaf-gray">
                          <svg className="icon-width bg-gray">
                            <use xlinkHref="assets/leaf.svg#leaf" />
                          </svg>
                        </span>
                      </div>
                      <div className="order-contain">
                        <div className="row">
                          {order_mst && order_mst.length > 0 ? (
                            order_mst.map((order) => (
                              <div className="col-6 mb-3">
                                <div
                                  className="order-box dashboard-bg-box"
                                  key={order.id}
                                >
                                  <div className="order-container">
                                    <div className="order-icon">
                                      <i data-feather="box" />
                                    </div>
                                    <div className="order-detail">
                                      <h4>
                                        #{order.id}{" "}
                                        <span>{order.status}</span>
                                        {/* <Link to={`/invoice/${order.id}`}>
                                          {" "}
                                          <span
                                            style={{ background: "#1da2aa" }}
                                          >
                                             Order
                                          </span>
                                        </Link> */}
                                        <Link to={`/invoice/${order.id}`}>
                                          {" "}
                                          <span
                                            style={{ background: "#0213ffff" }}
                                          >
                                             Bill
                                          </span>
                                        </Link>
                                      </h4>
                                      <h6 className="text-content mb-1">
                                        Order Date:{" "}
                                        {new Date(
                                          order.created_at
                                        ).toLocaleDateString("en-GB")}
                                      </h6>
                                      <p className="text-content">
                                        Pay Mode: {order.pay_mode} || Total: ₹
                                        {order.total_amount}
                                      </p>
                                    </div>
                                    <table className="table">
                                      <tbody>
                                        <tr>
                                          <td colSpan={2}>
                                            {customer_details?.name}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>Address :</td>
                                          <td>
                                            <p>{customer_details?.address}</p>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>Phone :</td>
                                          <td>
                                            +91 {customer_details?.number}
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p>No orders found.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="pills-profile"
                    role="tabpanel"
                  >
                    <div className="dashboard-profile">
                      <div className="title">
                        <h2>My Profile</h2>
                        <span className="title-leaf">
                          <svg className="icon-width bg-gray">
                            <use xlinkHref="assets/leaf.svg#leaf" />
                          </svg>
                        </span>
                      </div>
                      <div className="profile-about dashboard-bg-box">
                        <div className="row">
                          <div className="col-xxl-7">
                            <div className="dashboard-title mb-3">
                              <h3>Customer Info</h3>
                            </div>
                            <div className="table-responsive">
                              <table className="table">
                                <tbody>
                                  <tr>
                                    <td>Name :</td>
                                    <td>{customer_details?.name}</td>
                                  </tr>
                                  <tr>
                                    <td>Email :</td>
                                    <td>{customer_details?.email}</td>
                                  </tr>
                                  <tr>
                                    <td>Phone Number :</td>
                                    <td>
                                      <a href="#">
                                        {" "}
                                        +91-{customer_details?.number}
                                      </a>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Address :</td>
                                    <td>{customer_details?.address}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div className="col-xxl-7">
                            <div className="dashboard-title mb-3">
                              <h3>Company Info</h3>
                            </div>
                            <div className="table-responsive">
                              <table className="table">
                                <tbody>
                                  <tr>
                                    <td>Company Name :</td>
                                    <td>{company?.name}</td>
                                  </tr>
                                  <tr>
                                    <td>Phone Number :</td>
                                    <td>
                                      <a href="#">+91-{company?.number}</a>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Address :</td>
                                    <td>{company?.address}</td>
                                  </tr>
                                  <tr>
                                    <td>Customer Type :</td>
                                    <td>{company?.customer_type}</td>
                                  </tr>
                                  {/* <tr>
                                    <td>Wallet :</td>
                                    <td>
                                      ₹{Number(company?.wallet).toFixed(2)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Used Wallet :</td>
                                    <td>
                                      ₹{Number(company?.used_wallet).toFixed(2)}
                                    </td>
                                  </tr> */}
                                  <tr>
                                    <td>Active Wallet Balance :</td>
                                    <td
                                      style={{
                                        fontWeight: "bold",
                                        color: "#28a745",
                                      }}
                                    >
                                      ₹
                                      {(
                                        Number(company?.wallet) -
                                        Number(company?.used_wallet)
                                      ).toFixed(2)}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div className="col-xxl-5">
                            <div className="profile-image">
                              <img
                                src="assets/images/dashboard-profile.png"
                                className="img-fluid blur-up lazyload"
                                alt=""
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="pills-download"
                    role="tabpanel"
                  >
                    <div className="dashboard-download">
                      <div className="title">
                        <h2>My Wallet Ledger</h2>
                        <span className="title-leaf">
                          <svg className="icon-width bg-gray">
                            <use xlinkHref="assets/leaf.svg#leaf" />
                          </svg>
                        </span>
                      </div>
                      <div className="download-detail dashboard-bg-box">
                        <div className="tab-content" id="pills-tabContent">
                          <div
                            className="tab-pane fade show active"
                            id="pills-data"
                            role="tabpanel"
                          >
                            <div className="download-table">
                              <div className="table-responsive">
                                <table className="table table-bordered table-striped">
                                  <thead className="table-dark">
                                    <tr>
                                      <th>Date</th>
                                      <th>Order No</th>
                                      <th>Order Amount</th>
                                      <th>Invoice No.</th>
                                      <th>Particular</th>
                                      <th>Credit</th>
                                      <th>Debit</th>
                                      <th>Balance</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {wallet_statement &&
                                    wallet_statement.length > 0 ? (
                                      wallet_statement.map((wallet) => (
                                        <tr key={wallet.id}>
                                          {/* Date */}
                                          <td>
                                            {new Date(
                                              wallet.created_at
                                            ).toLocaleDateString("en-GB")}
                                          </td>

                                          {/* Order No (show only in debit) */}
                                          <td>
                                            {wallet.type === "debit"
                                              ? wallet.id
                                              : "-"}
                                          </td>

                                          {/* Order Amount (show only in debit) */}
                                          <td>
                                            {wallet.type === "debit"
                                              ? Number(wallet.amount).toFixed(2)
                                              : "-"}
                                          </td>

                                          {/* Invoice No (show only in debit) */}
                                          <td>
                                            {wallet.type === "debit"
                                              ? wallet.invoice_no
                                              : "-"}
                                          </td>

                                          {/* Particular (always show) */}
                                          <td style={{ width: "180px" }}>
                                            {wallet.particular} (
                                            {wallet.pay_mode})
                                          </td>

                                          {/* Credit Amount */}
                                          <td className="text-success fw-bold">
                                            {wallet.type === "credit"
                                              ? Number(wallet.amount).toFixed(2)
                                              : "-"}
                                          </td>

                                          {/* Debit column red */}
                                          <td className="text-danger fw-bold">
                                            {wallet.type === "debit"
                                              ? Number(wallet.amount).toFixed(2)
                                              : "-"}
                                          </td>
                                          {/* Balance */}
                                          <td>
                                            {Number(wallet.balance).toFixed(2)}
                                          </td>
                                        </tr>
                                      ))
                                    ) : (
                                      <tr>
                                        <td colSpan="8" className="text-center">
                                          No transactions found.
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="pills-security"
                    role="tabpanel"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* User Dashboard Section End */}
    </>
  );
}
