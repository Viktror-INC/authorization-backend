import ApiError from "../exceprions/api-error";

const errorMiddleware = (error, request, response, next) => {
  console.log("error", error);

  return response
    .status(error.status || 500)
    .json({ message: error.message, error: error.errors || [] });
};

export default errorMiddleware;
