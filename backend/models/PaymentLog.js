// models/PaymentLog.js

import mongoose from "mongoose";

const paymentLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "PrebuiltProject", required: true },
    amount: { type: Number, required: true },
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String },
    status: { type: String, default: "Pending" }, // Pending, Success, Failed
  },
  { timestamps: true }
);

const PaymentLog = mongoose.model("PaymentLog", paymentLogSchema);

export default PaymentLog;
