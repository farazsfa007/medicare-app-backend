const express = require('express');
const db = require('../db/database');
const router = express.Router();

// Add Medication
router.post('/', (req, res) => {
    const { userId, name, dosage, frequency, date } = req.body;

    if (!userId || !name || !dosage || !frequency || !date) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = `INSERT INTO medications (userId, name, dosage, frequency, date) VALUES (?, ?, ?, ?, ?)`;
    db.run(query, [userId, name, dosage, frequency, date], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        res.status(201).json({ message: 'Medication added', medicationId: this.lastID });
    });
});

// Get Medications by User ID
router.get('/:userId', (req, res) => {
    const { userId } = req.params;
    db.all(`SELECT * FROM medications WHERE userId = ?`, [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        res.status(200).json(rows);
    });
});

// Mark Medication as Taken
router.put('/mark/:id', (req, res) => {
    const { id } = req.params;
    const query = `UPDATE medications SET isTaken = 1 WHERE id = ?`;

    db.run(query, [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        res.status(200).json({ message: 'Medication marked as taken' });
    });
});

// Update Medication (optional fields)
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, dosage, frequency, date } = req.body;

    const query = `UPDATE medications SET name = ?, dosage = ?, frequency = ?, date = ? WHERE id = ?`;
    db.run(query, [name, dosage, frequency, date, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        res.status(200).json({ message: 'Medication updated' });
    });
});

// Delete Medication
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM medications WHERE id = ?`, [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        res.status(200).json({ message: 'Medication deleted' });
    });
});

module.exports = router;
