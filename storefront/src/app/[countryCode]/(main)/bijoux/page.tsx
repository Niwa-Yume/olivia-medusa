import { Metadata } from "next"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"

export const metadata: Metadata = {
  title: "Bijoux",
  description: "Découvrez tous les bijoux faits main OProcaccini.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
  params: Promise<{ countryCode: string }>
}

export default async function BijouxPage({ searchParams, params }: Params) {
  const { countryCode } = await params
  const { sortBy, page } = await searchParams

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={countryCode}
      title="Bijoux"
      emoji="💍"
      description="Colliers, bracelets et boucles artisanaux, forgés avec soin."
      forcedType="Bijoux"
    />
  )
}

