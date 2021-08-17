require("isomorphic-fetch");
const publisher = require("./publisher.js");
const consumer = require("./consumer.js");

const express = require("express");
const app = express();

app.get("/", async function (req, res) {
  res.send("Hello");
});

app.get("/sendMessage", function (req, res, next) {
  fetch(" https://t0rlh3a3bj.execute-api.ap-south-1.amazonaws.com/stage")
    .then((message) => {
      return message.json();
    })
    .then((parsedMsg) => {
      sendMiddleware(req, res, next, parsedMsg);
    });
  res.send("sent");
});

app.get("/receiveMessage", async function (req, res, next) {
  const message = await fetch(
    " https://t0rlh3a3bj.execute-api.ap-south-1.amazonaws.com/stage"
  );
  const parsedMsg = await message.json();
  receiveMiddleware(req, res, next);
});

const sendMiddleware = function (req, res, next, parsedMsg) {
  publisher.publisherSend(parsedMsg);
};

const receiveMiddleware = function (req, res, next) {
  consumer.consumerReceive();
};

app.listen(3000);
