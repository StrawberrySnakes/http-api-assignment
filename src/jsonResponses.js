const respondJSON = (request, response, status, object) => {
  const content = JSON.stringify(object);

  response.writeHead(status, { 
    'Content-Type': 'application/json', 
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });

  if(request.method !== 'HEAD' || status !== 204) {
    response.write(JSON.stringify(object));
  }
  response.end();
};


module.exports = {
  
};
