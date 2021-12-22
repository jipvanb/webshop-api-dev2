const express = require("express");
const db = require("../database/connection.js");
const checkAdmin = require("../middleware/checkAdmin.js");
const checkAuth = require("../middleware/checkAuth.js");
const router = express.Router();

router.post("/", checkAuth, (req, res) => {
    let errors = [];
    console.log(req.body);
    if (!req.body.amount) {
        errors.push("Geen amount ingevuld");
    }
    if (!req.body.productId) {
        errors.push("Geen productId ingevuld");
    }
    if (!req.body.orderId) {
        errors.push("Geen orderId ingevuld");
    }
    if (!req.body.price) {
        errors.push("Geen price ingevuld");
    }
    console.log(errors.length);
    if (errors.length) {
        res.status(400).json({ errors });
        return;
    }

    let qry = `INSERT INTO "order_lines"
	(amount, productId, orderId, price)
	VALUES (?,?,?,?)`;
    let params = [
        req.body.amount,
        req.body.productId,
        req.body.orderId,
        req.body.price
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