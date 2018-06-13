// content of index.js
const http = require('http');
const port = 3003;

const requestHandler = (request: any, response: any) => {
  response.end('Hello yos Server!!! We are in '+ process.env.NODE_ENV);
};

const server = http.createServer(requestHandler);

server.listen(port, (err: any) => {
  if (err) {
    return console.error('something bad happened', err);
  }

  console.info(`server is listening on ${port}`);
});
