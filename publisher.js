require("isomorphic-fetch");
const amqp = require("amqplib");

send();

async function send() {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    const result = await channel.assertQueue("publisher-send");
    const message = await fetch(
      " https://t0rlh3a3bj.execute-api.ap-south-1.amazonaws.com/stage"
    );
    const parsedMsg = await message.json();
    console.log(parsedMsg);
    channel.sendToQueue("publisher-send", Buffer.from(parsedMsg));
    console.log("Message sent");
  } catch (ex) {
    console.log(ex);
  }
}

receive();

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
