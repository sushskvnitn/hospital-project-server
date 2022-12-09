const mongoose = require('mongoose');

const DB = process.env.DB;

mongoose
.connect(DB, {
  useNewURLParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("connection established to mongo");
})
.catch((err) => {
  console.log("no connection established to mongo database: " + err.message);
});