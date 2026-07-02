import { useParams, usePathname } from "next/navigation"

export const useCountryCode = (
  countryOptions?: {
    country: string | undefined
    region: string
    label: string | undefined
  }[]
) => {
  const pathName = usePathname()
  const params = useParams()

  const pathParts = pathName.replace(/^\//, "").split("/")
  const pathCountryCode =
    pathParts.length > 0 && pathParts[0].length === 2
      ? pathParts[0].toLowerCase()
      : undefined

  if (typeof params.countryCode === "string") {
    return params.countryCode
  }

  if (Array.isArray(params.countryCode) && typeof params.countryCode[0] === "string") {
    return params.countryCode[0]
  }

  if (countryOptions) {
    if (pathCountryCode) {
      const country = countryOptions.find(
        (option) => option.country === pathCountryCode
      )

      if (country?.country) {
        return country.country
      }
    }
  }

  return pathCountryCode
}
