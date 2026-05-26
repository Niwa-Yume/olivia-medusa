import { Metadata } from "next"
import { StoreRegion } from "@medusajs/types"
import { listRegions } from "@lib/data/regions"
import { Layout, LayoutColumn } from "@/components/Layout"

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez-nous pour toute question sur nos créations.",
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

export default function InspirationPage() {
  return (
    <div className="max-md:pt-18 pb-26 md:pb-36">
      {/* ── Hero titre ── */}
      <div className="pt-16 md:pt-26 pb-16 md:pb-24 border-b border-grayscale-100">
        <Layout>
          <LayoutColumn start={1} end={{ base: 13, md: 9 }}>
            <p className=" text-xs uppercase tracking-widest mb-4 md:mb-6">
              Nous écrire
            </p>
            <h1 className="text-2xl md:text-4xl font-medium leading-tight">
              Une question sur une création,
              <br className="max-md:hidden" /> une commande ou un projet ?
            </h1>
          </LayoutColumn>
        </Layout>
      </div>

      {/* ── Contenu principal ── */}
      <Layout>
        {/* Formulaire */}
        <LayoutColumn start={1} end={{ base: 13, md: 8 }}>
          <div className="pt-16 md:pt-24">
            <ContactForm />
          </div>
        </LayoutColumn>

        {/* Infos de contact */}
        <LayoutColumn start={{ base: 1, md: 9 }} end={13}>
          <div className="pt-16 md:pt-24 max-md:border-t max-md:border-grayscale-100 md:pl-16 md:border-l md:border-grayscale-100">
            <div className="mb-12 md:mb-16">
              <p className="text-xs uppercase tracking-widest  mb-4">
                Atelier
              </p>
              <p className="text-md font-medium mb-1">OProcaccini</p>
              <p className="">Genève, Suisse</p>
            </div>

            <div className="mb-12 md:mb-16">
              <p className="text-xs uppercase tracking-widest  mb-4">
                E-mail
              </p>
              <a
                href="mailto:contact@oprocaccini.ch"
                className="text-md font-medium hover: transition-colors"
              >
                contact@oprocaccini.com
              </a>
            </div>

            <div className="mb-12 md:mb-16">
              <p className="text-xs uppercase tracking-widest  mb-4">
                Instagram
              </p>
              <a
                href="https://instagram.com/creations.procaccini"
                target="_blank"
                rel="noopener noreferrer"
                className="text-md font-medium hover: transition-colors"
              >
                @creations.procaccini
              </a>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest  mb-4">
                À noter
              </p>
              <p className=" text-sm leading-relaxed">
                Aucun retour ni échange possible.
                <br />
                Toutes les pièces sont des éditions
                <br />
                limitées cousues main.
              </p>
            </div>
          </div>
        </LayoutColumn>
      </Layout>
    </div>
  )
}

/* ── Formulaire ── */
function ContactForm() {
  return (
    <form
      action="mailto:contact@oprocaccini.com"
      method="POST"
      encType="text/plain"
      className="space-y-8"
    >
      {/* Nom + Prénom */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs uppercase tracking-widest  mb-3">
            Prénom
          </label>
          <input
            type="text"
            name="prenom"
            required
            placeholder="Votre prénom"
            className="w-full border-b border-grayscale-200 bg-transparent pb-3 text-sm  focus:border-black focus:outline-none transition-colors placeholder:text-white"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest  mb-3">
            Nom
          </label>
          <input
            type="text"
            name="nom"
            required
            placeholder="Votre nom"
            className="w-full border-b border-grayscale-200 bg-transparent pb-3 text-sm  focus:border-black focus:outline-none transition-colors placeholder:text-white"
          />
        </div>
      </div>

      {/* E-mail */}
      <div>
        <label className="block text-xs uppercase tracking-widest  mb-3">
          E-mail
        </label>
        <input
          type="email"
          name="email"
          required
          placeholder="votre@email.com"
          className="w-full border-b border-grayscale-200 bg-transparent pb-3 text-sm  focus:border-black focus:outline-none transition-colors placeholder:text-white"
        />
      </div>

      {/* Sujet */}
      <div>
        <label className="block text-xs uppercase tracking-widest mb-3">
          Sujet
        </label>
        <select
          name="sujet"
          className="[&:has(option[value='']:checked)]:text-white w-full border-b border-grayscale-200 bg-brand-salmon pb-3 text-sm  focus:border-black focus:outline-none transition-colors appearance-none cursor-pointer"
        >
          <option value="">Choisir un sujet</option>
          <option value="commande">Question sur une commande</option>
          <option value="produit">Question sur un produit</option>
          <option value="creation">Demande de création sur mesure</option>
          <option value="collaboration">Collaboration</option>
          <option value="autre">Autre</option>
        </select>
      </div>

      {/* Message */}
      <div>
        <label className="block text-xs uppercase tracking-widest  mb-3">
          Message
        </label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Votre message..."
          className="w-full border-b border-grayscale-200 bg-transparent pb-3 text-sm  focus:border-black focus:outline-none transition-colors resize-none placeholder:text-white"
        />
      </div>

      {/* Submit */}
      <div className="pt-4">
        <button
          type="submit"
          className="bg-black text-white text-xs uppercase tracking-widest px-10 py-4 hover:bg-grayscale-700 transition-colors"
        >
          Envoyer le message
        </button>
      </div>
    </form>
  )
}