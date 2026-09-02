import { Metadata } from "next"
import { LocalizedLink } from "@/components/LocalizedLink"

export const metadata: Metadata = {
  title: "Contact — OProcaccini",
  description: "Contactez Olivia Procaccini pour toute question sur vos commandes ou créations.",
}

export default function ContactPage() {
  return (
    <div className="pt-18 md:pt-21">
      {/* Topbar */}
      <div className="bg-brand-salmon text-center px-4 py-2 text-xs tracking-[0.18em] uppercase">
        🌿 Cousu main à Genève · Éditions limitées · Livraison Suisse
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-mint px-4 py-14 md:py-22">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <p className="text-[22vw] leading-none font-serif italic text-black/10">✉</p>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="text-xs md:text-sm uppercase tracking-[0.25em] mb-4" style={{ color: "var(--color-text-muted)" }}>
            💌 Parlons-nous
          </p>
          <h1 className="text-3xl md:text-5xl font-serif italic leading-tight mb-4" style={{ color: "var(--color-text)" }}>
            Contactez-nous
          </h1>
          <p className="text-sm md:text-base max-w-xl mx-auto" style={{ color: "var(--color-text-muted)" }}>
            Une question sur une pièce, une commande ou un projet sur mesure ? Olivia vous répond avec plaisir.
          </p>
        </div>
      </section>

      {/* Trust band */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-y border-black/10">
        {[
          { emoji: "⏱", title: "Réponse rapide", body: "Sous 24-48h en semaine" },
          { emoji: "💌", title: "E-mail", body: "contact@oprocaccini.com" },
          { emoji: "📸", title: "Instagram", body: "@creations.procaccini" },
          { emoji: "🇨🇭", title: "Basée à Genève", body: "Suisse · Europe" },
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

      {/* Contact form + Info */}
      <section className="px-4 py-14 md:py-20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            <p className="inline-block text-xs uppercase tracking-[0.2em] rounded-full px-4 py-2 bg-brand-mint mb-6">
              Formulaire de contact
            </p>
            <h2 className="text-2xl md:text-3xl font-serif italic mb-8" style={{ color: "var(--color-text)" }}>
              Envoyez-nous un message
            </h2>
            <form className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-[0.1em] mb-2" style={{ color: "var(--color-text-muted)" }}>
                    Prénom
                  </label>
                  <input
                    type="text"
                    name="firstname"
                    placeholder="Votre prénom"
                    className="w-full rounded-xl border border-black/15 bg-white/70 px-4 py-3 text-sm outline-none focus:border-black/40 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.1em] mb-2" style={{ color: "var(--color-text-muted)" }}>
                    Nom
                  </label>
                  <input
                    type="text"
                    name="lastname"
                    placeholder="Votre nom"
                    className="w-full rounded-xl border border-black/15 bg-white/70 px-4 py-3 text-sm outline-none focus:border-black/40 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.1em] mb-2" style={{ color: "var(--color-text-muted)" }}>
                  E-mail
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="votre@email.com"
                  className="w-full rounded-xl border border-black/15 bg-white/70 px-4 py-3 text-sm outline-none focus:border-black/40 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.1em] mb-2" style={{ color: "var(--color-text-muted)" }}>
                  Sujet
                </label>
                <select
                  name="subject"
                  className="w-full rounded-xl border border-black/15 bg-white/70 px-4 py-3 text-sm outline-none focus:border-black/40 transition-colors"
                >
                  <option value="">Choisissez un sujet…</option>
                  <option value="commande">Question sur une commande</option>
                  <option value="produit">Question sur un produit</option>
                  <option value="mesure">Création sur mesure</option>
                  <option value="retour">Retour / échange</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.1em] mb-2" style={{ color: "var(--color-text-muted)" }}>
                  Message
                </label>
                <textarea
                  name="message"
                  rows={5}
                  placeholder="Écrivez votre message ici…"
                  className="w-full rounded-xl border border-black/15 bg-white/70 px-4 py-3 text-sm outline-none focus:border-black/40 transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-black text-white text-xs uppercase tracking-[0.1em] px-6 py-4 transition-opacity hover:opacity-80"
              >
                💌 Envoyer le message
              </button>
            </form>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6">
            <div className="rounded-3xl bg-brand-mint/70 p-6 md:p-8">
              <h3 className="text-xl font-serif italic mb-4" style={{ color: "var(--color-text)" }}>
                L&apos;atelier d&apos;Olivia
              </h3>
              <p className="text-sm mb-5" style={{ color: "var(--color-text-muted)" }}>
                Toutes les créations sont réalisées à la main dans mon atelier à Genève. Je suis disponible pour répondre à vos questions du lundi au vendredi.
              </p>
              <div className="space-y-3">
                {[
                  { emoji: "📍", label: "Localisation", value: "Genève, Suisse" },
                  { emoji: "⏱", label: "Délai de réponse", value: "24 à 48h en semaine" },
                  { emoji: "🌐", label: "Langues", value: "Français · Anglais · Italien" },
                ].map((info) => (
                  <div key={info.label} className="flex items-start gap-3">
                    <span className="text-lg">{info.emoji}</span>
                    <div>
                      <p className="text-xs uppercase tracking-[0.08em] font-semibold">{info.label}</p>
                      <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-[#3B1A1C] p-6 md:p-8">
              <p className="text-xs uppercase tracking-[0.2em] mb-3 text-brand-mint">Créations sur mesure</p>
              <h3 className="text-xl font-serif italic text-white mb-4">
                Un projet unique ?
              </h3>
              <p className="text-sm text-white/70 mb-5">
                Olivia réalise des pièces sur mesure pour les occasions spéciales : robes de soirée, pièces de mariage, cadeaux personnalisés.
              </p>
              <LocalizedLink
                href="/about"
                className="inline-flex rounded-full bg-brand-salmon px-5 py-3 text-xs uppercase tracking-[0.1em]"
              >
                ✨ En savoir plus
              </LocalizedLink>
            </div>

            <div className="rounded-3xl border border-black/10 bg-white/70 p-6">
              <h3 className="text-lg font-serif italic mb-3" style={{ color: "var(--color-text)" }}>
                Questions fréquentes
              </h3>
              <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>
                Avant d&apos;écrire, consultez peut-être notre FAQ — votre réponse s&apos;y trouve sûrement !
              </p>
              <LocalizedLink
                href="/about"
                className="inline-flex rounded-full border border-black px-5 py-3 text-xs uppercase tracking-[0.1em]"
              >
                📖 Voir la FAQ
              </LocalizedLink>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram section */}
      <section className="bg-brand-mint/70 px-4 py-12 text-center">
        <h2 className="text-2xl md:text-3xl font-serif italic mb-2">Suivez les créations</h2>
        <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>
          @creations.procaccini
        </p>
        <div className="max-w-2xl mx-auto grid grid-cols-5 gap-3 text-2xl">
          {["🌸", "🧵", "✨", "👗", "💛"].map((emoji) => (
            <div key={emoji} className="aspect-square rounded-xl bg-white/70 flex items-center justify-center">
              {emoji}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

