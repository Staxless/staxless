"use client"

import { useTheme } from "@/contexts/ThemeContext"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function NotFound() {
  const colors = useTheme()

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: colors.background }}>
      <div className="text-center">
        <motion.div
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <Search size={120} style={{ color: colors.primary }} className="mx-auto mb-8" />
        </motion.div>
        <motion.h1
          className="text-6xl font-bold mb-4"
          style={{ color: colors.text }}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          404
        </motion.h1>
        <motion.p
          className="text-xl mb-8"
          style={{ color: colors.textMuted }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Oops! The page youre looking for doesnt exist.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <Link href="/" passHref>
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
                    Return Home!
              </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

