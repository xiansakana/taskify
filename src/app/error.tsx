"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";

const ErrorPage = () => {
  return (
    <div className="flex h-[calc(100vh-250px)] flex-col items-center justify-center gap-y-2">
      <AlertTriangle className="size-10 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        Something went wrong
      </p>
      <Button
        variant="secondary"
        size="sm"
        asChild>
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
};

export default ErrorPage;
