import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { LIVE_URL } from "../Api/Route";

export default function Invoice() {
  const { id } = useParams();
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("customer_token");

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await axios.get(`${LIVE_URL}/invoice/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.status) {
          setInvoiceData(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching invoice:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id, token]);

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (!invoiceData)
    return <p style={{ textAlign: "center" }}>Invoice not found.</p>;

  const { order_mst, orders_item, customer } = invoiceData;

  // Totals
  const subtotal = orders_item.reduce(
    (acc, item) => acc + (parseFloat(item.price) || 0) * (item.qty || 0),
    0
  );
  const gstTotal = orders_item.reduce((acc, item) => {
    const price = parseFloat(item.price) || 0;
    const qty = item.qty || 0;
    const gstPercent = parseFloat(item.gst) || 0;
    return acc + (price * qty * gstPercent) / 100;
  }, 0);
  const cessTotal = orders_item.reduce((acc, item) => {
    const price = parseFloat(item.price) || 0;
    const qty = item.qty || 0;
    const cessPercent = parseFloat(item.cess_tax) || 0;
    return acc + (price * qty * cessPercent) / 100;
  }, 0);
  const grandTotal = subtotal + gstTotal + cessTotal;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* Print Button */}
      <div
        className="d-print-none"
        style={{ textAlign: "right", marginBottom: "10px" }}
      >
        <button
          onClick={() => window.print()}
          style={{
            background: "#000",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "4px",
          }}
        >
          🖨️ Print
        </button>
      </div>

      {/* Invoice */}
      <div
        className="invoice-print"
        style={{
          position: "relative",
          border: "2px solid #000",
          padding: "30px",
          maxWidth: "1000px",
          margin: "auto",
          background: "#fff",
        }}
      >
        {/* Watermark */}
        <div className="watermark">ESTIMATE</div>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, letterSpacing: "1px" }}>
            Bulk Basket India
          </h2>
          <p style={{ margin: "5px 0" }}>
            SCF 179 (Backside) Grain Market, Sector - 26, Chandigarh - 160019
            <br />
            Mob: +91-9876543210 | Email: durgastores@gmail.com
            <br />
            GSTIN : 04AHFPK9892H1ZZ | FSSAI No: 1301800001221
          </p>
          <h3
            style={{
              textDecoration: "underline",
              marginTop: "15px",
              fontSize: "18px",
            }}
          >
            Estimate Bill
          </h3>
        </div>

        {/* Billing & Shipping */}
        <table style={tableStyle}>
          <tbody>
            <tr>
              <td style={{ ...tdBox, width: "50%" }}>
                <h4>Billed To:</h4>
                <p>
                  <strong>{customer.name}</strong>
                  <br />
                  {customer.address}, {customer.pincode}
                  <br />
                  {customer.number}
                  <br />
                  {customer.email}
                </p>
              </td>
              <td style={{ ...tdBox, width: "50%" }}>
                <h4>Shipped To:</h4>
                <p>
                  <strong>{order_mst.name}</strong>
                  <br />
                  {order_mst.address}, {order_mst.pincode}
                  <br />
                  {order_mst.number}
                  <br />
                  {order_mst.email}
                </p>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Items Table */}
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: "#f8f8f8" }}>
              <th style={thBox}>S.No</th>
              <th style={thBox}>Description of Goods</th>
              <th style={thBox}>HSN</th>
              <th style={thBox}>Qty</th>
              <th style={thBox}>Unit</th>
              <th style={thBox}>Rate</th>
              <th style={thBox}>Disc%</th>
              <th style={thBox}>GST%</th>
              <th style={thBox}>CESS%</th>
              <th style={thBox}>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {orders_item.map((item, i) => {
              const price = parseFloat(item.price) || 0;
              const qty = item.qty || 0;
              const gstPercent = parseFloat(item.gst) || 0;
              const cessPercent = parseFloat(item.cess_tax) || 0;

              const total = price * qty;
              const gstAmt = (total * gstPercent) / 100;
              const cessAmt = (total * cessPercent) / 100;

              return (
                <tr key={i}>
                  <td style={tdBox}>{i + 1}</td>
                  <td style={tdBox}>{item.product_name}</td>
                  <td style={tdBox}>{item.hsn_code}</td>
                  <td style={tdBox}>{qty}</td>
                  <td style={tdBox}>{item.uom_name}</td>
                  <td style={tdBox}>{price.toFixed(2)}</td>
                  <td style={tdBox}>0</td>
                  <td style={tdBox}>{gstPercent}%</td>
                  <td style={tdBox}>{cessPercent}%</td>
                  <td style={tdBox}>{(total + gstAmt + cessAmt).toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ textAlign: "right", marginTop: "15px" }}>
          <p>
            <strong>Sub Total:</strong> ₹{subtotal.toFixed(2)}
          </p>
          <p>
            <strong>GST:</strong> ₹{gstTotal.toFixed(2)}
          </p>
          <p>
            <strong>Cess:</strong> ₹{cessTotal.toFixed(2)}
          </p>
          <h3 style={{ marginTop: "10px" }}>
            Grand Total: ₹{grandTotal.toFixed(2)}
          </h3>
        </div>

        {/* Declaration */}
        <div style={{ borderTop: "1px solid #000", paddingTop: "10px" }}>
          <h4>Declaration</h4>
          <p>
            We hereby certify that the particulars of this invoice are true and
            correct. Goods once sold will not be taken back or exchanged.
          </p>
        </div>

        {/* Footer with Bank + Signature */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "40px",
          }}
        >
          <div>
            <p>
              <strong>Bank Details:</strong>
            </p>
            <p>HDFC BANK LTD</p>
            <p>A/C No: 50200026076887</p>
            <p>IFSC: HDFC0009034</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p>
              For <strong>Bulk Basket India</strong>
            </p>
            <br />
            <br />
            <p>Authorised Signatory</p>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        .watermark {
          position: absolute;
          top: 40%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-30deg);
          font-size: 100px;
          font-weight: bold;
          color: rgba(0,0,0,0.08);
          white-space: nowrap;
          pointer-events: none;
          user-select: none;
        }
        @media print {
          body * { visibility: hidden; }
          .invoice-print, .invoice-print * { visibility: visible; }
          .invoice-print { position: absolute; left: 0; top: 0; width: 100%; }
          .d-print-none { display: none !important; }
        }
        table, th, td {
          border: 1px solid #000;
        }
      `}</style>
    </div>
  );
}

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginBottom: "20px",
};

const thBox = {
  border: "1px solid #000",
  padding: "6px",
  fontSize: "12px",
  background: "#f2f2f2",
};

const tdBox = {
  border: "1px solid #000",
  padding: "6px",
  fontSize: "12px",
};
