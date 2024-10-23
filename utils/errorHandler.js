// utils/errorHandler.js
export const handleError = (
  res,
  error,
  customMessage = "An error occurred"
) => {
  console.error({ customMessage, error: error.message });
  return res.status(500).json({
    message: customMessage,
    error: error.message,
  });
};
