import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Lumbini Rentals - Verified Spaces",
  description:
    "Discover verified rental properties from Bhairahawa to Butwal. 100% inspected, direct landlords",
  applicationName: "Lumbini Rentals",
  authors: [
    { name: "Kritish Bhattarai", url: "https://kritishbhattarai.com.np" },
  ],
  icons: {
    icon: [
      {
        url: "/lumbini-rentals-48x48.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/lumbini-rentals-48x48.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/lumbini-rentals-48x48.png",
        type: "image/svg+xml",
      },
    ],
    apple: "/lumbini-rentals-48x48.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`bg-background ${inter.variable} ${poppins.variable}`}
    >
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
