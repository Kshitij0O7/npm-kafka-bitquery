const { Kafka } = require('kafkajs');
const fs = require("fs");
const path = require('path');
const { CompressionTypes, CompressionCodecs } = require("kafkajs");
const LZ4 = require("kafkajs-lz4");
// require('dotenv').config();

CompressionCodecs[CompressionTypes.LZ4] = new LZ4().codec;


const getStream = (_username, _password, _topic, groupName) => {
    // Pre-requisites
    const username = _username;
    const password = _password;
    const topic = _topic;

    const kafka = new Kafka({
      clientId: username,
      brokers: [
        "rpk0.bitquery.io:9092",
        "rpk1.bitquery.io:9092",
        "rpk2.bitquery.io:9092",
      ],
      sasl: {
        mechanism: "scram-sha-512",
        username: username,
        password: password,
      },
    });
    
    const consumer = kafka.consumer({
        groupId: username + "-" + groupName,
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