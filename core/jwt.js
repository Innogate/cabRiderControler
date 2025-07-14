const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
  console.error("❌ Missing SECRET_KEY in .env");
  process.exit(1);
}

module.exports = {
  sign(payload, options = {}) {
    return jwt.sign(payload, SECRET_KEY, {
      expiresIn: "7d",
      ...options,
    });
  },

  verify(token) {
    try {
      return jwt.verify(token, SECRET_KEY);
    } catch {
      return null;
    }
  },
};
