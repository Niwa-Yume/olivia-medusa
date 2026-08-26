import { Metadata } from "next"
import { Layout, LayoutColumn } from "@/components/Layout"

export const metadata: Metadata = {
  title: "Services",
  description:
    "Retouches sur mesure et cours de crochet — les services proposés par OProcaccini.",
}

// ─────────────────────────────────────────────────────────────
// DONNÉES — Retouches
// ─────────────────────────────────────────────────────────────
type PriceItem = {
  label: string
  price: string
}

type PriceGroup = {
  title: string
  items: PriceItem[]
}

const RETOUCHES: PriceGroup[] = [
  {
    title: "Pantalons & Jeans",
    items: [
      { label: "Raccourcir pantalon jeans à la machine", price: "20 CHF" },
      { label: "Raccourcir pantalon (couture invisible)", price: "25 CHF" },
      { label: "Raccourcir pantalon avec revers", price: "25 CHF" },
      { label: "Rétrécir pantalon la taille", price: "25–35 CHF" },
      { label: "Rétrécir la taille avec ceinture", price: "40–50 CHF" },
      { label: "Changer fermeture éclaire", price: "30 CHF" },
    ],
  },
  {
    title: "Jupes, Robes & Chemises",
    items: [
      { label: "Raccourcir jupe, robe simple non doublée", price: "20–40 CHF" },
      { label: "Raccourcir jupe, robe doublée", price: "40–60 CHF" },
      { label: "Raccourcir manche simple ou doublée", price: "30–40 CHF" },
      { label: "Raccourcir manche avec poignet", price: "35 CHF" },
      { label: "Rétrécir côtés jupe, robe", price: "30–60 CHF" },
      { label: "Rétrécir côtés jupe avec ceinture", price: "35 CHF" },
      { label: "Rétrécir jupe côtés avec fermeture éclaire", price: "40 CHF" },
      { label: "Changer fermeture éclaire jupe, robe sans doublure", price: "30 CHF" },
      { label: "Changer fermeture éclaire jupe, robe avec doublure", price: "40 CHF" },
    ],
  },
  {
    title: "Vestes & Manteau",
    items: [
      { label: "Raccourcir les manches sans poignet", price: "40 CHF" },
      { label: "Raccourcir les manches avec poignet", price: "40 CHF" },
      { label: "Raccourcir les manches avec boutons", price: "60 CHF" },
      { label: "Raccourcir veste, manteau doublée", price: "50–60 CHF" },
    ],
  },
]

export default function ServicesPage() {
  return (
    <div className="max-md:pt-18 pb-26 md:pb-36">
      {/* ── Header ── */}


      {/* ═══════════════════════════════════════════════════════ */}
      {/* CATÉGORIE 1 — RETOUCHES                                  */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="pt-16 md:pt-24">
        <Layout>
          <LayoutColumn start={1} end={13}>
            <div className="flex items-baseline justify-between gap-4 mb-10 md:mb-16 pb-6 border-b border-grayscale-100">
              <h2 className="text-xl md:text-2xl font-medium">Retouches</h2>
              <p className="text-xs uppercase tracking-widest text-grayscale-500">
                Liste des prix
              </p>
            </div>
          </LayoutColumn>

          {RETOUCHES.map((group) => (
            <LayoutColumn key={group.title} start={1} end={13}>
              <div className="mb-2 md:mb-2">
                <h3 className="text-sm uppercase tracking-widest text-grayscale-500 mb-6 md:mb-8">
                  {group.title}
                </h3>
                <div className="divide-y divide-grayscale-100">
                  {group.items.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-baseline justify-between gap-6 py-4"
                    >
                      <p className="text-sm md:text-base">{item.label}</p>
                      <p className="text-sm md:text-base font-medium whitespace-nowrap">
                        {item.price}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </LayoutColumn>
          ))}
        </Layout>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* CATÉGORIE 2 — COURS DE CROCHET                            */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="pt-16 md:pt-24 mt-16 md:mt-24 border-t border-grayscale-100">
        <Layout>


          {/* Détails du cours */}
          <LayoutColumn start={1} end={{ base: 13, md: 8 }}>
            <h3 className="text-lg md:text-xl font-medium mb-6">
              Inscription cours de crochet
            </h3>

            <div className="space-y-4 mb-10">
              <div className="flex items-baseline justify-between gap-6 py-3 border-b border-grayscale-100">
                <p className="text-sm md:text-base">Tarif</p>
                <p className="text-sm md:text-base font-medium">
                  300 CHF / mois — 4 cours
                </p>
              </div>
              <div className="flex items-baseline justify-between gap-6 py-3 border-b border-grayscale-100">
                <p className="text-sm md:text-base">Fréquence</p>
                <p className="text-sm md:text-base font-medium">
                  1 fois par semaine
                </p>
              </div>
              <div className="flex items-baseline justify-between gap-6 py-3 border-b border-grayscale-100">
                <p className="text-sm md:text-base">Durée</p>
                <p className="text-sm md:text-base font-medium">3h par cours</p>
              </div>
              <div className="flex items-baseline justify-between gap-6 py-3 border-b border-grayscale-100">
                <p className="text-sm md:text-base">Projets</p>
                <p className="text-sm md:text-base font-medium">
                  5 projets à réaliser
                </p>
              </div>
            </div>

            <p className="text-sm text-grayscale-500 leading-relaxed max-w-135">
              Après 3 mois de cours, une attestation d&apos;acquisition de
              compétences en crochet est remise à l&apos;élève.<br />
              Pour un cours ponctuel, le tarif s&apos;élève à 25 francs de
              l&apos;heure.
            </p>
          </LayoutColumn>

          {/* Contact / inscription */}
          <LayoutColumn start={{ base: 1, md: 9 }} end={13}>
            <div className="md:pl-16 md:border-l md:border-grayscale-100 pt-10 md:pt-0 max-md:border-t max-md:border-grayscale-100 max-md:mt-10">
              <p className="text-xs uppercase tracking-widest text-grayscale-500 mb-4">
                Contact
              </p>
              <p className="text-md font-medium mb-1">Olivia Procaccini</p>
              <a
                href="tel:+41799302333"
                className="block text-grayscale-500 hover:text-black transition-colors mb-1"
              >
                +41 79 930 23 33
              </a>
              <a
                href="mailto:procacciniolivia@gmail.com"
                className="block text-grayscale-500 hover:text-black transition-colors mb-1 break-all"
              >
                procacciniolivia@gmail.com
              </a>
              <a
                href="https://instagram.com/olivia_prcn"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-grayscale-500 hover:text-black transition-colors"
              >
                @olivia_prcn
              </a>
            </div>
          </LayoutColumn>
        </Layout>
      </div>
    </div>
  )
}