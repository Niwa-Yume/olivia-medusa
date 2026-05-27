import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { CollectionsSlider } from "@modules/store/components/collections-slider"

import { getCollectionsList } from "@lib/data/collections"
import { getCategoriesList } from "@lib/data/categories"
import { getProductTypesList } from "@lib/data/product-types"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { getRegion } from "@lib/data/regions"

const normalizeLabel = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()

const StoreTemplate = async ({
  sortBy,
  collection,
  category,
  type,
  page,
  countryCode,
  title,
  forcedType,
  allowedCollectionHandles,
  allowedCategoryHandles,
}: {
  sortBy?: SortOptions
  collection?: string[]
  category?: string[]
  type?: string[]
  page?: string
  countryCode: string
  title?: string
  forcedType?: string
  allowedCollectionHandles?: string[]
  allowedCategoryHandles?: string[]
}) => {
  const pageNumber = page ? parseInt(page, 10) : 1

  const [collections, categories, types, region] = await Promise.all([
    getCollectionsList(0, 100, ["id", "title", "handle"]),
    getCategoriesList(0, 100, ["id", "name", "handle"]),
    getProductTypesList(0, 100, ["id", "value"]),
    getRegion(countryCode),
  ])

  // Si un type est imposé par la page, on le fusionne avec les query params éventuels
  const effectiveType = forcedType
    ? Array.from(new Set([...(type ?? []), forcedType]))
    : type

  const matchedTypeIds = !effectiveType
    ? undefined
    : types.productTypes
        .filter((t) =>
          effectiveType
            .map((value) => normalizeLabel(value))
            .includes(normalizeLabel(t.value))
        )
        .map((t) => t.id)

  const filteredCollections = allowedCollectionHandles
    ? collections.collections.filter((c) => allowedCollectionHandles.includes(c.handle))
    : collections.collections

  const visibleCollections = filteredCollections.length
    ? filteredCollections
    : collections.collections

  const filteredCategories = allowedCategoryHandles
    ? categories.product_categories.filter((c) =>
        allowedCategoryHandles.includes(c.handle)
      )
    : categories.product_categories

  const visibleCategories = filteredCategories.length
    ? filteredCategories
    : categories.product_categories

  const effectiveCollection = collection?.filter((handle) =>
    visibleCollections.some((c) => c.handle === handle)
  )

  const effectiveCategory = category?.filter((handle) =>
    visibleCategories.some((c) => c.handle === handle)
  )

  // Fallback: si le type forcé n'existe pas encore en DB, on n'applique pas le filtre type
  const effectiveTypeIds = matchedTypeIds?.length ? matchedTypeIds : undefined

  return (
    <div className="md:pt-47 py-26 md:pb-36">
      <CollectionsSlider
        handles={filteredCollections.length ? allowedCollectionHandles : undefined}
      />
      <RefinementList
        title={title}
        collections={Object.fromEntries(
          visibleCollections.map((c) => [c.handle, c.title])
        )}
        collection={effectiveCollection}
        categories={Object.fromEntries(
          visibleCategories.map((c) => [c.handle, c.name])
        )}
        category={effectiveCategory}
        // On masque le filtre type quand il est imposé par la page
        types={
          forcedType
            ? undefined
            : Object.fromEntries(types.productTypes.map((t) => [t.value, t.value]))
        }
        type={effectiveType}
        sortBy={sortBy}
      />
      <Suspense fallback={<SkeletonProductGrid />}>
        {region && (
          <PaginatedProducts
            sortBy={sortBy}
            page={pageNumber}
            countryCode={countryCode}
            collectionId={
              !effectiveCollection
                ? undefined
                : visibleCollections
                    .filter((c) => effectiveCollection.includes(c.handle))
                    .map((c) => c.id)
            }
            categoryId={
              !effectiveCategory
                ? undefined
                : visibleCategories
                    .filter((c) => effectiveCategory.includes(c.handle))
                    .map((c) => c.id)
            }
            typeId={effectiveTypeIds}
          />
        )}
      </Suspense>
    </div>
  )
}

export default StoreTemplate
