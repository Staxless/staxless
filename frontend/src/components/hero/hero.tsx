"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/contexts/ThemeContext"

export default function Hero() {
  const colors = useTheme()
  return (
    <section className="py-32 text-center relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.h1
          className="text-6xl md:text-7xl font-bold mb-6 glitch-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Build Without Limits
        </motion.h1>
        <motion.p
          className="text-xl mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Staxless empowers developers to create scalable applications with ease. No more infrastructure headaches, just
          pure coding joy.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
              <Button
                style={{
                  backgroundColor: colors.primary,
                  color: colors.background,
                  border: `2px solid ${colors.text}`,
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  transition: "all 0.3s ease",
                }}
                className="px-6 py-3 text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.background
                  e.currentTarget.style.color = colors.primary
                  e.currentTarget.style.transform = "translate(2px, 2px)"
                  e.currentTarget.style.boxShadow = "2px 2px 0px 0px rgba(0,0,0,1)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primary
                  e.currentTarget.style.color = colors.background
                  e.currentTarget.style.transform = "translate(0, 0)"
                  e.currentTarget.style.boxShadow = "4px 4px 0px 0px rgba(0,0,0,1)"
                }}
              >
                Get Started
              </Button>
        </motion.div>
      </div>
      <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 gap-2 opacity-10">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="bg-[var(--color-primary)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: Math.random() }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          />
        ))}
      </div>
    </section>
  )
}

