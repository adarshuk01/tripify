const app = require("../src/app");
const connectDB = require("../src/config/database");

module.exports = async (req, res) => {
  await connectDB(); // ✅ ensure DB connection
  return app(req, res);
};