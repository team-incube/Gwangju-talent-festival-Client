"use client";

import { Toaster } from "sonner";
import React from "react";

type ToastProviderProps = {
  children: React.ReactNode;
};

export function ToastProvider({ children }: ToastProviderProps) {
  return (
    <>
      <Toaster position="top-right" richColors />
      {children}
    </>
  );
}
