//Helper to return the type json or xml
const getType = (request) => {
  const accept = request.headers.accept;
  if (accept && accept.includes('text/xml')) {
    return 'xml';
  }
  return 'json';
};

//Response function for json
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

//Response function for xml
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

//General response function
const respond = (request, response, status, message, id = null) => {
  const type = getType(request);

  if (type === 'xml') {
    let xml = `<response><message>${message}</message>`;
    if (id) {
      xml += `<id>${id}</id>`;
    }
    xml += `</response>`;
    respondXML(request, response, status, xml);
  } else {
    const obj = { message };
    if (id) obj.id = id;
    respondJSON(request, response, status, obj);
  }
};

// API Endpoints
const success = (request, response) => {
  respond(request, response, 200, 'This is a successful response');
};

const badRequest = (request, response, parsedUrl) => {
  if (!parsedUrl.query.valid || parsedUrl.query.valid !== 'true') {
    return respond(
      request,
      response,
      400,
      'Missing valid query parameter set to true',
      'badRequest'
    );
  }

  return respond(request, response, 200, 'This request has the required parameters');
};

const unauthorized = (request, response, parsedUrl) => {
  if (!parsedUrl.query.loggedIn || parsedUrl.query.loggedIn !== 'yes') {
    return respond(
      request,
      response,
      401,
      'Missing loggedIn query parameter set to yes',
      'unauthorized'
    );
  }

  return respond(request, response, 200, 'You have successfully viewed the content');
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
    'Internal Server Error. Something went wrong.',
    'internalError'
  );
};

const notImplemented = (request, response) => {
  respond(
    request,
    response,
    501,
    'A get request for this page has not been implemented yet. Check again later for updated content.',
    'notImplemented'
  );
};

const notFound = (request, response) => {
  respond(
    request,
    response,
    404,
    'The page you are looking for was not found.',
    'notFound'
  );
};

//exports
module.exports = {
  success,
  badRequest,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
  notFound,
};