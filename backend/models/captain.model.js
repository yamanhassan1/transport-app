const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/constants');

const captainSchema = new mongoose.Schema(
  {
    fullname: {
      firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50,
      },

      lastName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50,
      },
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    profileImage: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      enum: ["captain"],
      default: "captain",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    isAvailable: {
      type: Boolean,
      default: false,
    },

    license: {
      number: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },

      expiryDate: {
        type: Date,
        required: true,
      },

      document: {
        type: String,
        default: null,
      },
    },

    vehicle: {
      vehicleType: {
        type: String,
        enum: [
          "bike",
          "rickshaw",
          "car",
          "premium",
          "go",
          "go_mini",
          "go_sedan",
        ],

        required: true,
      },

      make: {
        type: String,
        required: true,
        trim: true,
      },

      model: {
        type: String,
        required: true,
        trim: true,
      },

      year: {
        type: Number,
        required: true,
      },

      color: {
        type: String,
        required: true,
        trim: true,
      },

      plateNumber: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
      },

      registrationNumber: {
        type: String,
        default: null,
      },

      image: {
        type: String,
        default: null,
      },
    },

    rating: {
      average: {
        type: Number,
        default: 5,
        min: 0,
        max: 5,
      },

      totalRatings: {
        type: Number,
        default: 0,
      },
    },

    totalTrips: {
      type: Number,
      default: 0,
    },

    completedTrips: {
      type: Number,
      default: 0,
    },

    cancelledTrips: {
      type: Number,
      default: 0,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },

      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    socketId: {
      type: String,
    },

    lastLocationUpdate: {
      type: Date,
      default: null,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

captainSchema.index({ location: "2dsphere" });

captainSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, role: this.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return token;
}

captainSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

captainSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

const CaptainModel = mongoose.model("Captain", captainSchema);

module.exports = CaptainModel;
