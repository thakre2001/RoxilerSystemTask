const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/transactionsDB', { useNewUrlParser: true, useUnifiedTopology: true });

//  Transaction Schema
const transactionSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: String,
  dateOfSale: Date,
  sold: Boolean,
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// API to initialize database
app.get('/initialize', async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const data = response.data;

    await Transaction.deleteMany(); // Clear existing data
    await Transaction.insertMany(data); // Seed data

    res.status(200).send({ message: 'Database initialized successfully.' });
  } catch (error) {
    res.status(500).send({ error: 'Failed to initialize database', details: error.message });
  }
});

// API to list transactions with search and pagination
app.get('/transactions', async (req, res) => {
  const { page = 1, perPage = 10, search = '' } = req.query;

  const query = {
    $or: [
      { title: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
      { price: new RegExp(search, 'i') },
    ],
  };

  try {
    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));
    const total = await Transaction.countDocuments(query);

    res.status(200).send({ transactions, total, page: parseInt(page), perPage: parseInt(perPage) });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch transactions', details: error.message });
  }
});

// API for statistics
app.get('/statistics', async (req, res) => {
  const { month } = req.query;
  const monthIndex = new Date(`${month} 1, 2000`).getMonth();

  try {
    const transactions = await Transaction.find({
      dateOfSale: { $gte: new Date(2000, monthIndex, 1), $lt: new Date(2000, monthIndex + 1, 1) },
    });

    const totalSales = transactions.reduce((sum, t) => (t.sold ? sum + t.price : sum), 0);
    const soldItems = transactions.filter((t) => t.sold).length;
    const unsoldItems = transactions.filter((t) => !t.sold).length;

    res.status(200).send({ totalSales, soldItems, unsoldItems });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch statistics', details: error.message });
  }
});

// API for bar chart data
app.get('/bar-chart', async (req, res) => {
  const { month } = req.query;
  const monthIndex = new Date(`${month} 1, 2000`).getMonth();

  try {
    const transactions = await Transaction.find({
      dateOfSale: { $gte: new Date(2000, monthIndex, 1), $lt: new Date(2000, monthIndex + 1, 1) },
    });

    const ranges = Array(10).fill(0);
    transactions.forEach((t) => {
      const rangeIndex = Math.min(Math.floor(t.price / 100), 9);
      ranges[rangeIndex]++;
    });

    const barChartData = ranges.map((count, index) => ({
      range: `${index * 100} - ${(index + 1) * 100}`,
      count,
    }));

    res.status(200).send(barChartData);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch bar chart data', details: error.message });
  }
});

// API for pie chart data
app.get('/pie-chart', async (req, res) => {
  const { month } = req.query;
  const monthIndex = new Date(`${month} 1, 2000`).getMonth();

  try {
    const transactions = await Transaction.find({
      dateOfSale: { $gte: new Date(2000, monthIndex, 1), $lt: new Date(2000, monthIndex + 1, 1) },
    });

    const categoryCounts = transactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {});

    res.status(200).send(categoryCounts);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch pie chart data', details: error.message });
  }
});

// Combined API
app.get('/combined-data', async (req, res) => {
  const { month } = req.query;

  try {
    const statistics = await axios.get(`http://localhost:3000/statistics?month=${month}`);
    const barChart = await axios.get(`http://localhost:3000/bar-chart?month=${month}`);
    const pieChart = await axios.get(`http://localhost:3000/pie-chart?month=${month}`);

    res.status(200).send({
      statistics: statistics.data,
      barChart: barChart.data,
      pieChart: pieChart.data,
    });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch combined data', details: error.message });
  }
});

// Start the server
app.listen(3000, () => console.log('Server running on port 3000'));
