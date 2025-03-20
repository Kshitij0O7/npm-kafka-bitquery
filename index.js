const { Kafka } = require('kafkajs');
const fs = require("fs");
const path = require('path');
const { CompressionTypes, CompressionCodecs } = require("kafkajs");
const LZ4 = require("kafkajs-lz4");
// require('dotenv').config();

CompressionCodecs[CompressionTypes.LZ4] = new LZ4().codec;


const getStream = (_username, _password, _topic) => {
    // Pre-requisites
    const username = _username;
    const password = _password;
    const topic = _topic;

    const filePathServer = path.resolve(__dirname, 'server.cer.pem');
    const filePathCert = path.resolve(__dirname, 'server.cer.pem');
    const filePathKey = path.resolve(__dirname, 'server.cer.pem');


    const kafka = new Kafka({
      clientId: username,
      brokers: [
        "rpk0.bitquery.io:9093",
        "rpk1.bitquery.io:9093",
        "rpk2.bitquery.io:9093",
      ],
      ssl: {
        rejectUnauthorized: false,
        ca: [fs.readFileSync(filePathServer, "utf-8")],
        key: fs.readFileSync(filePathKey, "utf-8"),
        cert: fs.readFileSync(filePathCert, "utf-8"),
      },
      sasl: {
        mechanism: "scram-sha-512",
        username: username,
        password: password,
      },
    });
    
    const consumer = kafka.consumer({
        groupId: username + "-my-group",
        sessionTimeout: 30000,
    });

    const run = async () => {
        await consumer.connect();
        await consumer.subscribe({ topic, fromBeginning: false });
    
        await consumer.run({
            autoCommit: false,
            eachMessage: async ({ partition, message }) => {
                try {
                    const buffer = message.value;
                    const logEntry = {
                      partition,
                      offset: message.offset,
                      value: JSON.parse(buffer.toString("utf-8")),
                    };
                    console.log(logEntry);
                } catch (err) {
                    console.error("Error processing message:", err);
                }
            },
        })
    };
    
    run().catch(console.error);
}

module.exports = { getStream };
// getStream("trontest1", "9ijSSnbrj7lldsqq1taSl3YOdujRWB", "tron.broadcasted.transactions");