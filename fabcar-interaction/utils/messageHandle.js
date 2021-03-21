exports.unauthorized = (reason) => ({
  success: false,
  code: 401,
  data: reason || 'AUTH.ERROR.NOT_LOGGED_IN',
});

exports.badRequest = (reason) => ({
  success: false,
  code: 400,
  data: reason || 'BAD_REQUEST',
});

exports.notFound = (reason) => ({
  success: false,
  code: 404,
  data: reason || 'NOT_FOUND',
});

exports.forbidden = (reason) => ({
  success: false,
  code: 403,
  data: reason || 'FORBIDDEN',
});

exports.serverError = (reason) => ({
  success: false,
  code: 500,
  data: reason || 'INTERNAL_SERVER_ERROR',
});

exports.tooMany = (reason) => ({
  success: false,
  code: 429,
  data: reason || 'TOO_MANY_REQUESTS',
});

exports.success = (data) => ({
  success: true,
  code: 200,
  data,
});
