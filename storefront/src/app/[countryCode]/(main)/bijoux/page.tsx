import { Metadata } from "next"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"

export const metadata: Metadata = {
  title: "Bijoux",
  description: "Découvrez tous les bijoux faits main OProcaccini.",
}

const BIJOUX_COLLECTIONS = ["eclat-dore", "atelier-pierres"]
const BIJOUX_CATEGORIES = ["colliers", "bracelets", "boucles"]

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    collection?: string | string[]
    category?: string | string[]
    page?: string
  }>
  params: Promise<{ countryCode: string }>
}

export default async function BijouxPage({ searchParams, params }: Params) {
  const { countryCode } = await params
  const { sortBy, page, collection, category } = await searchParams

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={countryCode}
      title="Bijoux"
      forcedType="Bijoux"
      allowedCollectionHandles={BIJOUX_COLLECTIONS}
      allowedCategoryHandles={BIJOUX_CATEGORIES}
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

