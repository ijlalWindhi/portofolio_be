import { filteredResponse } from "./filteredRespons.js";

function apiResponse(status, statusCode, message, data = null, error = null) {
  const response = {
    status,
    status_code: statusCode,
    message,
    data,
    error,
  };

  if (error) {
    delete response.data;
  } else {
    delete response.error;
  }

  console.log(response);
  return response;
}

// Success response handler
export async function successResponse(res, statusCode, message, data = {}) {
  res
    .status(statusCode)
    .json(
      apiResponse("success", statusCode, message, await filteredResponse(data))
    );
}

// Error response handler
export function errorResponse(res, statusCode, message, error = null) {
  res
    .status(statusCode)
    .json(apiResponse("error", statusCode, message, null, error));
}
