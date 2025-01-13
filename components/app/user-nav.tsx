"use client";

import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useCurrentSession from "@/components/providers/session-provider";
import UserAvatar from "./user-avatar";
import UserNavLoading from "./user-nav-loading";
import UserNavLogout from "./user-nav-logout";
import { LoginButton } from "../marketing/layout/login-button";
import Subscribe from "../payments/subscribe";

export function UserNav() {
  const { session, status, isPending } = useCurrentSession();

  if (isPending) {
    return <UserNavLoading />;
  }

  if (!session.isLoggedIn || status === "error") {
    return <LoginButton size={"icon"} variant={"outline"} />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar userId={session.id} size={30} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="truncate font-medium text-sm leading-none">
              {session.username}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={`/app/settings/appearance`}>Appearance</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/app/referrals`}>Referrals</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Subscribe variant={"ghost"} />
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <UserNavLogout />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
