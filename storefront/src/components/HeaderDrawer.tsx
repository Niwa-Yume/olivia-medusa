"use client"

import * as React from "react"
import { Button } from "@/components/Button"
import { Icon } from "@/components/Icon"
import { Drawer } from "@/components/Drawer"
import { LocalizedLink } from "@/components/LocalizedLink"
// import { RegionSwitcher } from "@/components/RegionSwitcher"
import { useSearchParams } from "next/navigation"

export const HeaderDrawer: React.FC<{
  countryOptions: {
    country: string | undefined
    region: string
    label: string | undefined
  }[]
}> = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("query")

  React.useEffect(() => {
    if (searchQuery) setIsMenuOpen(false)
  }, [searchQuery])

  return (
    <>
      <Button
        variant="ghost"
        className="p-1 group-data-[light=true]:md:text-white"
        onPress={() => setIsMenuOpen(true)}
        aria-label="Open menu"
      >
        <Icon name="menu" className="w-6 h-6" wrapperClassName="w-6 h-6" />
      </Button>
      <Drawer
        animateFrom="left"
        isOpen={isMenuOpen}
        onOpenChange={setIsMenuOpen}
        className="rounded-none !p-0"
      >
        {({ close }) => (
          <>
            <div className="flex flex-col text-white h-full">
              <div className="flex items-center justify-end pb-6 mb-8 pt-5 w-full border-b border-white px-8">
                <button onClick={close} aria-label="Close menu">
                  <Icon name="close" className="w-6" />
                </button>
              </div>
              <div className="text-lg flex flex-col gap-8 font-medium px-8">
                <LocalizedLink
                  href="/vetements"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Vêtements
                </LocalizedLink>
                <LocalizedLink
                  href="/accessoires"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Accessoires
                </LocalizedLink>
                <LocalizedLink
                  href="/bijoux"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Bijoux
                </LocalizedLink>
                <LocalizedLink
                  href="/services"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Services
                </LocalizedLink>
                <LocalizedLink
                  href="/about"
                  onClick={() => setIsMenuOpen(false)}
                >
                  FAQ
                </LocalizedLink>
                <LocalizedLink
                  href="/contact"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </LocalizedLink>
              </div>
            </div>
          </>
        )}
      </Drawer>
    </>
  )
}
