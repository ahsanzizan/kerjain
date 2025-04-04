"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  type UseFormProps,
  type UseFormReturn,
} from "react-hook-form";
import { type z, type ZodType } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UseZodFormProps<T extends ZodType<any, any>> = Omit<
  UseFormProps<z.infer<T>>,
  "resolver"
> & {
  schema: T;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useZodForm<T extends ZodType<any, any>>({
  schema,
  ...formConfig
}: UseZodFormProps<T>): UseFormReturn<z.infer<T>> {
  return useForm<z.infer<T>>({
    ...formConfig,
    resolver: zodResolver(schema),
  });
}
