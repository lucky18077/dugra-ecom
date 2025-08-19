import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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

  const { order_mst, orders_item } = invoiceData;

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
        style={{
          border: "1px solid #000",
          padding: "20px",
          maxWidth: "1000px",
          margin: "auto",
        }}
        className="invoice-print"
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <h2 style={{ margin: 0 }}>DURGA PROVISION STORE</h2>
          <p>
            SCF 179 (Backside) Grain Market, Sector - 26, Chandigarh - 160019
            <br />
            Mob: +91-9876543210 | Email: durgastores@gmail.com
            <br />
            GSTIN : 04AHFPK9892H1ZZ | FSSAI No: 1301800001221
          </p>
          <h3 style={{ textDecoration: "underline", marginTop: "10px" }}>
            TAX INVOICE
          </h3>
        </div>

        {/* Invoice Info */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "15px",
          }}
        >
          <tbody>
            <tr>
              <td style={tdBox}>
                <strong>Invoice No:</strong> {order_mst.invoice_no}
              </td>
              <td style={tdBox}>
                <strong>Date:</strong>{" "}
                {new Date(order_mst.created_at).toLocaleDateString("en-GB")}
              </td>
              <td style={tdBox}>
                <strong>Transport:</strong> ACTIVA
              </td>
              <td style={tdBox}>
                <strong>Vehicle No:</strong> CH01BB0999
              </td>
            </tr>
            <tr>
              <td style={tdBox}>
                <strong>Place of Supply:</strong> Haryana (06)
              </td>
              <td style={tdBox}>
                <strong>Reverse Charge:</strong> N
              </td>
              <td style={tdBox}>
                <strong>E-Way Bill No:</strong> 31206583248
              </td>
              <td style={tdBox}>
                <strong>Station:</strong> Panchkula
              </td>
            </tr>
          </tbody>
        </table>

        {/* Billing & Shipping */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "20px",
          }}
        >
          <tbody>
            <tr>
              <td style={{ ...tdBox, width: "50%" }}>
                <h4>Billed To:</h4>
                <p>
                  <strong>{order_mst.name}</strong>
                  <br />
                  {order_mst.address}, {order_mst.pincode}
                  <br />
                  {order_mst.number}
                  <br />
                  {order_mst.email}
                  <br />
                  {/* GSTIN/ UIN : 06AECAF435D1ZX */}
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
                  <br />
                  {/* GSTIN/ UIN : 06AECAF435D1ZX */}
                </p>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Items Table */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "20px",
          }}
        >
          <thead>
            <tr style={{ background: "#f2f2f2" }}>
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
                  {/* Amount = taxable + GST + Cess */}
                  <td style={tdBox}>{(total + gstAmt + cessAmt).toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ textAlign: "right", marginBottom: "20px" }}>
          <p>
            <strong>Sub Total:</strong> ₹{subtotal.toFixed(2)}
          </p>
          <p>
            <strong>GST:</strong> ₹{gstTotal.toFixed(2)}
          </p>
          <p>
            <strong>Cess:</strong> ₹{cessTotal.toFixed(2)}
          </p>
          <h3>Grand Total: ₹{grandTotal.toFixed(2)}</h3>
        </div>

        {/* Declaration */}
        <div
          style={{
            borderTop: "1px solid #000",
            paddingTop: "10px",
            marginBottom: "20px",
          }}
        >
          <h4>Declaration</h4>
          <p>
            We hereby certify that the particulars of this invoice are true and
            correct. Goods once sold will not be taken back or exchanged.
          </p>
        </div>

        {/* Footer with QR + Signature */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "30px",
          }}
        >
          <div>
            <p>Bank Details:</p>
            <p>HDFC BANK LTD, A/C No: 50200026076887, IFSC: HDFC0009034</p>
            {/* <img src="/assets/images/qr.png" alt="QR Code" width="100" /> */}
          </div>
          <div style={{ textAlign: "right" }}>
            <p>For DURGA PROVISION STORE</p>
            <br />
            <br />
            <p>Authorised Signatory</p>
          </div>
        </div>
      </div>

      <style>{`
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

const thBox = {
  border: "1px solid #000",
  padding: "5px",
  fontSize: "12px",
};

const tdBox = {
  border: "1px solid #000",
  padding: "5px",
  fontSize: "12px",
};
