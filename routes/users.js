const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../database/connection.js");
const checkAdmin = require("../middleware/checkAdmin.js");
const checkAuth = require("../middleware/checkAuth.js");
const router = express.Router();

router.get("/", checkAdmin, (req, res) => {
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

router.get("/:id/orders", checkAuth, (req, res) => {
    let qry = "SELECT orders.*, order_lines.amount, order_lines.price as line_price, products.naam as product_naam, users.firstName, users.middleName, users.lastName from orders, order_lines, products, users WHERE order_lines.orderId = orders.id AND order_lines.productId = products.id AND orders.userId = users.id AND users.id = ?";
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
        bcrypt.hashSync(req.body.password, 10),
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

router.patch("/:id", checkAuth, (req, res) => {
    let data = {
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        straat: req.body.straat,
        huisnummer: req.body.huisnummer,
        toevoeging: req.body.toevoeging,
        postcode: req.body.postcode,
        country: req.body.country,
        mail: req.body.mail,
        signedUpForNewsLetter: req.body.signedUpForNewsLetter,
        password: req.body.password
            ? bcrypt.hashSync(req.body.password, 10)
            : null,
    };

    let qry = `UPDATE users set 
    firstName = coalesce(?,firstName), 
    middleName = coalesce(?,middleName), 
    lastName = coalesce(?,lastName),
    straat = coalesce(?,straat),
    huisnummer = coalesce(?,huisnummer),
    toevoeging = coalesce(?,toevoeging),
    postcode = coalesce(?,postcode),
    country = coalesce(?,country),
    mail = coalsce(?,mail),
    password = coalsce(?,password),
    signedUpForNewsLetter = coalsce(?,signedUpForNewsLetter)
    WHERE id = ?`;

    let params = [
        data.firstName,
        data.middleName,
        data.lastName,
        data.straat,
        data.huisnummer,
        data.toevoeging,
        data.postcode,
        data.country,
        data.mail,
        data.password,
        data.signedUpForNewsLetter,
        req.params.id,
    ];

    db.run(qry, params, function (err, result) {
        if (err) {
            console.log(data);
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
