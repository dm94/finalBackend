const mongoose = require("mongoose");
require("dotenv").config();

const user = process.env.MONGO_DB_USER;
const password = process.env.MONGO_DB_PASS;

const dbname = process.env.MONGO_DB_NAME;
const host = process.env.MONGO_DB_HOST;

const uri = `mongodb+srv://${user}:${password}@${host}/${dbname}?retryWrites=true&w=majority`;

module.exports = mongoose.connect(
  uri,

  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  }
);
