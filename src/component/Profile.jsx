import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toTitleCase } from "../Hooks/Helper";
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
  const [orderSearch, setOrderSearch] = useState("");
  const token = localStorage.getItem("customer_token");

  useEffect(() => {
    if (!token) return;
    axios
      .get(`${LIVE_URL}/customer-detail`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.status) {
          setProfile(res.data.data);
        }
      })
      .catch(() => {});
  }, [token]);

  const {
    company = {},
    customer_details = {},
    order_count = {},
    monthlyOrders = [],
    wallet_statement = [],
    order_mst = [],
  } = profile || {};

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

  const handleLogout = async () => {
    const token = localStorage.getItem("customer_token");
    try {
      if (token) {
        await axios.post(
          `${LIVE_URL}/customer-logout`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch {
    } finally {
      localStorage.removeItem("customer_token");
      localStorage.removeItem("customer_name");
      delete axios.defaults.headers?.common?.Authorization;
      window.location.replace("/");
    }
  };

  // Filtered orders based on search
  const filteredOrders = order_mst.filter(
    (order) =>
      order.id.toString().includes(orderSearch) ||
      order.invoice_no?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.order_status?.toLowerCase().includes(orderSearch.toLowerCase())
  );
  return (
    <>
      {/* User Dashboard Section Start */}
      <section className="user-dashboard-section section-b-space">
        <div className="container-fluid-lg">
          <div className="row">
            <div className="col-xxl-3 col-lg-3">
              <div className="dashboard-left-sidebar">
                <div className="close-button d-flex d-lg-none">
                  <button className="close-sidebar">
                    <i className="fa-solid fa-xmark" />
                  </button>
                </div>
                <div className="profile-box">
                  <div className="profile-contain">
                    <div className="profile-name" style={{ textAlign: "left" }}>
                      <h3>{toTitleCase(customer_details?.name)}</h3>
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
                      id="pills-address-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-address"
                      type="button"
                      role="tab"
                    >
                      <i data-feather="user" />
                      Address
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
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="pills-security-tab"
                      type="button"
                      role="tab"
                      onClick={handleLogout}
                    >
                      <i data-feather="shield" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-xxl-9 col-lg-9">
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
                          <div className="col-xxl-3 col-lg-6 col-md-3 col-sm-6">
                            <div className="total-contain">
                              <div className="total-detail">
                                <h5 style={{ fontSize: "20px" }}>
                                  Total Order
                                </h5>
                                <h3>{order_count?.total_order || 0}</h3>
                              </div>
                            </div>
                          </div>
                          <div className="col-xxl-3 col-lg-6 col-md-3 col-sm-6">
                            <div className="total-contain">
                              <div className="total-detail">
                                <h5 style={{ fontSize: "20px" }}>
                                  Pending Order
                                </h5>
                                <h3>{order_count?.pending_order || 0}</h3>
                              </div>
                            </div>
                          </div>
                          <div className="col-xxl-3 col-lg-6 col-md-3 col-sm-6">
                            <div className="total-contain">
                              <div className="total-detail">
                                <h5 style={{ fontSize: "20px" }}>Complete</h5>
                                <h3>{order_count?.complete_order || 0}</h3>
                              </div>
                            </div>
                          </div>
                          <div className="col-xxl-3 col-lg-6 col-md-3 col-sm-6">
                            <div className="total-contain">
                              <div className="total-detail">
                                <h5 style={{ fontSize: "20px" }}>
                                  Active Amount
                                </h5>
                                <h3 style={{ color: "green" }}>
                                  ₹{" "}
                                  {(
                                    Number(company?.wallet) -
                                    Number(company?.used_wallet) || 0
                                  ).toFixed(2)}
                                </h3>
                              </div>
                            </div>
                          </div>
                          <div className="col-xxl-3 col-lg-6 col-md-3 col-sm-6">
                            <div className="total-contain">
                              <div className="total-detail">
                                <h5 style={{ fontSize: "20px" }}>
                                  Hold Amount
                                </h5>
                                <h3 style={{ color: "red" }}>
                                  ₹ {company?.hold_amount || 0}
                                </h3>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="dashboard-title">
                        <h3>Recent Orders</h3>
                      </div>
                      <div className="download-table">
                        <div className="table-responsive">
                          <table className="table table-bordered table-striped">
                            <thead className="table-dark">
                              <tr>
                                <th>Order No</th>
                                <th>Date</th>
                                <th>Order Amount</th>
                                <th>Invoice No.</th>
                                <th>Order Status</th>
                                <th>Payment</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order_mst && order_mst.length > 0 ? (
                                order_mst.map((order) => (
                                  <tr key={order.id}>
                                    <td>#{order.id}</td>
                                    <td>
                                      {new Date(
                                        order.created_at
                                      ).toLocaleDateString("en-GB")}
                                    </td>
                                    <td>₹{order.total_amount}</td>
                                    <td>
                                      {order.is_invoice === 1
                                        ? order.invoice_no
                                        : ""}
                                    </td>
                                    <td>{toTitleCase(order.status)}</td>
                                    <td>{toTitleCase(order.payment_status)}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="7" className="text-center">
                                    No Order found.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
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
                            <Bar dataKey="orders" fill="#437a3a" barSize={40} />
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
                      <div className="title d-flex justify-content-between align-items-center">
                        <h2>My Orders History</h2>
                        <input
                          type="text"
                          placeholder="Search Orders..."
                          value={orderSearch}
                          onChange={(e) => setOrderSearch(e.target.value)}
                          style={{
                            padding: "5px 10px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                            width: "250px",
                          }}
                        />
                      </div>
                      <div className="download-table mt-3">
                        <div className="table-responsive">
                          <table className="table table-bordered table-striped">
                            <thead className="table-dark">
                              <tr>
                                <th>Order No</th>
                                <th>Date</th>
                                <th>Order Amount</th>
                                <th>Invoice No.</th>
                                <th>Order Status</th>
                                <th>Payment</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredOrders && filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                  <tr key={order.id}>
                                    <td>#{order.id}</td>
                                    <td>
                                      {new Date(
                                        order.created_at
                                      ).toLocaleDateString("en-GB")}
                                    </td>
                                    <td>₹{order.total_amount}</td>
                                    <td>
                                      {order.is_invoice === 1
                                        ? order.invoice_no
                                        : ""}
                                    </td>
                                    <td>{toTitleCase(order.status)}</td>
                                    <td>{toTitleCase(order.payment_status)}</td>
                                    <td>
                                      <Link
                                        to={`/invoice/${order.id}`}
                                        className="btn btn-sm btn-primary"
                                      >
                                        Estimate View
                                      </Link>
                                      <Link
                                        to={`/invoice-bill/${order.id}`}
                                        className="btn btn-sm btn-primary"
                                      >
                                        Bill View
                                      </Link>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="7" className="text-center">
                                    No Order found.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="pills-address"
                    role="tabpanel"
                  >
                    <div className="dashboard-address">
                      <div className="title title-flex">
                        <div>
                          <h2>Shipping Address </h2>
                          <span className="title-leaf">
                            <svg className="icon-width bg-gray">
                              <use xlinkHref="/assets/images/leaf.svg#leaf" />
                            </svg>
                          </span>
                        </div>
                      </div>
                      <div className="row g-sm-4 g-3">
                        <div className="col-xxl-6 col-xl-6 col-lg-12 col-md-6">
                          <div className="address-box">
                            <div>
                              <div className="table-responsive address-table">
                                <table className="table">
                                  <tbody>
                                    <tr>
                                      <td colSpan={2}>Jack Jennas</td>
                                    </tr>
                                    <tr>
                                      <td>Address :</td>
                                      <td>
                                        <p>
                                          8424 James Lane South San Francisco,
                                          CA 94080
                                        </p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Pin Code :</td>
                                      <td>+380</td>
                                    </tr>
                                    <tr>
                                      <td>Phone :</td>
                                      <td>+ 812-710-3798</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <div className="button-group">
                              <button
                                className="btn btn-sm add-button w-100"
                                data-bs-toggle="modal"
                                data-bs-target="#removeProfile"
                              >
                                <i data-feather="trash-2" />
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="col-xxl-6 col-xl-6 col-lg-12 col-md-6">
                          <div className="address-box">
                            <div>
                              <div className="table-responsive address-table">
                                <table className="table">
                                  <tbody>
                                    <tr>
                                      <td colSpan={2}>Terry S. Sutton</td>
                                    </tr>
                                    <tr>
                                      <td>Address :</td>
                                      <td>
                                        <p>2280 Rose Avenue Kenner, LA 70062</p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Pin Code :</td>
                                      <td>+25</td>
                                    </tr>
                                    <tr>
                                      <td>Phone :</td>
                                      <td>+ 504-228-0969</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <div className="button-group">
                              <button
                                className="btn btn-sm add-button w-100"
                                data-bs-toggle="modal"
                                data-bs-target="#removeProfile"
                              >
                                <i data-feather="trash-2" />
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="col-xxl-6 col-xl-6 col-lg-12 col-md-6">
                          <div className="address-box">
                            <div>
                              <div className="table-responsive address-table">
                                <table className="table">
                                  <tbody>
                                    <tr>
                                      <td colSpan={2}>Juan M. McKeon</td>
                                    </tr>
                                    <tr>
                                      <td>Address :</td>
                                      <td>
                                        <p>
                                          1703 Carson Street Lexington, KY 40593
                                        </p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Pin Code :</td>
                                      <td>+78</td>
                                    </tr>
                                    <tr>
                                      <td>Phone :</td>
                                      <td>+ 859-257-0509</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <div className="button-group">
                              <button
                                className="btn btn-sm add-button w-100"
                                data-bs-toggle="modal"
                                data-bs-target="#removeProfile"
                              >
                                <i data-feather="trash-2" />
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="col-xxl-6 col-xl-6 col-lg-12 col-md-6">
                          <div className="address-box">
                            <div>
                              <div className="table-responsive address-table">
                                <table className="table">
                                  <tbody>
                                    <tr>
                                      <td colSpan={2}>Gary M. Bailey</td>
                                    </tr>
                                    <tr>
                                      <td>Address :</td>
                                      <td>
                                        <p>
                                          2135 Burning Memory Lane Philadelphia,
                                          PA 19135
                                        </p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Pin Code :</td>
                                      <td>+26</td>
                                    </tr>
                                    <tr>
                                      <td>Phone :</td>
                                      <td>+ 215-335-9916</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <div className="button-group">
                              <button
                                className="btn btn-sm add-button w-100"
                                data-bs-toggle="modal"
                                data-bs-target="#removeProfile"
                              >
                                <i data-feather="trash-2" />
                                Remove
                              </button>
                            </div>
                          </div>
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
