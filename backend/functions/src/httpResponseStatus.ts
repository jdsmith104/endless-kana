enum HTPPResponseStatus {
  OK = 200,
  CREATED = 201,
  FAILED = 500,
}

interface ErrorResponse {
  error: string;
  message: string;
  detail: string;
}

/**
 * Generate an ErrorResponse object
 * @param {string} error
 * @param {string} message
 * @param {string} detail
 * @return {ErrorResponse}
 */
function createErrorResponse(
  error: string,
  message: string,
  detail = '',
): ErrorResponse {
  return {error, message, detail};
}

export default HTPPResponseStatus;
export {createErrorResponse};
export type {ErrorResponse};
