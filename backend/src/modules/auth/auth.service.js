const bcrypt = require("bcrypt");
const User = require("../users/user.model.js");

async function signup({ username, email, password }) {
  if (!username || !email || !password) {
    const error = new Error(
      "Username, email and password are required"
    );
    error.statusCode = 400;
    throw error;
  }

  if (password.length < 8) {
    const error = new Error(
      "Password must be at least 8 characters"
    );
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await User.findOne({
    email: email.toLowerCase()
  });

  if (existingUser) {
    const error = new Error(
      "Email is already registered"
    );
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(
    password,
    12
  );

  const user = await User.create({
    username,
    email,
    passwordHash
  });

  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt
  };
}

async function login({ email, password }) {
  if (!email || !password) {
    const error = new Error(
      "Email and password are required"
    );
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({
    email: email.toLowerCase()
  }).select("+passwordHash");

  if (!user) {
    const error = new Error(
      "Invalid email or password"
    );
    error.statusCode = 401;
    throw error;
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!passwordMatches) {
    const error = new Error(
      "Invalid email or password"
    );
    error.statusCode = 401;
    throw error;
  }

  return {
    _id: user._id,
    username: user.username,
    email: user.email
  };
}

module.exports = {
  signup,
  login
};