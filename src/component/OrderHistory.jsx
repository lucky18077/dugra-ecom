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
    <section className="user-dashboard-section section-b-space">
      <div className="container ">
        <div className="title">
          <h2>My Orders</h2>
          <span className="title-leaf">
            <svg className="icon-width bg-white">
              <use xlinkHref="assets/images/leaf.svg#leaf" />
            </svg>
          </span>
        </div>
        <div className="card shadow-lg rounded-3 border-0">
          <div
            className="card-header d-flex justify-content-between align-items-center  text-white"
            style={{ backgroundColor: "#437a3a" }}
          >
            <h4 className="mb-0">All Order List</h4>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover table-bordered align-middle">
                <thead className="table">
                  <tr>
                    <th>S.No</th>
                    <th>Order No</th>
                    <th>Date</th>
                    <th>Order Amount</th>
                    <th>Invoice No</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders && filteredOrders.length > 0 ? (
                    filteredOrders.map((order,index) => (
                      <tr key={order.id}>
                        <td>{index+1}</td>
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
                        <td>{toTitleCase(order.status)}</td>
                        <td>{toTitleCase(order.payment_status)}</td>
                        <td className="d-flex">
                          <Link
                            to={`/invoice/${order.id}`}
                            className="btn btn btn-animation btn-sm me-2"
                          >
                            Estimate
                          </Link>
                          <Link
                            to={`/invoice-bill/${order.id}`}
                            className="btn btn btn-animation btn-sm"
                          >
                            Bill
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-muted">
                        No Orders Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
