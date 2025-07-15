
export const getErrorMessage = (error, defaultMessage = "Something went wrong") => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    defaultMessage
  );
};
