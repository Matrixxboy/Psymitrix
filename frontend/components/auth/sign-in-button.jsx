"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function SignInButton({ className }) {
  return (
    <Button asChild className={className}>
      <Link href="/login">Sign In</Link>
    </Button>
  );
}
