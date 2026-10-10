const bcrypt = require("bcrypt");
const User = require("../users/user.model.js");

async function signup(data) {
  const { username, email, password } = data;

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

  const normalizedEmail =
    email.toLowerCase().trim();

  const existingUser = await User.findOne({
    email: normalizedEmail
  });

  if (existingUser) {
    const error = new Error(
      "Email already in use"
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
    email: normalizedEmail,
    passwordHash
  });

  return {
    _id: user._id,
    username: user.username,
    email: user.email
  };
}

async function login(data) {
  const { email, password } = data;

  if (!email || !password) {
    const error = new Error(
      "Email and password are required"
    );
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail =
    email.toLowerCase().trim();

  const user = await User.findOne({
    email: normalizedEmail
  }).select("+passwordHash");

  if (!user) {
    const error = new Error(
      "Invalid email or password"
    );
    error.statusCode = 401;
    throw error;
  }

  const passwordMatches =
    await bcrypt.compare(
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