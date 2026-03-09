"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  PenBox,
  LayoutDashboard,
  FileText,
  GraduationCap,
  ChevronDown,
  StarsIcon,
  Notebook
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserButton } from "@clerk/nextjs";

export function HeaderActions({ userId }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="w-20" />; // Placeholder to avoid layout shift
  }

  if (!userId) {
    return null;
  }

  return (
    <>
      <Link href="http://localhost:3001">
        <Button
          variant="outline"
          className="hidden md:inline-flex items-center gap-2"
        >
          <Notebook className="h-4 w-4" />
          <span className="hidden md:block">AI Course Builder</span>
        </Button>
      </Link>
      <Link href="/dashboard">
        <Button
          variant="outline"
          className="hidden md:inline-flex items-center gap-2"
        >
          <LayoutDashboard className="h-4 w-4" />
          Industry Insights
        </Button>
        <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
          <LayoutDashboard className="h-4 w-4" />
        </Button>
      </Link>

      {/* Growth Tools Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="flex items-center gap-2">
            <StarsIcon className="h-4 w-4" />
            <span className="hidden md:block">Growth Tools</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <Link href="/resume" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Build Resume
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/ai-cover-letter" className="flex items-center gap-2">
              <PenBox className="h-4 w-4" />
              Cover Letter
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/interview" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Interview Prep
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UserButton
        appearance={{
          elements: {
            avatarBox: "w-10 h-10",
            userButtonPopoverCard: "shadow-xl",
            userPreviewMainIdentifier: "font-semibold",
          },
        }}
      />
    </>
  );
}
