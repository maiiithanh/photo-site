"use client";

import { useEffect, useRef } from "react";

export type TailLetter = {
  char: string;
  x: number;
  y: number;
  rotate: number;
  fontSize: number;
  // Drawn in Doto
  dot: boolean;
};

// The pointer gently pushes away letters within this distance (in the
// spiral's px), harder the closer it is. Letters are slow to start moving,
// so a passing pointer only nudges them a little way.
const REACH = 70;
const PUSH = 0.3;
// Each letter eases back to its place once the pointer has gone, over a
// couple of seconds and with barely any overshoot
const SPRING = 0.0006;
const DAMPING = 0.96;
// How much a push also turns a letter, in degrees
const SPIN = 4;

// The loose letters at the end of the spiral. Moving the pointer through
// them scatters them, and they drift back to their places after.
export default function SpiralTail({ letters }: { letters: TailLetter[] }) {
  const group = useRef<SVGGElement>(null);
  const glyphs = useRef<(SVGGElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = group.current!;

    // Offset from its place, and velocity, for each letter (in the spiral's
    // px and degrees). Each spins one way, at random.
    const state = letters.map(() => ({
      x: 0,
      y: 0,
      spin: 0,
      vx: 0,
      vy: 0,
      vspin: 0,
      way: Math.random() < 0.5 ? -1 : 1,
    }));
    let pointer: { x: number; y: number } | null = null;
    let frame = 0;

    function step() {
      // The pointer in the letters' own coordinates (the spiral is turned
      // and scaled)
      let local: DOMPoint | null = null;
      const ctm = root.getScreenCTM();
      if (pointer && ctm) {
        local = new DOMPoint(pointer.x, pointer.y).matrixTransform(
          ctm.inverse(),
        );
      }

      let moving = false;
      state.forEach((s, i) => {
        if (local) {
          const dx = letters[i].x + s.x - local.x;
          const dy = letters[i].y + s.y - local.y;
          const distance = Math.hypot(dx, dy) || 1;
          if (distance < REACH) {
            const force = PUSH * (1 - distance / REACH) ** 2;
            s.vx += (dx / distance) * force;
            s.vy += (dy / distance) * force;
            s.vspin += s.way * force * SPIN;
          }
        }
        s.vx = (s.vx - s.x * SPRING) * DAMPING;
        s.vy = (s.vy - s.y * SPRING) * DAMPING;
        s.vspin = (s.vspin - s.spin * SPRING) * DAMPING;
        s.x += s.vx;
        s.y += s.vy;
        s.spin += s.vspin;

        const settled =
          Math.abs(s.x) + Math.abs(s.y) + Math.abs(s.spin) < 0.05 &&
          Math.abs(s.vx) + Math.abs(s.vy) + Math.abs(s.vspin) < 0.05;
        if (settled) s.x = s.y = s.spin = s.vx = s.vy = s.vspin = 0;
        else moving = true;

        const glyph = glyphs.current[i];
        if (glyph) {
          glyph.style.translate = `${s.x}px ${s.y}px`;
          glyph.style.rotate = `${s.spin}deg`;
        }
      });

      // Keep going while anything moves or the pointer is over the tail
      frame = moving || local ? requestAnimationFrame(step) : 0;
    }

    function onMove(event: PointerEvent) {
      // Only the visible copy (desktop or phone) responds
      if (!root.getBoundingClientRect().width) return;
      pointer = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(step);
    }

    function onLeave() {
      pointer = null;
    }

    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, [letters]);

  return (
    <g ref={group}>
      {letters.map(({ char, x, y, rotate, fontSize, dot }, i) => (
        // Moves and spins about its own centre when pushed
        <g
          key={i}
          ref={(el) => {
            glyphs.current[i] = el;
          }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          <text
            x={x}
            y={y}
            transform={
              rotate ? `rotate(${rotate.toFixed(1)} ${x} ${y})` : undefined
            }
            textAnchor="middle"
            dominantBaseline="central"
            className={dot ? "font-dot" : undefined}
            fontSize={fontSize}
          >
            {char}
          </text>
        </g>
      ))}
    </g>
  );
}
