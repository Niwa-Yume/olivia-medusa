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
    collection?: string | string[]
    category?: string | string[]
    page?: string
  }>
  params: Promise<{ countryCode: string }>
}

export default async function AccessoiresPage({ searchParams, params }: Params) {
  const { countryCode } = await params
  const { sortBy, page, collection, category } = await searchParams

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={countryCode}
      title="Accessoires"
      forcedType="Accessoires"
      collection={
        !collection
          ? undefined
          : Array.isArray(collection)
            ? collection
            : [collection]
      }
      category={
        !category ? undefined : Array.isArray(category) ? category : [category]
      }
    />
  )
}

