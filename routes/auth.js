const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db/database');
const router = express.Router();

// Register
router.post('/register', (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);

    const query = `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`;
    db.run(query, [name, email, hashedPassword, role], function (err) {
        if (err) {
        if (err.message.includes('UNIQUE')) {
            return res.status(400).json({ error: 'Email already registered' });
        }
        return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'User registered successfully', userId: this.lastID });
    });
});
// Get all patients (for caretakers)
router.get('/patients', (req, res) => {
  db.all(`SELECT id, name, email FROM users WHERE role = 'patient'`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(rows);
  });
});

// Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });

        if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ error: 'Invalid email or password' });
        }

        res.status(200).json({
        message: 'Login successful',
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
        });
    });
});

module.exports = router;
