import type { Metadata } from "next";
import "./globals.css";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "MindMirror AI — Explainable Multimodal NLP Framework for Wellbeing Signal Analysis",
  description: "An explainable multimodal NLP framework for analyzing emotional and stress-related language signals from text, PDFs, and images with calibrated inference, occlusion attribution, and non-clinical wellbeing reflection.",
  keywords: ["NLP", "multimodal text analysis", "explainable AI", "stress classification", "wellbeing language reflection", "token occlusion", "Dreaddit benchmark"]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navigation />
          <main style={{ flex: 1 }}>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
