const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config/constants");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, "First name must be at least 3 characters long"],
        maxlength: 50,
      },

      lastName: {
        type: String,
        trim: true,
        minlength: [3, "Last name must be at least 3 characters long"],
        maxlength: 50,
      },
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
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
      minlength: [6, "Password must be at least 6 characters long"],
    },

    profileImage: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      enum: ["user"],
      default: "user",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
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

    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ location: "2dsphere" });

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, role: this.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
  return token;
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
