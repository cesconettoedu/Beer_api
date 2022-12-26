// load .env data into process.env // load the .env!
require("dotenv").config();
// Web server config
const PORT = process.env.PORT || 8080;
const express = require("express");
const app = express();
const cors = require("cors")
app.use(cors());
const morgan = require("morgan");
// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));


const beers = require("./routes/beers")

app.use('/api/beers', beers(db));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
