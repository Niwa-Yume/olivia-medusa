import { Suspense } from "react"
import { LocalizedLink } from "@/components/LocalizedLink"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

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
  emoji,
  description,
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
  emoji?: string
  description?: string
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
    <div className="pt-18 md:pt-21">
      {/* Topbar */}
      <div className="bg-brand-salmon text-center px-4 py-2 text-xs tracking-[0.18em] uppercase">
        🌿 Cousu main à Genève · Éditions limitées · Livraison Suisse
      </div>

      {/* Hero section */}
      <section className="relative overflow-hidden bg-brand-mint px-4 py-12 md:py-18">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <p className="text-[22vw] leading-none font-serif italic text-black/10">
            {emoji ?? "✨"}
          </p>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="text-xs md:text-sm uppercase tracking-[0.25em] mb-4" style={{ color: "var(--color-text-muted)" }}>
            ✨ Cousu main · Genève
          </p>
          <h1 className="text-3xl md:text-5xl font-serif italic leading-tight mb-4" style={{ color: "var(--color-text)" }}>
            {title}
          </h1>
          {description && (
            <p className="text-sm md:text-base max-w-xl mx-auto" style={{ color: "var(--color-text-muted)" }}>
              {description}
            </p>
          )}
        </div>
      </section>

      {/* Trust band */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-y border-black/10">
        {[
          { emoji: "🧵", title: "Cousu main", body: "Chaque pièce à la main" },
          { emoji: "✨", title: "Éditions limitées", body: "Petites séries uniques" },
          { emoji: "🇨🇭", title: "Made in Switzerland", body: "Créé à Genève" },
          { emoji: "📦", title: "Livraison soignée", body: "Expédition en Suisse" },
        ].map((item) => (
          <div key={item.title} className="flex gap-3 px-6 py-5 border-r last:border-r-0 border-black/10 bg-brand-salmon/60">
            <span className="text-xl">{item.emoji}</span>
            <div>
              <p className="text-xs uppercase tracking-[0.08em] font-semibold">{item.title}</p>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{item.body}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Collections cards */}
      <section className="px-4 py-14 md:py-18">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <p className="inline-block text-xs uppercase tracking-[0.2em] rounded-full px-4 py-2 bg-brand-mint mb-4">
              Nos collections
            </p>
            <h2 className="text-2xl md:text-4xl font-serif italic" style={{ color: "var(--color-text)" }}>
              Explorez nos creations
            </h2>
            <p className="text-sm mt-3" style={{ color: "var(--color-text-muted)" }}>
              Des pieces uniques pour chaque occasion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                href: "/vetements",
                name: "Vetements",
                sub: "Hauts · Robes · Pantalons · Pulls",
                letter: "V",
                bg: "bg-brand-mint/70",
              },
              {
                href: "/accessoires",
                name: "Accessoires",
                sub: "Foulards · Sacs · Pochettes",
                letter: "A",
                bg: "bg-brand-salmon/70",
              },
              {
                href: "/bijoux",
                name: "Bijoux",
                sub: "Bracelets · Colliers · Porte-clefs",
                letter: "B",
                bg: "bg-brand-mint/70",
              },
            ].map((item) => (
              <LocalizedLink
                key={item.href}
                href={item.href}
                className="rounded-3xl border border-black/10 overflow-hidden bg-white/75 transition-transform hover:-translate-y-1"
              >
                <div className={`h-40 md:h-44 flex items-center justify-center ${item.bg}`}>
                  <span className="text-7xl md:text-8xl font-serif italic text-black/25">
                    {item.letter}
                  </span>
                </div>
                <div className="px-6 py-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xl font-serif italic mb-1" style={{ color: "var(--color-text)" }}>
                      {item.name}
                    </p>
                    <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--color-text-muted)" }}>
                      {item.sub}
                    </p>
                  </div>
                  <span className="w-9 h-9 rounded-full border border-black/20 flex items-center justify-center text-lg">
                    →
                  </span>
                </div>
              </LocalizedLink>
            ))}
          </div>
        </div>
      </section>

      {/* Products grid */}
      <div className="px-4 py-12 md:py-16 md:pb-28 max-w-6xl mx-auto">
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
    </div>
  )
}

export default StoreTemplate
