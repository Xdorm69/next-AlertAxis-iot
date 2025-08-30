import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/Providers/ThemeProvider";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
    <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetBrainsMono.variable} antialiased font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <main>
            <Navbar/>
            {children}
            <Footer/>
          </main>
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
