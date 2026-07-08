import { Metadata } from "next"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"

export const metadata: Metadata = {
  title: "Vêtements",
  description: "Découvrez toutes les créations vestimentaires OProcaccini.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
  params: Promise<{ countryCode: string }>
}

export default async function VetementsPage({ searchParams, params }: Params) {
  const { countryCode } = await params
  const { sortBy, page } = await searchParams

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={countryCode}
      title="Vêtements"
      emoji="👗"
      description="Robes, vestes et ensembles cousus main en éditions limitées."
      forcedType="Vêtements"
    />
  )
}

