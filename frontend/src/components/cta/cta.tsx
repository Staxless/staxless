"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/contexts/ThemeContext"

export default function CTA() {
  const colors = useTheme()

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are already building amazing applications with Staxless.
          </p>
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
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
    </section>
  )
}

