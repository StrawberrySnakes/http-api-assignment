const http = require('http');
const url = require('url');
const query = require("querystring");
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');
const { error } = require('console');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const handleGet = (request, response, parsedUrl) => {
  switch (parsedUrl.pathname) {
    case '/':
      htmlHandler.getIndex(request, response);
      break;
    case '/style.css':
      htmlHandler.getCSS(request, response);
      break;
    case '/success':
      jsonHandler.success(request, response);
      break;
    case '/badRequest':
      jsonHandler.badRequest(request, response, parsedUrl);
      break;
    case '/unauthorized':
      jsonHandler.unauthorized(request, response, parsedUrl);
      break;
    case '/forbidden':
      jsonHandler.forbidden(request, response);
      break;
    case '/internal':
      jsonHandler.internal(request, response);
      break;
    case '/notImplemented':
      jsonHandler.notImplemented(request, response);
      break;
    default:
      jsonHandler.notFound(request, response);
  }
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url, true);

  if(request.method === 'GET') {
    handleGet(request, response, parsedUrl);
  } else {
    response.writeHead(405, { 'Content-Type' : 'text.plain'});
    response.end('POST method not supported');
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});