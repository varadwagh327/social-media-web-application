/**
 * Middleware to catch async errors in Express routes and pass to error handler
 * Wraps async functions to prevent unhandled promise rejections
 */
export const catchAsyncErrors = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default catchAsyncErrors;