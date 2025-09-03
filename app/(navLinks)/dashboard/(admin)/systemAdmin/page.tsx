"use client";
import React from 'react'
import { motion } from "framer-motion";
import Link from 'next/link'
import { Button } from "@/components/ui/button"

const page = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      {/* Animated Icon / Heading */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="text-5xl font-bold mb-4">
          🌱 System Administration <span className="text-primary block">Coming Soon</span>
        </h1>
      </motion.div>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-muted-foreground text-lg max-w-xl mb-8 font-mono"
      >
        System administrators can manage global settings, monitor system health,
        and access detailed analytics to make informed decisions.
        Stay tuned for updates on this exciting feature!
      </motion.p>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="flex gap-4"
      >
        <Link href="/dashboard">
          <Button
            variant="default"
            className="rounded-xl font-semibold text-white"
          >
            Back to Dashboard
          </Button>
        </Link>
        <Link href="/contact">
          <Button variant="outline" className="rounded-xl">
            Notify Me
          </Button>
        </Link>
      </motion.div>
    </div>

  );
}

export default page