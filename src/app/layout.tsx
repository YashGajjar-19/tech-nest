import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { siteConfig } from "@/config/site";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ScrollProvider } from "@/components/providers/ScrollProvider";
import AppReady from "@/components/providers/AppReady";
import { SearchProvider } from "@/components/providers/SearchProvider";
import { SearchPalette } from "@/components/search/SearchPalette";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { AuthModal } from "@/components/auth/AuthModal";
import { ConditionalShell } from "@/components/providers/ConditionalShell";

const fontSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontHeading = Geist({
  variable: "--font-heading",
  subsets: ["latin"],
});

const fontMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["tech", "gadgets", "AI platform", "recommendations"],
  authors: [
    {
      name: "Tech Nest",
    },
  ],
  creator: "Tech Nest",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontHeading.variable} ${fontMono.variable} min-h-screen bg-background text-foreground antialiased font-sans flex flex-col`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppReady>
            <AuthProvider>
              <SearchProvider>
                <ScrollProvider>
                  <AuthModal />
                  <SearchPalette />
                  <ConditionalShell>
                    {children}
                  </ConditionalShell>
                </ScrollProvider>
              </SearchProvider>
            </AuthProvider>
          </AppReady>
        </ThemeProvider>
      </body>
    </html>
  );
}
