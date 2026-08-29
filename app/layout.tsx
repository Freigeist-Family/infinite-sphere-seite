import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  metadataBase: new URL("https://infinite-sphere.de"),
  title: {
    default: "Infinite Sphere — Der innere Kreis der Freigeist Family",
    template: "%s — Infinite Sphere",
  },
  icons: {
    icon: [
      { url: "/assets/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/assets/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/favicon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/assets/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/assets/favicon-180.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
