"use client";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { UserButton } from "@clerk/nextjs";

export function ClerkBtns() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div className="w-7 h-7 bg-gray-700 rounded-full animate-pulse" />
    );
  }

  return isSignedIn ? (
    <UserButton
      appearance={{ elements: { userButtonBox: "w-7 h-7 rounded-full" } }}
    />
  ) : (
    <SignInButton>
      <Button className="text-white font-semibold w-full">Log in</Button>
    </SignInButton>
  );
}
