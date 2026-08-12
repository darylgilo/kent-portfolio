import type { Metadata } from "next";
import { Inter, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TemplateProvider } from "@/components/template-provider";

const pixelFont = Press_Start_2P({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: ["400"],
});

const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kent Daryl M. Gilo - Portfolio",
  description: "Full Stack Web Developer, DevOps Engineer, Cloud Engineer, UI/UX Designer, Graphic Designer, Multimedia Editor",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${pixelFont.variable} ${interFont.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <TemplateProvider>{children}</TemplateProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
