import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/Providers/ThemeProvider";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";
import Preloader from "@/components/PagePreloader";

export const metadata: Metadata = {
  title: "AlertAxis",
  description: "AlertAxis",
};

export const inter = Inter({
  variable: "--font-inter",
  weight: ["100", "400", "900"],
  subsets: ["latin"], // explicitly specify subsets
  display: "swap",
});

// JetBrains Mono
export const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  weight: ["100", "400", "800"],
  subsets: ["latin"], // explicitly specify subsets
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInForceRedirectUrl="/sync"
      signUpForceRedirectUrl="/sync"
      signInFallbackRedirectUrl="/sync"
      signUpFallbackRedirectUrl="/sync"
    >
      <html lang="en" suppressHydrationWarning>
        <body
          suppressHydrationWarning
          className={`${inter.variable} ${jetBrainsMono.variable} antialiased font-sans`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <main className="bg-background">
              <Navbar />
              <Preloader/>
              {children}
              <Footer />
              <Toaster
                richColors
                theme="system"
                duration={5000}
                closeButton
                icons={{
                  success: <CheckCircle />,
                  error: <XCircle />,
                  info: <Info />,
                  warning: <AlertTriangle />,
                }}
                position="bottom-right"
              />
            </main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
