"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WebTitle } from "@/constants/WebTitle";

export default function GetStartedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-3xl w-full text-center"
      >
        {/* Hero Section */}
        <h1 className="text-4xl flex gap-2 justify-center font-bold mb-4">
          Welcome to <WebTitle/>
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          Smart IoT solutions for{" "}
          <span className="font-semibold">security</span> and{" "}
          <span className="font-semibold">real-time analytics</span>. Monitor,
          analyze, and protect your environment — all in one dashboard.
        </p>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-2">
          <Card className="rounded-2xl shadow-lg hover:shadow-2xl transition">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">🔒 Security Monitoring</h2>
              <p className="text-sm text-muted-foreground">
                Connect RFID, sensors, and cameras to detect threats instantly
                and manage access logs.
              </p>
              <Link href="/dashboard">
                <Button className="w-full rounded-xl font-semibold text-white">Go to Dashboard</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-lg hover:shadow-2xl transition">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">📊 Analytics & Insights</h2>
              <p className="text-sm text-muted-foreground">
                Get actionable insights with real-time analytics, reports, and
                anomaly detection.
              </p>
              <Link href="/analytics">
                <Button variant="outline" className="w-full rounded-xl">
                  View Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="mt-10 space-x-4">
          <Link href="/docs">
            <Button variant="outline">📖 Documentation</Button>
          </Link>
          <Link href="/contact">
            <Button className="font-semibold text-white">💬 Contact Us</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
