"use client";

import { COLORS } from "@/constants/colors";
import { AppProgressProvider as ProgressProvider } from "@bprogress/next";

export const ProgressBarProvider = () => {
  return (
    <ProgressProvider
      height="4px"
      color={COLORS["primary-400"]}
      options={{ showSpinner: true }}
      shallowRouting
    />
  );
};
