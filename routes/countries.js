const express = require("express");
const db = require("../database/connection.js");
const router = express.Router();

router.get("/", (req, res) => {
    const qry = "select * from countries";
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
    let qry = "select * from countries where id = ?";
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
    console.log(errors.length);
    if (errors.length) {
        res.status(400).json({ errors });
        return;
    }

    let qry = `INSERT INTO "countries"
	(naam)
	VALUES (?)`;
	console.log(qry);
    let params = [
        req.body.naam
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

router.delete("/:id", (req, res) => {
    let qry = "DELETE FROM countries WHERE id = ?";
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
