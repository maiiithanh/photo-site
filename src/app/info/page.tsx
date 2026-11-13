import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Info — Mai-Thanh Nguyen",
};

const email = "mai-thanh_nguyen@alumni.brown.edu";

export default function Info() {
  return (
    <div className="col-span-4 pt-[140px]">
      <p>
        I am a photographer and experimental new media artist based in San
        Francisco, California. I am inspired by the varying schools of
        consciousness, memory, collective languages of persistence, and our
        relationship to technology. You can reach me by email.
      </p>
      {/* One blank line (one line-height) between paragraphs */}
      <p className="mt-[1.4em]">
        <a href={`mailto:${email}`}>{email}</a>
      </p>
    </div>
  );
}
