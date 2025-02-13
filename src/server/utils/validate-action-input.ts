import { type Schema } from "zod";

export const validateActionInput = <T>(input: unknown, schema: Schema) => {
  return schema.parse(input) as T;
};
