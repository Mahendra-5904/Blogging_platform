const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const { MongoClient } = require('mongodb');
const app = express();
const port = 3000;

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB connection string
const mongoURI = 'mongodb://127.0.0.1:27017/';
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

app.post('/publish', upload.single('image'), async (req, res) => {
    try {
        await client.connect();
        const database = client.db('AIML');
        const collection = database.collection('posts');

        const { title, content } = req.body;
        const imageUrl = req.file ? req.file.path : null;

        const result = await collection.insertOne({
            title,
            content,
            imageUrl,
            timestamp: new Date(),
        });

        console.log('Inserted post with id:', result.insertedId);

        res.status(201).json({ message: 'Post published successfully' });
    } catch (error) {
        console.error('Error publishing post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/getPosts', async (req, res) => {
    try {
        await client.connect();
        const database = client.db('SITE');
        const collection = database.collection('posts');

        const posts = await collection.find().toArray();

        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
