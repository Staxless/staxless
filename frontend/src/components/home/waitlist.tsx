/**
 * @file WaitlistHeroSimple Component
 * @module WaitlistHeroSimple
 * @description A React component that displays a section for users to join a waitlist by entering their email address.
 */

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { useTheme } from "@/contexts/ThemeContext"
import { Zap } from "lucide-react"

/**
 * @function WaitlistHeroSimple
 * @description Renders a section where users can join a waitlist by entering their email address.
 * @returns {JSX.Element} The WaitlistHeroSimple component
 */
export default function WaitlistHeroSimple(): JSX.Element {
  const [email, setEmail] = useState<string>("")
  const colors = useTheme()

  /**
   * @function handleSubmit
   * @description Handles the form submission for the waitlist.
   * @param {React.FormEvent} e - The form submission event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the email to your API
     
    toast({
      title: "You're on the list!",
      description: "We'll notify you when we launch. Stay tuned!",
    })
    setEmail("")
  }

  return (
    <section className="py-20" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ color: colors.primary }}>
            The Future of [Your Product] is Coming
          </h1>
          <p className="text-xl mb-8" style={{ color: colors.muted }}>
            Be the first to experience our revolutionary new platform. Join the waitlist today and get early access when
            we launch!
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="max-w-sm"
              required
              style={{
                backgroundColor: colors.secondary,
                color: colors.text,
                borderColor: colors.muted,
              }}
            />
            <Button
              type="submit"
              size="lg"
              style={{
                backgroundColor: colors.primary,
                color: colors.background,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.hover)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
            >
              Join the Waitlist
            </Button>
          </form>
          <p className="text-sm" style={{ color: colors.muted }}>
            Join {Math.floor(Math.random() * 900) + 100} others eagerly waiting. Limited spots available!
          </p>
        </div>
        <div className="mt-12 flex justify-center">
          <div className="rounded-lg p-6 inline-flex items-center" style={{ backgroundColor: `${colors.primary}1A` }}>
            <Zap className="w-6 h-6 mr-2" style={{ color: colors.primary }} />
            <span className="font-semibold" style={{ color: colors.primary }}>
              Early birds get 50% off at launch!
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

