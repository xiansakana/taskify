"use client";

import { Loader } from "lucide-react";
import React from "react";

const LoadingPage = () => {
  return (
    <div className="flex h-[calc(100vh-250px)] flex-col items-center justify-center ">
      <Loader className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
};

export default LoadingPage;
