"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="fr">
      <body>
        <div className="min-h-screen flex items-center justify-center px-4 bg-white text-black">
          <div className="max-w-xl text-center">
            <p className="text-xs uppercase tracking-[0.2em] mb-4">Erreur globale</p>
            <h2 className="text-2xl md:text-4xl font-serif italic mb-4">
              Le storefront a rencontré un problème
            </h2>
            <p className="text-sm md:text-base opacity-70 mb-2">
              {error.message || "Une erreur inattendue est survenue."}
            </p>
            <p className="text-xs opacity-50 mb-6">
              {error.digest ? `Référence: ${error.digest}` : null}
            </p>
            <button
              type="button"
              onClick={() => reset()}
              className="px-6 py-3 rounded-full bg-black text-white text-xs uppercase tracking-[0.08em]"
            >
              Réessayer
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}

