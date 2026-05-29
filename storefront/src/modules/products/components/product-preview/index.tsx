import { HttpTypes } from "@medusajs/types"
import { LocalizedLink } from "@/components/LocalizedLink"
import Thumbnail from "@modules/products/components/thumbnail"
import { getProductPrice } from "@lib/util/get-product-price"

export default function ProductPreview({
  product,
}: {
  product: HttpTypes.StoreProduct
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  const hasReducedPrice =
    cheapestPrice &&
    cheapestPrice.calculated_price_number <
      (cheapestPrice?.original_price_number || 0)

  return (
    <LocalizedLink
      href={`/products/${product.handle}`}
      className="group rounded-2xl p-3 md:p-4 border border-black/10 bg-white/70 transition-transform hover:-translate-y-1 flex flex-col"
    >
      <Thumbnail
        thumbnail={product.thumbnail}
        images={product.images}
        size="3/4"
        className="rounded-xl mb-3"
      />
      <div className="flex-1 flex flex-col">
        <p
          className="text-sm font-semibold mb-1 leading-snug"
          style={{ color: "var(--color-text)" }}
        >
          {product.title}
        </p>
        {product.collection && (
          <p
            className="text-xs mb-2"
            style={{ color: "var(--color-text-muted)" }}
          >
            {product.collection.title}
          </p>
        )}
        <div className="mt-auto">
          {cheapestPrice ? (
            hasReducedPrice ? (
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold text-red-500">
                  {cheapestPrice.calculated_price}
                </p>
                <p
                  className="text-xs line-through"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {cheapestPrice.original_price}
                </p>
              </div>
            ) : (
              <p
                className="text-xs font-semibold"
                style={{ color: "var(--color-text-muted)" }}
              >
                {cheapestPrice.calculated_price}
              </p>
            )
          ) : (
            <p
              className="text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              Prix sur demande
            </p>
          )}
        </div>
      </div>
    </LocalizedLink>
  )
}
