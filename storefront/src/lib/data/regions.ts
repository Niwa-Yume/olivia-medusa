"use server"
import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"

export const listRegions = async function () {
  return sdk.client
    .fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
      method: "GET",
      next: { tags: ["regions"], revalidate: 300 },
      cache: "force-cache",
    })
    .then(({ regions }) => regions)
    .catch(medusaError)
}

export const retrieveRegion = async function (id: string) {
  return sdk.client
    .fetch<{ region: HttpTypes.StoreRegion }>(`/store/regions/${id}`, {
      method: "GET",
      next: { tags: [`regions`], revalidate: 300 },
      cache: "force-cache",
    })
    .then(({ region }) => region)
    .catch(medusaError)
}

const regionMap = new Map<string, HttpTypes.StoreRegion>()

export const getRegion = async function (countryCode: string) {
  try {
    const normalizedCountryCode = countryCode.toLowerCase()

    if (regionMap.has(normalizedCountryCode)) {
      return regionMap.get(normalizedCountryCode)
    }

    const regions = await listRegions()

    if (!regions) {
      return null
    }

    regions.forEach((region) => {
      region.countries?.forEach((c) => {
        regionMap.set(c?.iso_2 ?? "", region)
      })
    })

    const fallbackRegion =
      regionMap.get(normalizedCountryCode) ??
      regionMap.get("ch") ??
      regionMap.values().next().value

    return fallbackRegion ?? null
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return null
  }
}
