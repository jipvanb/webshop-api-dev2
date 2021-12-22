const express = require("express");
const db = require("../database/connection.js");
const checkAdmin = require("../middleware/checkAdmin.js");
const checkAuth = require("../middleware/checkAuth.js");
const router = express.Router();

router.get("/", checkAdmin, (req, res) => {
    const qry = "SELECT orders.*, order_lines.amount, order_lines.price as line_price, products.naam as product_naam, users.firstName, users.middleName, users.lastName from orders, order_lines, products, users WHERE order_lines.orderId = orders.id AND order_lines.productId = products.id AND orders.userId = users.id";
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

router.post("/", checkAuth, (req, res) => {
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

router.patch("/:id", checkAdmin, (req, res) => {
    let qry = `UPDATE orders set 
    paid = coalesce(?,paid),
    shipped = coalesce(?,shipped)
    WHERE id = ?`;

    let params = [
        req.body.paid,
        req.body.shipped,
        req.params.id,
    ];

    db.run(qry, params, function (err, result) {
        if (err) {
            res.status(400).json({ error: res.message });
            return;
        }
        res.status(200);
        res.json({
            message: "success",
            changes: this.changes,
        });
    });
});

module.exports = router;
