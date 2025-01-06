"use client";

import React from "react";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import useCurrentSession from "@/components/providers/session-provider";

const UserNavLogout = () => {
  const { logout, isPending } = useCurrentSession();

  const signout = async () => {
    logout();
  };

  return (
    <DropdownMenuItem onClick={signout} disabled={isPending}>
      Log out
    </DropdownMenuItem>
  );
};

export default UserNavLogout;
