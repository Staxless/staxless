"use client"

import { motion } from "framer-motion"
import { Cpu, Cloud, Zap } from "lucide-react"

const features = [
  {
    icon: Cpu,
    title: "Serverless Architecture",
    description: "Focus on your code, not on managing servers. Scale effortlessly with our serverless platform.",
  },
  {
    icon: Cloud,
    title: "Global CDN",
    description: "Deliver content lightning-fast to users anywhere in the world with our built-in CDN.",
  },
  {
    icon: Zap,
    title: "Instant Deployments",
    description: "Push your code and see it live in seconds. Continuous deployment made simple.",
  },
  {
    icon: Cpu,
    title: "Serverless Architecture",
    description: "Focus on your code, not on managing servers. Scale effortlessly with our serverless platform.",
  },
  {
    icon: Cloud,
    title: "Global CDN",
    description: "Deliver content lightning-fast to users anywhere in the world with our built-in CDN.",
  },
  {
    icon: Zap,
    title: "Instant Deployments",
    description: "Push your code and see it live in seconds. Continuous deployment made simple.",
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20 bg-[color:var(--color-accent)] relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.h2
          className="text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Why Choose Staxless?
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="text-center p-6 bg-[color:var(--color-background)] rounded-lg shadow-lg hover:shadow-[color:var(--color-primary)]/20 transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <feature.icon className="w-16 h-16 mx-auto mb-4 text-[color:var(--color-primary)] transition-transform duration-300 hover:scale-110" />
              <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-[color:var(--color-text-muted)]">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
    </section>
  )
}

