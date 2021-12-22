require("dotenv").config();
const express = require("express");
const router = express.Router();
const db = require("../database/connection.js");
const jwt = require("jsonwebtoken");

router.post("/", (req, res) => {
    const username = req.body.username;
    const adminbody = req.body.admin;
    const userid = req.body.userid;
    const user = { name: username, admin: adminbody, id: userid };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.json({ accessToken: accessToken });
});

module.exports = router;