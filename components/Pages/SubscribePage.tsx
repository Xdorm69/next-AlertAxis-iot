"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function SubscribePage() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribed:", email);
    toast.success("You have subscribed to AlertAxis Blog!");
    setEmail("");
  };

  return (
    <section className="flex items-center justify-center my-42 bg-background px-4">
      <div className="w-6xl mx-auto">
        <div className="rounded-xl bg-transparent flex items-center justify-center md:block md:bg-[url('/bg.jpg')] md:bg-cover md:bg-center p-8">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">
                ✉️ Subscribe to Our Blog
              </CardTitle>
              <CardDescription className="font-mono">
                Get the latest updates, security tips, and exclusive insights
                delivered straight to your inbox.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 text-center">
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1"
                />
                <Button
                  type="submit"
                  className="bg-primary text-white hover:bg-primary/90 rounded-xl"
                >
                  Subscribe
                </Button>
              </form>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground/50">
              We respect your privacy. Unsubscribe anytime.
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
