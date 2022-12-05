const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
const apiErrorHandler = require("./error/api-error-handler");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
const authController = require("./controller/auth");

const userRoute = require("./routes/userRoutes");
const staffRoute = require("./routes/staffRoute");
const cardRoute = require("./routes/cardRoute");
const busRoute = require("./routes/busRoute");
const routeRoute = require("./routes/routeRoute");
const ticketRoute = require("./routes/ticketRoute");
const transactionRoute = require("./routes/transactionRoute");
const paymentRoute = require("./routes/paymentRoute");
const smartRoute = require("./routes/smartRoute");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => console.log("Database connection sucessful!✅"));

app.use("/staffs", staffRoute);
app.use("/users", userRoute);
app.use("/cards", cardRoute);
app.use("/buses", busRoute);
app.use("/routes", routeRoute);
app.use("/tickets", ticketRoute);
app.use("/transactions", transactionRoute);
app.use("/payments", paymentRoute);
app.use("/smartRoute", smartRoute);

app.post("/login", authController.login);

app.use(apiErrorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Success at http://127.0.0.1:${PORT}🚀`);
});
