require("isomorphic-fetch");
const cors = require("cors");

const publisher = require("./publisher.js");
const consumer = require("./consumer.js");

const express = require("express");
const app = express();
let count = 2;

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", async function (req, res) {
  res.send("Hello");
});

app.get("/postMessage", function (req, res, next) {
  fetch("https://pquco5qmd3.execute-api.ap-south-1.amazonaws.com/items", {
    method: "PUT",
    body: JSON.stringify({ id: 2, message: "Hello" }),
  }).then((message) => {
    console.log(message);
    res.send(message);
  });
});

app.get("/sendMessage", function (req, res, next) {
  fetch("https://pquco5qmd3.execute-api.ap-south-1.amazonaws.com/items")
    .then((message) => {
      return message.json();
    })
    .then((parsedMsg) => {
      console.log(parsedMsg);
      sendMiddleware(req, res, next, parsedMsg.Items[0].message);
    });
  res.send("sent");
});

app.get("/receiveMessage", async function (req, res, next) {
  const message = await receiveMiddleware(req, res, next);
  res.send(message);
});

const sendMiddleware = function (req, res, next, parsedMsg) {
  publisher.publisherSend(parsedMsg);
};

const receiveMiddleware = async function (req, res, next) {
  const message = consumer.consumerReceive();
  return message;
};

app.listen(8000);
