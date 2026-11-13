import type { Metadata } from "next";
import { Doto, EB_Garamond } from "next/font/google";
import Nav from "@/components/Nav";
import "./globals.css";

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
});

// Dot-matrix font, used only for the ASCII drawings
const doto = Doto({
  variable: "--font-doto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mai-Thanh Nguyen",
  description: "Photography by Mai-Thanh Nguyen",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${ebGaramond.variable} ${doto.variable} h-full antialiased`}>
      <body className="min-h-full font-serif text-main">
        {/* Desktop grid: 6 columns, 115px margins, 20px gutters */}
        <div className="grid min-h-screen grid-cols-6 gap-x-5 px-[115px]">
          <Nav />
          {/* Columns 3–6; pages place content on this subgrid */}
          <main className="col-span-4 grid grid-cols-subgrid">{children}</main>
        </div>
      </body>
    </html>
  );
}
