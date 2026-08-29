const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    captain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Captain",
      default: null,
    },

    pickup: {
      address: String,
      location: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number],
          required: true,
        },
      },
    },

    destination: {
      address: String,
      location: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number],
          required: true,
        },
      },
    },

    status: {
      type: String,
      enum: [
        "requested",
        "accepted",
        "captain_arriving",
        "arrived",
        "started",
        "completed",
        "cancelled",
      ],
      default: "requested",
    },

    fare: {
      type: Number,
      required: true,
      min: 0,
    },

    requestedAt: {
      type: Date,
      default: Date.now,
    },

    acceptedAt: Date,
    startedAt: Date,
    completedAt: Date,
    cancelledAt: Date,
  },
  {
    timestamps: true,
  }
);

const Ride = mongoose.model("Ride", rideSchema);

module.exports = Ride;