const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Replace '<your-mongodb-connection-url>' with your actual MongoDB connection URL
const mongoURI = '<your-mongodb-connection-url>';
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/submit', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('<your-database-name>');
    const collection = database.collection('<your-collection-name>');

    const { name, age, address, message } = req.body;
    const formData = { name, age, address, message };

    // Insert data into the MongoDB collection
    const result = await collection.insertOne(formData);

    console.log('Data stored in MongoDB:', result.ops[0]);
    res.send('Data submitted and stored in MongoDB successfully!');
  } finally {
    await client.close();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
