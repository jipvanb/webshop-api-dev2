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

router.post("/", (req, res) => {
    let errors = [];
    console.log(req.body);
    if (!req.body.firstName) {
        errors.push("Geen naam ingevuld");
    }
    if (!req.body.lastName) {
        errors.push("Geen achternaam ingevuld");
    }
    if (!req.body.straat) {
        errors.push("Geen straat ingevuld");
    }
    if (!req.body.huisnummer) {
        errors.push("Geen huisnummer ingevuld");
    }
    if (!req.body.postcode) {
        errors.push("Geen postcode ingevuld");
    }
    if (!req.body.country) {
        errors.push("Geen country ingevuld");
    }
    if (!req.body.mail) {
        errors.push("Geen mail ingevuld");
    }
    if (!req.body.password) {
        errors.push("Geen password ingevuld");
    }
    if (!req.body.signedUpForNewsLetter) {
        errors.push("Geen signedUpForNewsLetter ingevuld");
    }
    console.log(errors.length);
    if (errors.length) {
        res.status(400).json({ errors });
        return;
    }

    let qry = `INSERT INTO "users"
	(firstName, middleName, lastName, straat, huisnummer, toevoeging, postcode, country, mail, password, signedUpForNewsLetter)
	VALUES (?,?,?,?,?,?,?,?,?,?,?)`;
    let params = [
        req.body.firstName,
        req.body.middleName,
        req.body.lastName,
        req.body.straat,
        req.body.huisnummer,
        req.body.toevoeging,
        req.body.postcode,
        req.body.country,
        req.body.mail,
        req.body.password,
        req.body.signedUpForNewsLetter
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
