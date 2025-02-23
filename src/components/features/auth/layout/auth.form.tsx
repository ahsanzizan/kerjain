"use client";

import { BottomBorderInput } from "@/components/common/border-bottom-input";
import { Text } from "@/components/common/text";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useZodForm } from "@/hooks/use-zod-form";
import { signIn } from "next-auth/react";
import { type z } from "zod";

interface AuthFormProps<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: z.ZodObject<any>;
  defaultValues: T;
  onSubmit: (values: T) => Promise<void>;
  fields: {
    name: keyof T;
    label: string;
    placeholder: string;
    type?: string;
  }[];
  submitLabel: string;
  loading: boolean;
}

const GoogleIcon = () => {
  return (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <title>Google</title>
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
    </svg>
  );
};

export const AuthForm = <T,>({
  schema,
  defaultValues,
  onSubmit,
  fields,
  submitLabel,
  loading,
}: AuthFormProps<T>) => {
  const form = useZodForm({
    schema,
    defaultValues: defaultValues as Record<string, unknown>,
    mode: "onBlur",
  });

  return (
    <Form {...form}>
      <form
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
        onSubmit={form.handleSubmit(onSubmit as any)}
        className="flex flex-col"
      >
        <Button
          variant={"outline"}
          type="button"
          className="w-full"
          onClick={async () => {
            await signIn("google", { redirectTo: "/" });
          }}
        >
          <GoogleIcon />
          Masuk dengan Google
        </Button>
        <div className="mt-8 flex items-center justify-between">
          <div className="h-[1px] w-[40%] rounded-full bg-text-400"></div>
          <Text variant="body" className="text-text-400">
            atau
          </Text>
          <div className="h-[1px] w-[40%] rounded-full bg-text-400"></div>
        </div>
        <div className="mt-12 flex flex-col gap-y-10">
          {fields.map(({ name, label, placeholder, type }) => (
            <FormField
              key={String(name)}
              control={form.control}
              name={name as string}
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-2">
                  <FormLabel htmlFor={String(name)}>{label}</FormLabel>
                  <FormControl>
                    <BottomBorderInput
                      {...field}
                      placeholder={placeholder}
                      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                      type={type || "text"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
        <Button
          disabled={loading}
          type="submit"
          className="mt-[3.75rem] w-full"
        >
          {submitLabel}
        </Button>
      </form>
    </Form>
  );
};
