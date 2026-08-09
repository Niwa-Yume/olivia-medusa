import * as React from "react"
import { listRegions } from "@lib/data/regions"
// import { SearchField } from "@/components/SearchField"
import { Layout, LayoutColumn } from "@/components/Layout"
import { LocalizedLink } from "@/components/LocalizedLink"
import { HeaderDrawer } from "@/components/HeaderDrawer"
// import { RegionSwitcher } from "@/components/RegionSwitcher"
import { HeaderWrapper } from "@/components/HeaderWrapper"

import dynamic from "next/dynamic"

// const LoginLink = dynamic(
//   () => import("@modules/header/components/LoginLink"),
//   { loading: () => <></> }
// )

const CartDrawer = dynamic(
  () => import("@/components/CartDrawer").then((mod) => mod.CartDrawer),
  { loading: () => <></> }
)

export const Header: React.FC = async () => {
  const regions = await listRegions()

  const countryOptions = regions
    .map((r) => {
      return (r.countries ?? []).map((c) => ({
        country: c.iso_2,
        region: r.id,
        label: c.display_name,
      }))
    })
    .flat()
    .sort((a, b) => (a?.label ?? "").localeCompare(b?.label ?? ""))

  return (
    <>
      <HeaderWrapper>
        <Layout>
          <LayoutColumn>
            <div className="flex justify-between items-center h-18 md:h-21">
              <h1 className="font-medium text-md">
                <LocalizedLink href="/">Oprocaccini</LocalizedLink>
              </h1>
              <div className="flex items-center gap-8 max-md:hidden">
                <LocalizedLink href="/vetements">Vêtements</LocalizedLink>
                <LocalizedLink href="/accessoires">Accessoires</LocalizedLink>
                <LocalizedLink href="/bijoux">Bijoux</LocalizedLink>
                <LocalizedLink href="/services">Services</LocalizedLink>
                <LocalizedLink href="/about">FAQ</LocalizedLink>
                <LocalizedLink href="/contact">Contact</LocalizedLink>
              </div>
              <div className="flex items-center gap-3 lg:gap-6 max-md:hidden">
                <CartDrawer />
              </div>
              <div className="flex items-center gap-4 md:hidden">
                <CartDrawer />
                <React.Suspense>
                  <HeaderDrawer countryOptions={countryOptions} />
                </React.Suspense>
              </div>
            </div>
          </LayoutColumn>
        </Layout>
      </HeaderWrapper>
    </>
  )
}



