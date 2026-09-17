"use client";

import { useEffect, useRef } from "react";
import QRCode from "react-qr-code";
import { SmartphoneNfc } from "lucide-react";

function GoogleMark() {
  return (
    <span className="font-sans text-3xl font-semibold tracking-[-0.08em] sm:text-4xl" aria-label="Google">
      <span className="text-[#4285f4]">G</span>
      <span className="text-[#ea4335]">o</span>
      <span className="text-[#fbbc05]">o</span>
      <span className="text-[#4285f4]">g</span>
      <span className="text-[#34a853]">l</span>
      <span className="text-[#ea4335]">e</span>
    </span>
  );
}

function FrontFace() {
  return (
    <div className="flex h-full flex-col rounded-[1.75rem] border border-black/10 bg-white p-5 font-serif text-[#202124] sm:p-7">
      <div className="px-2 text-center">
        <p className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">Déjanos una reseña</p>
        <div className="mt-3"><GoogleMark /></div>
        <p className="mt-2 text-sm font-medium text-[#6b6b6b]">Tu opinión nos ayuda a mejorar</p>
      </div>

      <div className="h-8" />

      <div className="grid flex-1 grid-cols-2 gap-8 sm:gap-12">
        <div className="flex h-full flex-col items-center justify-center p-2 text-center sm:p-3">
          <div className="rounded-xl bg-white p-2 shadow-sm">
            <QRCode
              value="Toque — Deja tu reseña en un Toque"
              size={104}
              level="H"
              bgColor="#ffffff"
              fgColor="#202124"
              className="h-20 w-20 sm:h-24 sm:w-24"
              aria-label="Código QR de ejemplo"
            />
          </div>
          <p className="mt-3 text-xl font-semibold sm:text-2xl">Escanea</p>
        </div>

        <div className="flex h-full flex-col items-center justify-center p-2 text-center sm:p-3">
          <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-white text-green-600 shadow-sm sm:h-28 sm:w-28">
            <SmartphoneNfc className="h-14 w-14 stroke-[1.5] sm:h-16 sm:w-16" />
          </div>
          <p className="mt-3 font-serif text-xl font-semibold sm:text-2xl">Toque</p>
        </div>
      </div>
    </div>
  );
}

export function ReviewCard3D() {
  const cardRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const topEdgeRef = useRef<HTMLDivElement>(null);
  const bottomEdgeRef = useRef<HTMLDivElement>(null);
  const leftEdgeRef = useRef<HTMLDivElement>(null);
  const rightEdgeRef = useRef<HTMLDivElement>(null);
  const hovering = useRef(false);
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let frame = 0;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const animate = () => {
      if (cardRef.current) {
        const targetX = hovering.current && !reduceMotion ? targetRotation.current.x : 0;
        const targetY = hovering.current && !reduceMotion ? targetRotation.current.y : 0;

        currentRotation.current.x += (targetX - currentRotation.current.x) * 0.12;
        currentRotation.current.y += (targetY - currentRotation.current.y) * 0.12;

        const resting =
          !hovering.current &&
          Math.abs(currentRotation.current.x) < 0.01 &&
          Math.abs(currentRotation.current.y) < 0.01;

        if (resting) {
          currentRotation.current = { x: 0, y: 0 };
          cardRef.current.style.transform = "none";
        } else {
          cardRef.current.style.transform = `rotateX(${currentRotation.current.x}deg) rotateY(${currentRotation.current.y}deg)`;
        }

        const rx = currentRotation.current.x;
        const ry = currentRotation.current.y;
        const setEdge = (el: HTMLDivElement | null, intensity: number) => {
          if (el) el.style.opacity = (0.15 + 0.85 * Math.min(1, Math.max(0, intensity))).toFixed(3);
        };
        setEdge(bottomEdgeRef.current, rx / 22);
        setEdge(topEdgeRef.current, -rx / 22);
        setEdge(leftEdgeRef.current, ry / 28);
        setEdge(rightEdgeRef.current, -ry / 28);
      }
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
    const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;

    targetRotation.current = {
      x: -vertical * 22,
      y: horizontal * 28,
    };

    if (shadowRef.current) {
      shadowRef.current.style.transform = `translate(${horizontal * -32}px, ${22 + vertical * -14}px) scale(${1 - Math.abs(horizontal) * 0.12})`;
    }

    if (glareRef.current) {
      const glareX = 50 + horizontal * 60;
      const glareY = 50 + vertical * 60;
      glareRef.current.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 40%, transparent 70%)`;
    }
  }

  function handleMouseLeave() {
    hovering.current = false;
    targetRotation.current = { x: 0, y: 0 };
    if (shadowRef.current) {
      shadowRef.current.style.transform = "translate(0, 22px) scale(1)";
    }
    if (glareRef.current) {
      glareRef.current.style.background = "transparent";
    }
  }

  return (
    <div
      className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-3xl bg-[var(--secondary)] select-none md:h-[580px]"
      onMouseEnter={() => { hovering.current = true; }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative [perspective:1200px]">
        <div
          ref={shadowRef}
          className="pointer-events-none absolute inset-x-10 bottom-0 h-20 rounded-[50%] bg-black/25 blur-3xl transition-transform duration-300"
          style={{ transform: "translate(0, 22px) scale(1)" }}
          aria-hidden="true"
        />

        <div
          ref={cardRef}
          className="relative aspect-square w-[min(82vw,400px)] rounded-[1.75rem] [transform-style:preserve-3d]"
        >
          <div
            className="absolute inset-0 rounded-[1.75rem] bg-[#c8c8c4]"
            style={{ transform: "translateZ(-14px)" }}
            aria-hidden="true"
          />

          <div ref={topEdgeRef} className="absolute left-3 right-3 top-[-12px] h-6 bg-gradient-to-b from-[#f8f8f5] to-[#d4d4d0] [transform:rotateX(90deg)]" style={{ opacity: 0.15 }} aria-hidden="true" />
          <div ref={bottomEdgeRef} className="absolute bottom-[-12px] left-3 right-3 h-6 bg-gradient-to-b from-[#d4d4d0] to-[#b0b0ac] [transform:rotateX(90deg)]" style={{ opacity: 0.15 }} aria-hidden="true" />
          <div ref={leftEdgeRef} className="absolute bottom-3 left-[-12px] top-3 w-6 bg-gradient-to-r from-[#c0c0bc] to-[#ecece9] [transform:rotateY(90deg)]" style={{ opacity: 0.15 }} aria-hidden="true" />
          <div ref={rightEdgeRef} className="absolute bottom-3 right-[-12px] top-3 w-6 bg-gradient-to-r from-[#ecece9] to-[#b8b8b4] [transform:rotateY(90deg)]" style={{ opacity: 0.15 }} aria-hidden="true" />

          <div
            className="absolute inset-0 overflow-hidden rounded-[1.75rem] shadow-2xl"
            style={{ transform: "translateZ(14px)" }}
          >
            <FrontFace />

            <div
              ref={glareRef}
              className="pointer-events-none absolute inset-0 rounded-[1.75rem] transition-opacity duration-300"
              style={{ mixBlendMode: "overlay" }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      <span className="mt-8 font-serif text-sm italic text-[var(--muted-foreground)]">
        Ejemplo de tarjeta de reseña con NFC
      </span>
    </div>
  );
}
