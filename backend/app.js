const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');


const app = express();
const nasabahRouter = require('./router/rNasabah');
const transactionRouter = require('./router/rTransaction');
const nasabahRouterOther = require('./router/rNasabahOther');
const transactionRouterOther = require('./router/rTransactionOther');
const configRewardRouterOther = require('./router/rConfigReward');
const configRewardRouter = require('./router/rReward');

//database
const urlDB = "mongodb://127.0.0.1:27017/int-bank?retryWrites=true";
mongoose.connect(urlDB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('connect');
}).catch(() => {
  console.log('disconnect');
});

//origin
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "*"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

//body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
// app.use('/images/users', express.static(path.join("backend/images")));

app.use("/api/int-bank/nasabah", nasabahRouter);
app.use('/api/int-bank/transfer', transactionRouter);
app.use("/api/int-bank/nasabahOther", nasabahRouterOther);
app.use('/api/int-bank/transferOther', transactionRouterOther);
app.use('/api/int-bank/configReward', configRewardRouterOther);
app.use('/api/int-bank/reward', configRewardRouter);

module.exports = app;
