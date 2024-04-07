console.log('Q', require('worker_threads').workerData);
console.log('XXX');
const path = require('path');
const { workerData } = require('worker_threads');
console.log('workerData', workerData);
require('ts-node').register();
require(path.resolve(__dirname, workerData.path));
