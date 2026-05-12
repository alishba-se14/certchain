const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    studentName: {
      type:     String,
      required: true,
      trim:     true,
    },
    course: {
      type:     String,
      required: true,
      trim:     true,
    },
    issueDate: {
      type:    Date,
      default: Date.now,
    },
    status: {
      type:    String,
      enum:    ["Verified", "Pending", "Invalid"],
      default: "Pending",
    },
    fileUrl: {
      type:    String,
      default: "",
    },
    verificationId: {
      type:   String,
      unique: true,
    },
    blockchainHash: {
      type:    String,
      default: "",
    },
    previousHash: {
      type:    String,
      default: "0",
    },
    blockIndex: {
      type:    Number,
      default: 0,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Certificate", certificateSchema);