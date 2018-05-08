const http = require('http');

const app = require('./server');

const PORT = process.env.PORT || 2009;

const server = http.createServer(app);

server.listen(PORT, ()=>{
  process.stdout.write(`Server listening on port: ${PORT}`);
})