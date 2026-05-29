import { Metadata } from "next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Mona_Sans, Playfair_Display, Nunito } from "next/font/google"
import { getBaseURL } from "@lib/util/env"

import "../styles/globals.css"
import React from "react"
import { WebMCPProvider } from "@lib/webmcp/WebMCPProvider"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

const monaSans = Mona_Sans({
  preload: true,
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  weight: "variable",
  variable: "--font-mona-sans",
})

const playfairDisplay = Playfair_Display({
  preload: true,
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-playfair",
})

const nunito = Nunito({
  preload: true,
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
})

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light" className="antialiased">
      <body className={`${monaSans.variable} ${playfairDisplay.variable} ${nunito.variable} ${nunito.className}`}>
        <main className="relative">{props.children}</main>
        <SpeedInsights />
        <WebMCPProvider />
      </body>
    </html>
  )
}
