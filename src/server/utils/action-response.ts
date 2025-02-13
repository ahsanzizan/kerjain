export type ApiResponse<T = null> = {
  success: boolean;
  data?: T;
  message?: string;
};

export const successResponse = <T>(
  data: T,
  message = "Success",
): ApiResponse<T> => ({
  success: true,
  data,
  message,
});

export const errorResponse = (message: string): ApiResponse => ({
  success: false,
  message,
});
