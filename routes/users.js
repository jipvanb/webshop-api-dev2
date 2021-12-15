const express = require("express");
const db = require("../database/connection.js");
const router = express.Router();

router.get("/", (req, res) => {
    const qry = "select * from users";
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

router.get("/:id", (req, res) => {
    let qry = "select * from users where id = ?";
    let params = [req.params.id];

    db.get(qry, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.status(200);
        res.json({
            data: row
        });
    });
});

router.get("/:id/orders", (req, res) => {
    let qry = "select orders.id, orders.dateOrdered, orders.paid, orders.shipped, order_lines.amount, order_lines.price, order_lines.productId, products.naam, users.id, users.firstName, users.middleName, users.lastName from orders, order_lines, products, users where orders.id == order_lines.orderId AND order_lines.productId == products.id AND orders.userId == users.id AND orders.id = ?";
    let params = [req.params.id];

    db.get(qry, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.status(200);
        res.json({
            data: row
        });
    });
});

module.exports = router;
