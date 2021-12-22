const express = require("express");
const db = require("../database/connection.js");
const checkAdmin = require("../middleware/checkAdmin.js");
const router = express.Router();

router.get("/", (req, res) => {
    const qry = "select * from products";
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
    let qry = "select * from products where id = ?";
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

router.post("/", checkAdmin, (req, res) => {
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
        req.body.naam,
        req.body.beschrijving,
        req.body.categorie,
        req.body.prijs,
        req.body.dateAdded,
        req.body.voorraad
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
    let qry = `UPDATE products set 
    naam = coalesce(?,naam), 
    beschrijving = coalesce(?,beschrijving), 
    categorie = coalesce(?,categorie),
    prijs = coalesce(?,prijs),
    dateAdded = coalesce(?,dateAdded),
    voorraad = coalesce(?,voorraad)
    WHERE id = ?`;

    let params = [
        req.body.naam,
        req.body.beschrijving,
        req.body.categorie,
        req.body.prijs,
        req.body.dateAdded,
        req.body.voorraad,
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

router.delete("/:id", checkAdmin, (req, res) => {
    let qry = "DELETE FROM products WHERE id = ?";
    let params = [req.params.id];

    db.run(qry, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(412);
            res.json({
                message: `Record ${req.params.id} niet gevonden.`,
            });
        } else {
            res.status(200);
            res.json({
                message: `Record ${req.params.id} deleted.`,
            });
        }
    });
});

module.exports = router;
