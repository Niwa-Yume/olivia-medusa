import { Metadata } from "next"
import { redirect } from "next/navigation"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

export const metadata: Metadata = {
  title: "Store",
  description: "Explore all of our products.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    collection?: string | string[]
    category?: string | string[]
    type?: string | string[]
    page?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage({ searchParams, params }: Params) {
  const { countryCode } = await params
  const { sortBy, page, collection, category, type } = await searchParams

  const query = new URLSearchParams()
  if (sortBy) query.set("sortBy", sortBy)
  if (page) query.set("page", page)
  if (collection) {
    const values = Array.isArray(collection) ? collection : [collection]
    values.forEach((value) => query.append("collection", value))
  }
  if (category) {
    const values = Array.isArray(category) ? category : [category]
    values.forEach((value) => query.append("category", value))
  }
  if (type) {
    const values = Array.isArray(type) ? type : [type]
    values.forEach((value) => query.append("type", value))
  }

  const queryString = query.toString()
  redirect(`/${countryCode}/vetements${queryString ? `?${queryString}` : ""}`)
}
