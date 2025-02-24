export type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  message?: string;
};

export const successResponse = <T>(
  data: T,
  message = "Success",
): ActionResponse<T> => ({
  success: true,
  data,
  message,
});

export const errorResponse = (message: string): ActionResponse => ({
  success: false,
  message,
});
