import { redirect } from "next/navigation";
import React from "react";

import { SignUpCard } from "@/features/auth/components/sign-up-card";
import { getCurrent } from "@/features/auth/queries";

export const dynamic = "force-dynamic";

const SignUpPage = async () => {
  const user = await getCurrent();
  if (user) redirect("/");
  return <SignUpCard />;
};

export default SignUpPage;
