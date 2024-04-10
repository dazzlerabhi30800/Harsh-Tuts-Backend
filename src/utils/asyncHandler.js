const asyncHandler2 = (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(requestHandler(res, req, next)).catch((err) => next(err));
  };
};

const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(res, req, next);
  } catch (err) {
    res.status(err.code || 500).json({
      success: false,
      message: err.message,
    });
  }
};

export { asyncHandler, asyncHandler2 };
