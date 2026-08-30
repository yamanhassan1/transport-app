const userModel = require("../models/user.model");

module.exports.isUserExists = async ({ email, phone }) => {
  const existing = await userModel.findOne({
    $or: [{ email }, { phone }],
  });

  if (!existing) {
    return { exists: false };
  }

  if (existing.email.toLowerCase() === email.toLowerCase()) {
    return { exists: true, field: "email" };
  }

  return { exists: true, field: "phone" };
};

module.exports.createUser = async ({
  firstName,
  lastName,
  email,
  phone,
  password,
  profileImage,
}) => {
  if (!firstName || !email || !phone || !password) {
    const error = new Error("All fields are required");
    error.status = 400;
    throw error;
  }

  const user = userModel.create({
    fullname: {
      firstName,
      lastName,
    },
    email,
    phone,
    password,
    profileImage: profileImage || null,
  });

  return user;
};
