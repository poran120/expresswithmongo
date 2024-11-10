const express = require("express");
const mongoose = require("mongoose");
const { mongoURI, PORT } = require("./config/config");
const { router } = require("./routes/user");
const { requestLogger } = require("./middleware/customMiddleware");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app = express();

// MongoDB connection & Check if the connection is successful or not.
mongoose
  .connect(mongoURI || "mongodb://localhost:27017/office_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Middleware to parse JSON and URL-encoded data. Everything has to go through this middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.use("/api/users", router);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
