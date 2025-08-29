import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/Providers/ThemeProvider";


export const metadata: Metadata = {
  title: "AlertAxis",
  description: "AlertAxis",
};

export const inter = Inter({
  variable: "--font-inter", 
  weight: ["100", "400", "900"],
})

export const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono", 
  weight: ["100", "400", "800"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
