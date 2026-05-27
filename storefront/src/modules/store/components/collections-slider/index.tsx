import * as React from "react"
import Image from "next/image"

import { getCollectionsList } from "@lib/data/collections"
import { Carousel } from "@/components/Carousel"
import { LocalizedLink } from "@/components/LocalizedLink"
import { twMerge } from "tailwind-merge"

export const CollectionsSlider: React.FC<{
  heading?: React.ReactNode
  className?: string
  handles?: string[]
}> = async ({ heading = "Collections", className, handles }) => {
  const collections = await getCollectionsList(0, 20, [
    "id",
    "title",
    "handle",
    "metadata",
  ])

  const visibleCollections = handles
    ? collections.collections.filter((collection) =>
        handles.includes(collection.handle)
      )
    : collections.collections

  if (!collections || !visibleCollections.length) {
    return null
  }

  return (
    <Carousel
      heading={<h3 className="text-md md:text-2xl">{heading}</h3>}
      className={twMerge("mb-26 md:mb-36", className)}
    >
      {visibleCollections.map((c) => (
        <div
          key={c.id}
          className="w-[70%] sm:w-[60%] lg:w-full max-w-72 flex-shrink-0"
        >
          <LocalizedLink href={`/collections/${c.handle}`}>
            {typeof c.metadata?.image === "object" &&
              c.metadata.image &&
              "url" in c.metadata.image &&
              typeof c.metadata.image.url === "string" && (
                <div className="relative mb-4 md:mb-6 w-full aspect-[3/4] ">
                  <Image src={c.metadata.image.url} alt={c.title} fill className="rounded-lg"/>
                </div>
              )}
            <h3>{c.title}</h3>
          </LocalizedLink>
        </div>
      ))}
    </Carousel>
  )
}
