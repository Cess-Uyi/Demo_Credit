class Response {
  static errorResponse(res, status, message, error) {
    res.status(status).json({
      response: message,
      status,
      error,
    });
  }

  static successResponse(res, status, message, data) {
    res.status(status).json({
      response: message,
      status,
      data,
    });
  }
}

module.exports = Response;
