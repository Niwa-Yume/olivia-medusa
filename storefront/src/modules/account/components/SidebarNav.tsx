"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { twJoin } from "tailwind-merge"

import { LocalizedLink } from "@/components/LocalizedLink"

export const SidebarNav: React.FC = () => {
  const pathName = usePathname()
  const currentPath =
    pathName.replace(/^\/[a-z]{2}(?=\/|$)/i, "") || "/"

  return (
    <>
      <LocalizedLink
        href="/account"
        className={twJoin(
          "inline-flex items-start py-4 max-md:whitespace-nowrap",
          currentPath === "/account" && "font-semibold"
        )}
      >
        Personal &amp; security
      </LocalizedLink>
      <LocalizedLink
        href="/account/my-orders"
        className={twJoin(
          "inline-flex items-start py-4 max-md:whitespace-nowrap",
          currentPath.startsWith("/account/my-orders") && "font-semibold"
        )}
      >
        My orders
      </LocalizedLink>
    </>
  )
}
