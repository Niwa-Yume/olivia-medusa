import { Metadata } from "next"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"

export const metadata: Metadata = {
  title: "Accessoires",
  description: "Découvrez tous les accessoires faits main OProcaccini.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
  params: Promise<{ countryCode: string }>
}

export default async function AccessoiresPage({ searchParams, params }: Params) {
  const { countryCode } = await params
  const { sortBy, page } = await searchParams

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={countryCode}
      title="Accessoires"
      emoji="👜"
      description="Sacs, ceintures et foulards faits main, chaque détail compte."
      forcedType="Accessoires"
    />
  )
}

