import { Card, CardContent } from "@/components/ui/card";
import { authors, AuthorsType } from "@/constants/authors";
import { Instagram } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen my-18 bg-background text-foreground">
      {/* Hero Section */}
      <section className="py-20 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">About Our Project</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-mono">
          We&apos;re building a modern RFID-based access control and monitoring
          system to make security seamless, efficient, and user-friendly.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="grid md:grid-cols-2 gap-6 px-6 max-w-5xl mx-auto mb-16">
        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-2 text-primary">
              Our Mission
            </h2>
            <p className="text-muted-foreground font-mono">
              To provide secure, reliable, and easy-to-use RFID access control
              solutions that empower organizations to manage and monitor entry
              effortlessly.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-2 text-primary">
              Our Vision
            </h2>
            <p className="text-muted-foreground font-mono">
              To innovate access control systems with real-time analytics and
              modern dashboards, enabling smarter security decisions.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Authors Section */}
      <section className="py-12 text-center">
        <h2 className="text-3xl font-bold mb-6">Authors</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {authors.map((author: AuthorsType) => (
            <div key={author.name}>
              <a
                href={author.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card shadow hover:bg-accent transition"
              >
                <Instagram className="h-5 w-5 text-pink-500" />
                <span className="font-medium">{author.name}</span>
              </a>
              <span className="text-xs text-muted-foreground/70">
                {author.role}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

