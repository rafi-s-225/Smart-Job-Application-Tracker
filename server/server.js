const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req,res) => {
    res.send("JOb Tracker Server is running")
});

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB connected")
})
.catch((err) => {
    console.log("MongoDB connection failed")
    console.log(err)
})

app.listen(PORT, () => {
    console.log("Server Started on port " + PORT)
})
