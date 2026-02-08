// models/Payment.js

import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    razorpay_order_id: {
      type: String,
      required: true,
    },
    razorpay_payment_id: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      default: "Completed",
    },

    // Distinguish between normal or custom payments
    type: {
      type: String,
      enum: ["prebuilt", "custom_advance", "custom_final"],
      default: "prebuilt",
    },

    // NEW FIELD (project name saved later in controller)
    projectName: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
