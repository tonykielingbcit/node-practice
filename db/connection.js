const mongoose = require("mongoose");

require("dotenv").config();
const user = process.env.user;
const passwd = process.env.passwd;
const db = process.env.db;

mongoose.set('strictQuery', true);

const uri =
    `mongodb+srv://${user}:${passwd}@cluster0.iw7hm03.mongodb.net/${db}?retryWrites=true&w=majority`;

// Set up default mongoose connection
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Store a reference to the default connection
const db_conn = mongoose.connection;

// Log once we have a connection to Atlas
db_conn.once("open", () => console.log(`User ${user} is now Connected to MongoDB!`));

// Bind connection to error event (to get notification of connection errors)
db_conn.on("error", console.error.bind(console, `User ${user} MongoDB connection error:`));

module.exports = mongoose;