import { Metadata } from "next"
import Image from "next/image"
import { getRegion } from "@lib/data/regions"
// import { getProductTypesList } from "@lib/data/product-types"
import { Layout, LayoutColumn } from "@/components/Layout"
// import { LocalizedLink } from "@/components/LocalizedLink"
import { CollectionsSection } from "@/components/CollectionsSection"

export const metadata: Metadata = {
  title: "Medusa Next.js Starter Template",
  description:
    "A performant frontend ecommerce starter template with Next.js 14 and Medusa.",
}

// const ProductTypesSection: React.FC = async () => {
//   const productTypes = await getProductTypesList(0, 20, [
//     "id",
//     "value",
//     "metadata",
//   ])

//   if (!productTypes) {
//     return null
//   }

//   return (
//     <Layout className="mb-26 md:mb-36 max-md:gap-x-2">
//       {productTypes.productTypes.map((productType, index) => (
//         <LayoutColumn
//           key={productType.id}
//           start={index % 2 === 0 ? 1 : 7}
//           end={index % 2 === 0 ? 7 : 13}
//         >
//           <LocalizedLink href={`/store?type=${productType.value}`}>
//             {typeof productType.metadata?.image === "object" &&
//               productType.metadata.image &&
//               "url" in productType.metadata.image &&
//               typeof productType.metadata.image.url === "string" && (
//                 <Image
//                   src={productType.metadata.image.url}
//                   width={1200}
//                   height={900}
//                   alt={productType.value}
//                   className="mb-2 md:mb-8"
//                 />
//               )}
//             <p className="text-xs md:text-md">{productType.value}</p>
//           </LocalizedLink>
//         </LayoutColumn>
//       ))}
//     </Layout>
//   )
// }

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

  return (
    <>
      <div className="max-md:pt-18">
        <Image
          src="/images/content/living-room-gray-armchair-two-seater-sofa.png"
          width={2880}
          height={1500}
          alt="Living room with gray armchair and two-seater sofa"
          className="md:h-screen md:object-cover"
        />
      </div>
      <div className="pt-8 pb-26 md:pt-26 md:pb-36">
        <CollectionsSection className="mb-22 md:mb-36" />
        <Layout>
          <LayoutColumn className="col-span-full">
            <h3 className="text-md md:text-2xl mb-8 md:mb-16">
              Qui suis-je ?
            </h3>
          </LayoutColumn>
          <LayoutColumn start={1} end={{ base: 13, md: 7 }}>
            <h2 className="text-md md:text-2xl">
              La créativité! Une aventure en ligne entre vous et moi
            </h2>
            <Image
          src="/images/content/Olivia-whoami.jpg"
          width={390}
          height={700}
          alt="Olivia whoami"
          className="rounded-full md:object-cover ml-15 mt-5"
        />
          </LayoutColumn>
          <LayoutColumn
            start={{ base: 1, md: 8 }}
            end={13}
            className="mt-6 md:mt-19"
          >
            <div  className="mt-6 md:text-md">
              <p className="mb-5 md:mb-9">
                Une jeune fille née à Genève se révélant très créative, demanda pour son 12ème anniversaire une machine à coudre.
              </p>
              <p className="mb-5 md:mb-3">
                Ce fut le début de mon incroyable aventure.
Avec le soutien de mes parents, j’ai entrepris des études de « Haute Couture » Coupe-Couture section femme; Modéliste et Coupe-Couture section homme, ce sont les trois diplômes que j’ai obtenu durant mes cinq années d’études.
              </p>
              <p className="mb-5 md:mb-3">
                Mon entourage et mes amis qui ont participé à mes défilés et vu mes créations, m’ont vivement encouragé à créer ma propre marque de vêtements « OProcaccini ».
La mode étant ma passion, je souhaite la partager avec toutes et tous les passionnés comme moi.
Ma boutique de vente en ligne vous permettra de visualiser et d’accéder à toutes mes créations, allant du Vêtement Haute Couture, passant par tous types d’Accessoires et Bijoux faits main. 
              </p>
            </div>
          </LayoutColumn>
        </Layout>
      </div>
    </>
  )
}
