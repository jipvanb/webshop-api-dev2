const express = require("express");
const app = express();
app.use(express.json());

require("dotenv").config();
const auteurRouter = require("./routes/auteurs");
const authRouter = require("./routes/auth");
const categoriesRouter = require("./routes/categories");
const countriesRouter = require("./routes/countries");
const ordersRouter = require("./routes/orders");
const productsRouter = require("./routes/products");
const usersRouter = require("./routes/users");

// Root path
app.get("/", (req, res) => {
    res.json({ message: "Ok" });
});

// Start server
app.listen(process.env.HTTP_PORT, () => {
    console.log(`Server running on port ${process.env.HTTP_PORT}`);
});

app.use("/api/auteurs", auteurRouter);
app.use("/api/auth", authRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/countries", countriesRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/products", productsRouter);
app.use("/api/users", usersRouter);