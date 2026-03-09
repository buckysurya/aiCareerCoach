import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";
import { HeaderActions } from "./header-actions";
import Image from "next/image";
import { checkUser } from "@/lib/checkUser";

export default async function Header() {
  await checkUser();
  const { userId } = await auth();

  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <Image
            src={"/logo3.png"}
            alt="Sensai Logo"
            width={500}
            height={200}
            className="h-18 py-1 w-auto object-contain"
          />
        </Link>


        {/* Action Buttons */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <HeaderActions userId={userId} />
          {!userId && (
            <SignInButton mode="modal">
              <Button variant="outline">Sign In</Button>
            </SignInButton>
          )}
        </div>
      </nav>
    </header>
  );
}
