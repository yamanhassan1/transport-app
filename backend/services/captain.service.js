const CaptainModel = require("../models/captain.model");

module.exports.isCaptainExists = async ({
  email,
  phone,
  licenseNumber,
  plateNumber,
}) => {
  const existing = await CaptainModel.findOne({
    $or: [{ email }, { phone }, { "license.number": licenseNumber }, { "vehicle.plateNumber": plateNumber }],
  });

  if (!existing) {
    return { exists: false };
  }

  if (existing.email.toLowerCase() === email.toLowerCase()) {
    return { exists: true, field: "email" };
  }

  if (existing.phone === phone) {
    return { exists: true, field: "phone" };
  }

  if (existing.license?.number === licenseNumber) {
    return { exists: true, field: "license.number" };
  }

  return { exists: true, field: "vehicle.plateNumber" };
};

module.exports.createCaptain = async ({
  firstName,
  lastName,
  email,
  phone,
  password,
  vehicle,
  license,
  profileImage,
}) => {
  if (!firstName || !email || !phone || !password) {
    const error = new Error("All fields are required");
    error.status = 400;
    throw error;
  }

  if (!vehicle?.vehicleType || !vehicle?.make || !vehicle?.model || !vehicle?.year || !vehicle?.color || !vehicle?.plateNumber) {
    const error = new Error("Vehicle details are required");
    error.status = 400;
    throw error;
  }

  if (!license?.number || !license?.expiryDate) {
    const error = new Error("License details are required");
    error.status = 400;
    throw error;
  }

  const captain = CaptainModel.create({
    fullname: {
      firstName,
      lastName,
    },
    email,
    phone,
    password,
    vehicle,
    license: {
      number: license.number,
      expiryDate: license.expiryDate,
    },
    profileImage: profileImage || null,
  });

  return captain;
};
