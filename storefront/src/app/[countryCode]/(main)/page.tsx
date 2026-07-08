import { Metadata } from "next"
import Image from "next/image"
import { HttpTypes } from "@medusajs/types"
import { getRegion } from "@lib/data/regions"
import { getProductsList } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { LocalizedLink } from "@/components/LocalizedLink"
import Thumbnail from "@modules/products/components/thumbnail"

export const metadata: Metadata = {
  title: "OProcaccini",
  description: "Pièces uniques cousues main à Genève.",
}

const categories = [
  {
    title: "Vêtements",
    subtitle: "Robes · Vestes · Ensembles",
    href: "/vetements",
    image: "/images/content/OliviaVetements.jpeg",
  },
  {
    title: "Accessoires",
    subtitle: "Sacs · Ceintures · Foulards",
    href: "/accessoires",
    image: "/images/content/OliviaAccessoire.jpeg",
  },
  {
    title: "Bijoux",
    subtitle: "Colliers · Bracelets · Boucles",
    href: "/bijoux",
    image: "/images/content/OliviaBijoux.jpeg",
  },
] as const

function ProductCard({ product }: { product: HttpTypes.StoreProduct }) {
  const { cheapestPrice } = getProductPrice({ product })

  return (
    <LocalizedLink
      href={`/products/${product.handle}`}
      className="group rounded-2xl p-3 md:p-4 border border-black/10 bg-white/70 transition-transform hover:-translate-y-1"
    >
      <Thumbnail
        thumbnail={product.thumbnail}
        images={product.images}
        size="3/4"
        className="rounded-xl mb-3"
      />
      <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-text)" }}>
        {product.title}
      </p>
      <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
        {cheapestPrice?.calculated_price ?? "Prix sur demande"}
      </p>
    </LocalizedLink>
  )
}

export default async function Home({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const latestProductsResult = await getProductsList({
    countryCode,
    queryParams: {
      limit: 8,
      order: "-created_at",
      fields: "*variants.calculated_price",
    },
  })

  const latestProducts = latestProductsResult.response.products

  return (
    <div className="pt-18 md:pt-21">
      <div className="bg-brand-salmon text-center px-4 py-2 text-xs tracking-[0.18em] uppercase">
        🌿 Cousu main à Genève · Éditions limitées · Livraison Suisse
      </div>

      <section className="relative overflow-hidden bg-brand-mint px-4 py-16 md:py-24">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <p className="text-[30vw] leading-none font-serif italic text-black/10">OP</p>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="text-xs md:text-sm uppercase tracking-[0.25em] mb-6" style={{ color: "var(--color-text-muted)" }}>
            ✨ Cousu main · Genève
          </p>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif italic leading-tight mb-6" style={{ color: "var(--color-text)" }}>
            Pièces uniques pour un style <span className="not-italic">qui vous ressemble</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base mb-8" style={{ color: "var(--color-text-muted)" }}>
            Des créations haute couture en éditions limitées, pensées et assemblées avec soin. Chaque pièce porte une histoire, la vôtre.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <LocalizedLink href="/store" className="px-6 py-3 rounded-full bg-black text-white text-xs uppercase tracking-[0.08em]">
              🛍 Voir la boutique
            </LocalizedLink>
            <LocalizedLink href="/about" className="px-6 py-3 rounded-full border border-black text-xs uppercase tracking-[0.08em]">
              📖 Notre histoire
            </LocalizedLink>
          </div>
        </div>
      </section>

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
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                {item.body}
              </p>
            </div>
          </div>
        ))}
      </section>

      <section className="px-4 py-14 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <p className="inline-block text-xs uppercase tracking-[0.2em] rounded-full px-4 py-2 bg-brand-mint mb-4">
              Nos catégories
            </p>
            <h2 className="text-2xl md:text-4xl font-serif italic">Explorez nos créations</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {categories.map((category) => (
              <LocalizedLink
                key={category.href}
                href={category.href}
                className="rounded-3xl rounded-md border-black/10 overflow-hidden bg-white/75 transition-transform hover:-translate-y-1"
              >
                <div className="relative h-40 overflow-hidden rounded-sm bg-brand-mint/70">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="px-6 py-5">
                  <p className="text-xl font-serif italic mb-1">{category.title}</p>
                  <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--color-text-muted)" }}>
                    {category.subtitle}
                  </p>
                </div>
              </LocalizedLink>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-14 md:pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="inline-block text-xs uppercase tracking-[0.2em] rounded-full px-4 py-2 bg-brand-salmon mb-4">
              Dernières pièces
            </p>
            <h2 className="text-2xl md:text-4xl font-serif italic">Nouveautés</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {latestProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-8">
            <LocalizedLink href="/store" className="inline-flex rounded-full border border-black px-6 py-3 text-xs uppercase tracking-[0.1em]">
              Voir toute la boutique →
            </LocalizedLink>
          </div>
        </div>
      </section>

      <section className="px-4 pb-14 md:pb-20">
        <div className="max-w-6xl mx-auto rounded-3xl bg-[#3B1A1C] p-6 md:p-10 grid md:grid-cols-2 gap-8 rounded-md">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] mb-3 text-brand-mint">L&apos;atelier d&apos;Olivia</p>
            <h2 className="text-2xl md:text-4xl font-serif italic text-white mb-4">Haute couture cousue avec amour</h2>
            <p className="text-sm md:text-base text-white/70 mb-6">
              Chaque pièce naît dans mon atelier genevois : sélection des matières, patronage, coupe et finitions minutieuses.
            </p>
            <LocalizedLink href="/inspiration" className="inline-flex rounded-full bg-brand-salmon px-6 py-3 text-xs uppercase tracking-[0.1em]">
              ✨ Découvrir l&apos;histoire
            </LocalizedLink>
          </div>
          <div className="space-y-3">
            {[
              { emoji: "🧵", title: "Fait main", body: "Des finitions précises et soignées." },
              { emoji: "✨", title: "Édition limitée", body: "Des créations rares, en petite série." },
              { emoji: "🇨🇭", title: "Savoir-faire suisse", body: "Conçu et fabriqué à Genève." },
            ].map((value) => (
              <div key={value.title} className="rounded-2xl bg-white/10 p-4 flex gap-4">
                <span className="text-2xl">{value.emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-white">{value.title}</p>
                  <p className="text-xs text-white/70">{value.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
