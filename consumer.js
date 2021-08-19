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
    let message = "";
    await channel.consume("publisher-send", (msg) => {
      message = msg.content.toString();
    });
    return message;
  } catch (ex) {
    console.log(ex);
  }
}

module.exports = {
  consumerReceive: receive,
  consumerSend: send,
};
