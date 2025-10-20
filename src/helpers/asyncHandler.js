// Try_Catch Function to catch error and throw it to Error Handler
export const asyncHandler = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};
