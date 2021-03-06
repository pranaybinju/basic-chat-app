require("isomorphic-fetch");
const amqp = require("amqplib");
const eventEmitterModule = require("./emitter.js");

//send();

async function send(parsedMsg) {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    const result = await channel.assertQueue("publisher-send");
    channel.sendToQueue("publisher-send", Buffer.from(parsedMsg));
    eventEmitter.emit("messageReceived");
    console.log("Message sent");
  } catch (ex) {
    console.log(ex);
  }
}

//receive();

async function receive() {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    const result = await channel.assertQueue("consumer-send");
    channel.consume("consumer-send", (msg) => {
      console.log(msg.content.toString());
      console.log("Message received");
    });
  } catch (ex) {
    console.log(ex);
  }
}

module.exports = {
  publisherReceive: receive,
  publisherSend: send,
};
