"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { DocsSteps, DocsStepsType } from "@/constants/docs";

export default function DocsPage() {
  return (
    <div className="min-h-screen my-20 px-6 py-16 flex flex-col items-center">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold text-center mb-6"
      >
        AlertAxis <span className="text-primary">Docs</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-lg text-muted-foreground text-center mb-12 max-w-3xl"
      >
        Welcome to AlertAxis! 🚀 This guide will help you understand how the app
        works and walk you through the setup process to connect your device.
      </motion.p>

      {/* How It Works Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mb-16"
      >
        <Card className="rounded-2xl shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold mb-4">How the App Works</h2>
            <p className="text-muted-foreground leading-relaxed font-mono">
              AlertAxis connects your IoT security device to the cloud, allowing
              you to monitor real-time data, receive instant alerts, and analyze
              security reports from your phone. The app uses end-to-end
              encryption to keep your data safe while giving you full control
              over your connected devices.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Setup Steps Section */}
      <div className="max-w-4xl w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Getting Started: Connect Your Device
        </h2>
        <div className="grid gap-8 md:grid-cols-2">
          {DocsSteps.map((step: DocsStepsType, i: number) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
            >
              <Card className="rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-primary mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold">{step.title}</h3>
                      <p className="text-sm text-muted-foreground font-mono">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
