"use client"

import { useState } from "react"

type FaqItem = {
  question: string
  answer: string
}

type FaqAccordionProps = {
  items: FaqItem[]
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="divide-y" style={{ borderColor: "#3B1A1C33" }}>
      {items.map((item, index) => {
        const isOpen = openIndex === index
        return (
          <div key={index}>
            <button
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between py-5 md:py-6 text-left gap-4 group"
              aria-expanded={isOpen}
            >
              <span
                className="text-sm md:text-base font-medium"
                style={{ color: "var(--color-text)" }}
              >
                {item.question}
              </span>
              {/* Plus / Minus icon */}
              <span
                className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-200"
                style={{
                  backgroundColor: isOpen ? "#C4FDFB" : "transparent",
                  border: "1.5px solid var(--color-text)",
                  color: "var(--color-text)",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className={`transition-transform duration-300 ${isOpen ? "rotate-45" : "rotate-0"}`}
                >
                  <line x1="7" y1="1" x2="7" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="1" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
            </button>

            {/* Animated answer panel */}
            <div
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{ maxHeight: isOpen ? "400px" : "0px", opacity: isOpen ? 1 : 0 }}
            >
              <p
                className="pb-6 text-sm md:text-base leading-relaxed"
                style={{ color: "var(--color-text-muted)" }}
              >
                {item.answer}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

