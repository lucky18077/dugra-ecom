import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { LIVE_URL } from "../Api/Route";

export default function WalletLedger() {
  const [profile, setProfile] = useState(null);
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
        if (res.data.status) setProfile(res.data.data);
      })
      .catch(() => {});
  }, [token]);

  const { wallet_statement = [] } = profile || {};

  // ✅ Export to Excel
  const exportToExcel = () => {
    const data = wallet_statement.map((w, i) => ({
      "S.No": i + 1,
      Date: new Date(w.created_at).toLocaleDateString("en-GB"),
      "Order No": w.type === "debit" ? `#${w.id}` : "-",
      "Order Amount": w.type === "debit" ? Number(w.amount).toFixed(2) : "-",
      "Invoice No": w.type === "debit" ? w.invoice_no : "-",
      Particular: `${w.particular} (${w.pay_mode})`,
      Credit: w.type === "credit" ? Number(w.amount).toFixed(2) : "-",
      Debit: w.type === "debit" ? Number(w.amount).toFixed(2) : "-",
      Balance: Number(w.balance).toFixed(2),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Wallet Ledger");
    XLSX.writeFile(workbook, "wallet_ledger.xlsx");
  };

  return (
    <section className="user-dashboard-section section-b-space">
      <div className="container ">
        <div className="title">
          <h2>My Wallet Ledger</h2>
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
            <h4 className="mb-0">All Transaction List</h4>
            <button
              className="btn btn-sm d-flex align-items-center gap-2 shadow-sm rounded-pill px-3"
              style={{ backgroundColor: "#fff" }}
              onClick={exportToExcel}
            >
              <i className="bi bi-download"></i> Export to Excel
            </button>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover table-bordered align-middle">
                <thead className="table">
                  <tr>
                    <th>S.No</th>
                    <th>Date</th>
                    <th>Order No</th>
                    <th>Order Amount</th>
                    <th>Invoice No</th>
                    <th>Particular</th>
                    <th className="text-success">Credit</th>
                    <th className="text-danger">Debit</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {wallet_statement.length > 0 ? (
                    wallet_statement.map((wallet, index) => (
                      <tr key={wallet.id}>
                        <td>{index + 1}</td>
                        <td>
                          {new Date(wallet.created_at).toLocaleDateString(
                            "en-GB"
                          )}
                        </td>
                        <td>
                          {wallet.type === "debit" ? `#${wallet.id}` : "-"}
                        </td>
                        <td>
                          {wallet.type === "debit"
                            ? Number(wallet.amount).toFixed(2)
                            : "-"}
                        </td>
                        <td>{wallet.wallet_no || wallet.invoice_no || "-"}</td>
                        <td style={{ minWidth: "180px" }}>
                          {wallet.particular} ({wallet.pay_mode})
                        </td>
                        <td className="text-success fw-bold">
                          {wallet.type === "credit"
                            ? Number(wallet.amount).toFixed(2)
                            : "-"}
                        </td>
                        <td className="text-danger fw-bold">
                          {wallet.type === "debit"
                            ? Number(wallet.amount).toFixed(2)
                            : "-"}
                        </td>
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
    </section>
  );
}
