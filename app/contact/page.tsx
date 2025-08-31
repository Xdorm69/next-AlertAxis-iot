"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Instagram } from "lucide-react";
import { authors, AuthorsType } from "@/constants/authors";

export default function ContactPage() {
  return (
    <div className="min-h-screen my-20 flex flex-col items-center px-6 py-16">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold text-center mb-4"
      >
        Meet the <span className="text-primary">AlertAxis</span> Team
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-muted-foreground text-lg text-center mb-12 max-w-2xl"
      >
        We’re building IoT-powered security and analytics solutions. Feel free
        to reach out and connect with us!
      </motion.p>

      {/* Team Cards */}
      <div className="grid gap-8 md:grid-cols-3">
        {authors.map((author: AuthorsType, i: number) => (
          <motion.div
            key={author.name}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2, duration: 0.6 }}
          >
            <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 flex flex-col items-center text-center">
                {/* Avatar Placeholder */}
                <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  {author.name.split(" ")[0][0]}
                  {author.name.split(" ")[1]
                    ? author.name.split(" ")[1][0]
                    : ""}
                </div>

                <h2 className="text-xl font-semibold">{author.name}</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  {author.role}
                </p>

                {/* Instagram Link */}
                <a
                  href={author.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <Instagram className="w-5 h-5" />
                  Instagram
                </a>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
