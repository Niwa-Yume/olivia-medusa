"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-xl text-center">
        <p className="text-xs uppercase tracking-[0.2em] mb-4">Une erreur est survenue</p>
        <h2 className="text-2xl md:text-4xl font-serif italic mb-4">
          La page n&apos;a pas pu se charger
        </h2>
        <p className="text-sm md:text-base opacity-70 mb-6">
          Nous avons rencontré un problème temporaire. Vous pouvez réessayer ou revenir à l&apos;accueil.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-3 rounded-full bg-black text-white text-xs uppercase tracking-[0.08em]"
          >
            Réessayer
          </button>
          <Link
            href="/"
            className="px-6 py-3 rounded-full border border-black text-xs uppercase tracking-[0.08em]"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  )
}

