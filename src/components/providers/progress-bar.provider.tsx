"use client";

import { AppProgressProvider as ProgressProvider } from "@bprogress/next";

export const ProgressBarProvider = () => {
  return (
    <ProgressProvider
      height="4px"
      color="#4F92FD"
      options={{ showSpinner: true }}
      shallowRouting
    />
  );
};
