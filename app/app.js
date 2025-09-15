const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Connect to MongoDB
// Use MONGODB_URI from environment when provided (Compose will set this). Fall back to localhost for local dev.
const mongoUri = process.env.MONGODB_URI || 'mongodb://admin:admin@localhost:27017/reminderapp?authSource=admin';
console.log('Attempting to connect to MongoDB using:', process.env.MONGODB_URI ? '(MONGODB_URI from environment)' : '(fallback to localhost)');

// Retry logic: keep trying until Mongo is ready. This handles the common race where the app
// starts before the mongo container has finished initializing.
const connectWithRetry = (retries = 0) => {
    mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log('Successfully connected to MongoDB');
    }).catch((error) => {
        console.error('Detailed MongoDB connection error:');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        if (error.code) {
            console.error('Error code:', error.code);
        }
        if (error.errno) {
            console.error('Error number:', error.errno);
        }
        if (error.message && error.message.includes('ECONNREFUSED')) {
            console.error('Hint: If running inside Docker Compose make sure MONGODB_URI uses the `mongo` service hostname (not localhost).');
        }

        // Backoff: wait 5s, then retry. After many retries log a stronger warning every minute.
        const delay = 5000;
        const maxRetriesBeforeVerbose = 12; // 12*5s = 60s
        if (retries >= maxRetriesBeforeVerbose) {
            console.error(`Still waiting for MongoDB after ${Math.floor((retries * delay) / 1000)}s... will keep retrying.`);
        }
        setTimeout(() => connectWithRetry(retries + 1), delay);
    });
};

connectWithRetry();

// Define Reminder Schema
const reminderSchema = new mongoose.Schema({
    title: String,
    description: String,
    date: String,
    time: String,
    completed: { type: Boolean, default: false },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Reminder = mongoose.model('Reminder', reminderSchema);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Endpoints
app.post('/api/reminders', async (req, res) => {
    try {
        console.log('Received data:', req.body);  // Debug log
        const reminder = new Reminder(req.body);
        await reminder.save();
        console.log('Saved reminder:', reminder);  // Debug log
        res.status(201).json(reminder);
    } catch (error) {
        console.error('Error saving reminder:', error);  // Debug log
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/reminders', async (req, res) => {
    try {
        const reminders = await Reminder.find().sort({ createdAt: -1 });
        res.json(reminders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/reminders/:id', async (req, res) => {
    try {
        const reminder = await Reminder.findByIdAndDelete(req.params.id);
        if (!reminder) {
            return res.status(404).json({ error: 'Reminder not found' });
        }
        res.json({ message: 'Reminder deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/reminders/:id', async (req, res) => {
    try {
        const { title, description, date, time, completed } = req.body;
        const reminder = await Reminder.findByIdAndUpdate(
            req.params.id,
            { title, description, date, time, completed },
            { new: true, runValidators: true }
        );
        if (!reminder) {
            return res.status(404).json({ error: 'Reminder not found' });
        }
        res.json(reminder);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
