const express = require("express");
const app = express();

require("dotenv").config();
const auteurRouter = require("./routes/auteurs");

// Root path
app.get("/", (req, res) => {
    res.json({ message: "Ok" });
});

// Start server
app.listen(process.env.HTTP_PORT, () => {
    console.log(`Server running on port ${process.env.HTTP_PORT}`);
});

app.use("/api/auteurs", auteurRouter);
