const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const medicationRoutes = require('./routes/medication')

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/medications', medicationRoutes);

app.get('/', (req, res) => {
    res.send('MediCare API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
