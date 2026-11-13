import type { Metadata } from "next";
import PhotoColumn from "@/components/PhotoColumn";
import { commissioned } from "@/lib/media";

export const metadata: Metadata = {
  title: "Commissioned — Mai-Thanh Nguyen",
};

export default function Commissioned() {
  return (
    <PhotoColumn
      photos={commissioned}
      gap={70}
      pairPortraits
      centered
      intro={[
        "Arcana Brand Visuals",
        "Photography by Mai-Thanh Nguyen",
        "Creative Direction by Andrea Garcia",
      ]}
    />
  );
}
