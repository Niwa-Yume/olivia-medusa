import { Metadata } from "next"
import { StoreRegion } from "@medusajs/types"
import { listRegions } from "@lib/data/regions"
import { FaqAccordion } from "@/components/FaqAccordion"

export const metadata: Metadata = {
  title: "FAQ",
  description: "Questions fréquemment posées — OProcaccini",
}

export async function generateStaticParams() {
  const countryCodes = await listRegions().then((regions: StoreRegion[]) =>
    regions.flatMap((r) =>
      r.countries
        ? r.countries
            .map((c) => c.iso_2)
            .filter(
              (value): value is string =>
                typeof value === "string" && Boolean(value)
            )
        : []
    )
  )
  return countryCodes.map((countryCode) => ({ countryCode }))
}

const faqItems = [
  {
    question: "Est-il possible de me contacter pour d'éventuelles questions ?",
    answer:
      "Oui, il est possible de me contacter sur mon adresse mail et sur tous mes différents réseaux sociaux.",
  },
  {
    question: "Les articles sont-ils échangeables ?",
    answer:
      "Non, les articles ne sont pas échangeables. Ce sont tous des articles en édition limitée, donc uniques.",
  },
  {
    question: "Est-il possible de retourner un article et d'être remboursé ?",
    answer:
      "Aucun retour n'est possible et donc aucun remboursement n'est prévu.",
  },
  {
    question: "Les vêtements sont-ils lavables ?",
    answer:
      "Les vêtements sont lavables en machine à 30 degrés. Il est conseillé d'utiliser un filet de lavage pour ne pas abîmer le vêtement.",
  },
  {
    question: "Est-il possible de repasser les vêtements ?",
    answer:
      "Oui, il est possible de les repasser, mais en plaçant un tissu en coton par-dessus pour protéger le vêtement.",
  },
]

export default function FaqPage() {
  return (
    <div className="min-h-screen">
      {/* Hero bannière mint */}
      <div
        className="w-full flex flex-col items-center justify-center py-20 md:py-32 px-6 text-center"
        style={{ backgroundColor: "#F9DEDF" }}
      >
        <p
          className="text-xs md:text-sm uppercase tracking-[0.2em] font-medium mb-4"
          style={{ color: "#3B1A1C99" }}
        >
          Questions fréquentes
        </p>
        <h1
          className="text-3xl md:text-5xl font-medium leading-tight"
          style={{ color: "#3B1A1C" }}
        >
          FAQ
        </h1>
        <p
          className="mt-4 text-sm md:text-base max-w-md"
          style={{ color: "#7A4F52" }}
        >
          Vous avez une question ? Retrouvez les réponses ci-dessous.
        </p>
      </div>

      {/* Contenu accordion */}
      <div className="pt-12 pb-24 md:pt-20 md:pb-36" style={{ backgroundColor: "#DBFEFD" }}>
        <div className="max-w-2xl mx-auto px-6">
          <FaqAccordion items={faqItems} />

          {/* CTA contact en bas */}
          <div
            className="mt-14 md:mt-20 rounded-2xl px-8 py-10 text-center"
            style={{ backgroundColor: "rgba(255,255,255,0.45)", border: "1.5px solid #3B1A1C33" }}
          >
            <p className="text-sm md:text-base font-medium mb-2" style={{ color: "#3B1A1C" }}>
              Vous n&apos;avez pas trouvé la réponse à votre question ?
            </p>
            <p className="text-sm" style={{ color: "#7A4F52" }}>
              Contactez-moi directement via mes réseaux sociaux ou par e-mail, je vous répondrai avec plaisir !
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
