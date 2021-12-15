const express = require("express");
const db = require("../database/connection.js");
const router = express.Router();

router.get("/", (req, res) => {
    const qry = "select * from orders";
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
    let qry = "select * from orders where id = ?";
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
    if (!req.body.naam) {
        errors.push("Geen naam ingevuld");
    }
    if (!req.body.beschrijving) {
        errors.push("Geen naam ingevuld");
    }
    if (!req.body.categorie) {
        errors.push("Geen naam ingevuld");
    }
    if (!req.body.prijs) {
        errors.push("Geen naam ingevuld");
    }
    if (!req.body.dateAdded) {
        errors.push("Geen naam ingevuld");
    }
    if (!req.body.voorraad) {
        errors.push("Geen naam ingevuld");
    }
    console.log(errors.length);
    if (errors.length) {
        res.status(400).json({ errors });
        return;
    }

    let qry = `INSERT INTO "products"
	(naam, beschrijving, categorie, prijs, dateAdded, voorraad)
	VALUES (?,?,?,?,?,?)`;
	console.log(qry);
    let params = [
        req.body.dateOrdered,
        req.body.paid,
        req.body.shipped,
        req.body.userId,
        req.body.lines
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
