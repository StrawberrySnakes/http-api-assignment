const query = require('querystring');

const getType = (request) => {
  const accept = request.headers.accept;
  if (accept && accept.includes('text/xml')) {
    return 'xml';
  }
  return 'json';
};

const respondJSON = (request, response, status, object) => {
  const content = JSON.stringify(object);

  response.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });

  if (request.method !== 'HEAD') {
    response.write(content);
  }

  response.end();
};


const respondXML = (request, response, status, xmlString) => {
  response.writeHead(status, {
    'Content-Type': 'text/xml',
    'Content-Length': Buffer.byteLength(xmlString, 'utf8'),
  });

  if (request.method !== 'HEAD') {
    response.write(xmlString);
  }

  response.end();
};


const buildXML = (message, id = null) => {
  let xml = `<response><message>${message}</message>`;
  if (id) {
    xml += `<id>${id}</id>`;
  }
  xml += `</response>`;
  return xml;
};

const respond = (request, response, status, message, id = null) => {
  const type = getType(request);

  if (type === 'xml') {
    const xml = buildXML(message, id);
    respondXML(request, response, status, xml);
  } else {
    const obj = { message };
    if (id) obj.id = id;
    respondJSON(request, response, status, obj);
  }
};


const success = (request, response) => {
  respond(request, response, 200, 'This request was successful');
};

const badRequest = (request, response, parsedUrl) => {
  const params = query.parse(parsedUrl.search.substring(1));

  if (params.valid !== 'true') {
    respond(
      request,
      response,
      400,
      'Missing valid query parameter',
      'badRequest'
    );
    return;
  }

  respond(
    request,
    response,
    200,
    'Valid query parameter present'
  );
};

const unauthorized = (request, response, parsedUrl) => {
  const params = query.parse(parsedUrl.search.substring(1));

  if (params.loggedIn !== 'yes') {
    respond(
      request,
      response,
      401,
      'User is not logged in',
      'unauthorized'
    );
    return;
  }

  respond(
    request,
    response,
    200,
    'User successfully authenticated'
  );
};

const forbidden = (request, response) => {
  respond(
    request,
    response,
    403,
    'You do not have access to this content',
    'forbidden'
  );
};

const internal = (request, response) => {
  respond(
    request,
    response,
    500,
    'Internal server error',
    'internal'
  );
};

const notImplemented = (request, response) => {
  respond(
    request,
    response,
    501,
    'This functionality has not been implemented',
    'notImplemented'
  );
};

const notFound = (request, response) => {
  respond(
    request,
    response,
    404,
    'The requested resource was not found',
    'notFound'
  );
};

module.exports = {
  success,
  badRequest,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
  notFound,
};
