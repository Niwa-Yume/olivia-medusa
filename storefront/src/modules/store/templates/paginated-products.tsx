"use client"
import { HttpTypes, StoreProduct } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { NoResults } from "@modules/store/components/no-results.tsx"
import { withReactQueryProvider } from "@lib/util/react-query"
import * as React from "react"
import { useStoreProducts } from "hooks/store"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"

const PRODUCT_LIMIT = 12
function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  typeId,
  productsIds,
  countryCode,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string | string[]
  categoryId?: string | string[]
  typeId?: string | string[]
  productsIds?: string[]
  countryCode: string
}) {
  const queryParams: HttpTypes.StoreProductListParams = {
    limit: PRODUCT_LIMIT,
  }

  if (collectionId) {
    queryParams["collection_id"] = Array.isArray(collectionId)
      ? collectionId
      : [collectionId]
  }

  if (categoryId) {
    queryParams["category_id"] = Array.isArray(categoryId)
      ? categoryId
      : [categoryId]
  }

  if (typeId) {
    queryParams["type_id"] = Array.isArray(typeId) ? typeId : [typeId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  const productsQuery = useStoreProducts({
    page,
    queryParams,
    sortBy,
    countryCode,
  })
  const loadMoreRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!loadMoreRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && productsQuery.hasNextPage) {
          productsQuery.fetchNextPage()
        }
      },
      { rootMargin: "100px" }
    )

    observer.observe(loadMoreRef.current)
    return () => observer.disconnect()
  }, [productsQuery, loadMoreRef])

  if (productsQuery.isPending) {
    return <SkeletonProductGrid />
  }

  const allProducts = productsQuery?.data?.pages.flatMap(
    (p) => p?.response?.products ?? []
  ) ?? []

  const hasProducts =
    allProducts.length > 0 && (!productsIds || productsIds.length > 0)

  return (
    <>
      {hasProducts ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
          {allProducts.map((p: StoreProduct) => (
            <ProductPreview key={p.id} product={p} />
          ))}
          {productsQuery.hasNextPage && <div ref={loadMoreRef} />}
        </div>
      ) : (
        <NoResults />
      )}
    </>
  )
}

export default withReactQueryProvider(PaginatedProducts)
