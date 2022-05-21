require('dotenv').config();
const createServer = require('./Infrastructures/http/createServer');
const container = require('./Infrastructures/container');

(async () => {
  const server = await createServer(container);
  await server.start();
  console.log(`Original code by Prajnasatrya Sukur Suryanto (prajnasss@ymail.com)\nForum API\nServer running on: ${server.info.uri}`);
})();
