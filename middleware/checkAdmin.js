const jwt = require("jsonwebtoken");
require("dotenv").config();
const express = require("express");
const router = express.Router();

module.exports = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) {
        return res.sendStatus(401);
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        if (req.user.admin == "false") {
            console.log("user is not an Admin");
            return res.sendStatus(403);
        }
        next();
    });
};