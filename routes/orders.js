const express = require("express");
const db = require("../database/connection.js");
const router = express.Router();

router.get("/", (req, res) => {
    const qry = "SELECT * from orders, order_lines WHERE order_lines.orderId = orders.id";
    const params = [];

    db.all(qry, params, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: "success",
            data: rows,
        });
    });
});

router.post("/", (req, res) => {
    let errors = [];
    console.log(req.body);
    if (!req.body.dateOrdered) {
        errors.push("Geen date ingevuld");
    }
    if (!req.body.paid) {
        errors.push("Geen paid ingevuld");
    }
    if (!req.body.shipped) {
        errors.push("Geen shipped ingevuld");
    }
    if (!req.body.userId) {
        errors.push("Geen userId ingevuld");
    }
    console.log(errors.length);
    if (errors.length) {
        res.status(400).json({ errors });
        return;
    }

    let qry = `INSERT INTO "orders"
	(dateOrdered, paid, shipped, userId)
	VALUES (?,?,?,?)`;
    let params = [
        req.body.dateOrdered,
        req.body.paid,
        req.body.shipped,
        req.body.userId
    ];
    db.run(qry, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.status(200);
        res.json({
            id: this.lastID,
        });
    });
});

module.exports = router;
