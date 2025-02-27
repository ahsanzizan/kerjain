import { Text } from "@/components/common/text";
import { type FC, type ReactNode } from "react";

export const SectionTag: FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <Text
      className="mb-3 w-fit rounded-full bg-primary-100 px-4 py-1 text-primary-500"
      variant="body"
    >
      {children}
    </Text>
  );
};
