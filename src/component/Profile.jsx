import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toTitleCase } from "../Hooks/Helper";
import { LIVE_URL } from "../Api/Route";

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
    wallet_statement = [],
    order_mst = [],
  } = profile || {};

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
    <section
      className="user-dashboard-section "
       
    >
      <div className="container-fluid-lg">
        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-3">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden sticky-top" style={{ top: "100px", zIndex: 1 }}>
              <div
                className="card-header   text-white"
                style={{ backgroundColor: "#437a3a" }}
              >
                <h4 className="mb-0">My Info</h4>
              </div>
              <div className="card-body">
                <div className="mb-4">
                  <h5 className="mb-1">
                    {toTitleCase(customer_details?.name)}
                  </h5>
                  <h6 className="mb-1 ">
                    +91-{customer_details?.number}
                  </h6>
                  <h5 className="mb-0 ">{customer_details?.email}</h5>
                  <h5 className="mt-2">
                    {customer_details?.address}
                  </h5>
                </div>
                <h4 className="fw-bold mb-3" style={{ color: "#437a3a" }}>
                  Company Info
                </h4>
                <div>
                  <h5 className="mb-1">{toTitleCase(company?.name)}</h5>
                  <h5 className="mb-1">+91-{company?.number}</h5>
                  <h5 className="mb-1">{company?.email}</h5>
                  <h5 className="mt-2">
                    {company?.address}
                  </h5>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-9">
            <div className="card mb-4">
              <div
                className="d-flex justify-content-between align-items-center mb-4"
                style={{ backgroundColor: "#437a3a " }}
              >
                <div className="profile-padding">
                  <h3 className="text-white">My Dashboard</h3>
                </div>
                <div className="profile-padding">
                  <button
                    onClick={handleLogout}
                    className="btn btn btn-animation btn-sm"
                  >
                    <h4>Logout</h4>
                  </button>
                </div>
              </div>

              {/* Order Stats */}
              <div className="row g-3 mb-5">
                {[
                  {
                    title: "Total Orders",
                    value: order_count?.total_order || 0,
                  },
                  {
                    title: "Pending Orders",
                    value: order_count?.pending_order || 0,
                  },
                  {
                    title: "Processing",
                    value: order_count?.processing_order || 0,
                  },
                  {
                    title: "Delivered",
                    value: order_count?.delivered_order || 0,
                  },
                  {
                    title: "Credit Amount",
                    value: `₹ ${company?.wallet || 0}`,
                  },
                  {
                    title: "Wallet Used",
                    value: `₹ ${company?.used_wallet || 0}`,
                  },
                  {
                    title: "Active Amount",
                    value: `₹ ${(
                      (Number(company?.wallet) || 0) -
                      (Number(company?.used_wallet) || 0)
                    ).toFixed(2)}`,
                  },
                  {
                    title: "Hold Amount",
                    value: `₹ ${company?.hold_amount || 0}`,
                  },
                ].map((item, idx) => (
                  <div className="col-md-3 col-6 p-3" key={idx}>
                    <div
                      className="card border-0 shadow-sm rounded-4 text-center h-100"
                      style={{
                        background: "linear-gradient(135deg, #4CAF50, #2e5d2b)",
                        color: "#fff",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-5px)";
                        e.currentTarget.style.boxShadow =
                          "0 6px 20px rgba(0,0,0,0.15)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 .125rem .25rem rgba(0,0,0,.075)";
                      }}
                    >
                      <div className="card-body py-4">
                        <div className="mb-2">
                          <i className={`bi ${item.icon} fs-2`}></i>
                        </div>
                        <h6 className="mb-1">{item.title}</h6>
                        <h4 className="fw-bold">{item.value}</h4>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order History */}
            <div className="card border-0 shadow-sm rounded-3 mb-4">
              <div
                className="card-header   text-white d-flex justify-content-between align-items-center"
                style={{ backgroundColor: "#437a3a" }}
              >
                <h4 className="fw-bold mb-0">Recent Orders History</h4>
                <Link to="/order-list">
                  <button className="btn text-white btn-sm">View All</button>
                </Link>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover table-striped align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Order No</th>
                        <th>Date</th>
                        <th>Order Amount</th>
                        <th>Invoice No</th>
                        <th>Status</th>
                        <th>Payment</th>
                        {/* <th>Action</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders && filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                          <tr key={order.id}>
                            <td>#{order.id}</td>
                            <td>
                              {new Date(order.created_at).toLocaleDateString(
                                "en-GB"
                              )}
                            </td>
                            <td>₹{order.total_amount}</td>
                            <td>
                              {order.is_invoice === 1 ? order.invoice_no : "-"}
                            </td>
                            <td>
                              <span className="badge bg-success-subtle text-success">
                                {toTitleCase(order.status)}
                              </span>
                            </td>
                            <td>{toTitleCase(order.payment_status)}</td>
                            {/* <td>
                              <Link
                                to={`/invoice/${order.id}`}
                                className="btn btn-sm btn-outline-success me-2"
                              >
                                Estimate
                              </Link>
                              <Link
                                to={`/invoice-bill/${order.id}`}
                                className="btn btn-sm btn-success"
                              >
                                Bill
                              </Link>
                            </td> */}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="7"
                            className="text-center py-4 text-muted"
                          >
                            No Orders Found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Wallet History */}
            <div className="card border-0 shadow-sm rounded-3">
              <div
                className="card-header   text-white d-flex justify-content-between align-items-center"
                style={{ backgroundColor: "#437a3a" }}
              >
                <h4 className="fw-bold mb-0">My Wallet History</h4>
                <Link to="/wallet-ledger">
                  <button className="btn text-white btn-sm">View All</button>
                </Link>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover table-striped align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Order No</th>
                        <th>Date</th>
                        <th>Order Amount</th>
                        <th>Invoice No</th>
                        <th>Particular</th>
                        {/* <th className="text-success">Credit</th>
                        <th className="text-danger">Debit</th> */}
                        <th>Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {wallet_statement.length > 0 ? (
                        wallet_statement.map((wallet) => (
                          <tr key={wallet.id}>
                            <td>
                              {wallet.type === "debit" ? `#${wallet.id}` : "-"}
                            </td>
                            <td>
                              {new Date(wallet.created_at).toLocaleDateString(
                                "en-GB"
                              )}
                            </td>
                            <td>
                              {wallet.type === "debit"
                                ? Number(wallet.amount).toFixed(2)
                                : "-"}
                            </td>
                            <td>
                              {wallet.wallet_no || wallet.invoice_no || "-"}
                            </td>
                            <td style={{ minWidth: "180px" }}>
                              {wallet.particular} ({wallet.pay_mode})
                            </td>
                            {/* <td className="text-success fw-bold">
                              {wallet.type === "credit"
                                ? Number(wallet.amount).toFixed(2)
                                : "-"}
                            </td>
                            <td className="text-danger fw-bold">
                              {wallet.type === "debit"
                                ? Number(wallet.amount).toFixed(2)
                                : "-"}
                            </td> */}
                            <td>{Number(wallet.balance).toFixed(2)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="9" className="text-center">
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
    </section>
  );
}
