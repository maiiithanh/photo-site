import type { Metadata } from "next";
import { Crimson_Text, Doto } from "next/font/google";
import Nav from "@/components/Nav";
import "./globals.css";

const crimsonText = Crimson_Text({
  variable: "--font-crimson-text",
  // Not a variable font, so the weight has to be named
  weight: "400",
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
    <html lang="en" className={`${crimsonText.variable} ${doto.variable} h-full antialiased`}>
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
