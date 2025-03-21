# bit-kafka

**bit-kafka** is an npm package for consuming Kafka messages efficiently with low latency. The purpose behind creating this package is to allow people with low technical ability to use the Kafka solution.

## Installation

```sh
npm install bit-kafka
```

## Usage

```js
const {getStream} = require('bit-kafka');

getStream("<username>", "<password>", "<topic>", "<groupName>");
```

- \<username> & \<password>: The credentials to access the Kafka stream. To get your credentials contact -  sales@bitquery.io

- \<topic>: The topic name of the Kafka message that the user wants to subscribe.

- \<groupName>: Distinction for when multiple streams are accessed from one cluster(when one set of \<username> and \<password> are used). 

## Contributing
Contributions are welcome! Feel free to submit issues and pull requests.

## License
ISC License © 2025 bit-kafka

