import type { Metadata } from "next";
import PhotoColumn from "@/components/PhotoColumn";
import { ongoingWorks } from "@/lib/media";

export const metadata: Metadata = {
  title: "Ongoing Works — Mai-Thanh Nguyen",
};

export default function OngoingWorks() {
  return (
    <PhotoColumn
      photos={ongoingWorks}
      gap={135}
      intro={["Ongoing Works 24-26"]}
    />
  );
}
