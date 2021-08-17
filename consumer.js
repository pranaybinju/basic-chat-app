const amqp = require("amqplib");

//send();

async function send() {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    const result = await channel.assertQueue("consumer-send");
    channel.sendToQueue("consumer-send", Buffer.from("Hello from consumer"));
  } catch (ex) {
    console.log(ex);
  }
}

//receive();
async function receive() {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    const result = await channel.assertQueue("publisher-send");
    channel.consume("publisher-send", (msg) => {
      console.log("From consumer with love");
      console.log(msg.content.toString());
    });
    console.log("Message received");
  } catch (ex) {
    console.log(ex);
  }
}

module.exports = {
  consumerReceive: receive,
  consumerSend: send,
};
