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
}) => {
  if (!firstName || !email || !phone || !password) {
    throw new Error("All fields are required");
  }

  const user = userModel.create({
    fullname: {
      firstName,
      lastName,
    },
    email,
    phone,
    password,
  });

  return user;
};
