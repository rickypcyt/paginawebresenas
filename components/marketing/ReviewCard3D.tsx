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
    <div className="flex h-full flex-col rounded-[1.75rem] border border-black/15 bg-white p-5 font-serif text-[#202124] sm:p-7">
      <div className="px-2 text-center">
        <p className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">Déjanos una reseña</p>
        <div className="mt-3"><GoogleMark /></div>
        <p className="mt-2 text-sm font-medium text-[#6b6b6b]">Tu opinión nos ayuda a mejorar</p>
      </div>

      <div className="h-8" />

      <div className="grid flex-1 grid-cols-2 gap-8 sm:gap-12">
        <div className="flex h-full flex-col items-center justify-center p-2 text-center sm:p-3">
          <div className="rounded-xl bg-white p-2">
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
          <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-white text-green-600 sm:h-28 sm:w-28">
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
        currentRotation.current.x += (targetX - currentRotation.current.x) * 0.14;
        currentRotation.current.y += (targetY - currentRotation.current.y) * 0.14;
        const resting = !hovering.current && Math.abs(currentRotation.current.x) < 0.01 && Math.abs(currentRotation.current.y) < 0.01;
        if (resting) {
          currentRotation.current = { x: 0, y: 0 };
          cardRef.current.style.transform = "none";
        } else {
          cardRef.current.style.transform = `rotateX(${currentRotation.current.x}deg) rotateY(${currentRotation.current.y}deg)`;
        }
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
    targetRotation.current = { x: -vertical * 18, y: horizontal * 22 };
    if (shadowRef.current) {
      shadowRef.current.style.transform = `translate(${horizontal * -24}px, ${18 + vertical * -10}px) scale(${1 - Math.abs(horizontal) * 0.08})`;
    }
  }

  function handleMouseLeave() {
    hovering.current = false;
    targetRotation.current = { x: 0, y: 0 };
    if (shadowRef.current) shadowRef.current.style.transform = "translate(0, 18px) scale(1)";
  }

  return (
    <div
      className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-3xl bg-white select-none md:h-[580px]"
      onMouseEnter={() => { hovering.current = true; }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative [perspective:900px]">
        <div ref={shadowRef} className="pointer-events-none absolute inset-x-8 bottom-0 h-16 rounded-[50%] bg-black/20 blur-2xl transition-transform duration-300" style={{ transform: "translate(0, 18px) scale(1)" }} aria-hidden="true" />
        <div ref={cardRef} className="relative aspect-square w-[min(82vw,400px)] rounded-[1.75rem] [transform-style:preserve-3d]">
          <div className="absolute inset-0 rounded-[1.75rem] bg-[#c8c8c4]" style={{ transform: "translateZ(-10px)" }} aria-hidden="true" />
          <div className="absolute left-4 right-4 top-[-10px] h-5 bg-gradient-to-b from-[#f5f5f2] to-[#d8d8d4] [transform:rotateX(90deg)]" aria-hidden="true" />
          <div className="absolute bottom-[-10px] left-4 right-4 h-5 bg-gradient-to-b from-[#d8d8d4] to-[#bdbdb9] [transform:rotateX(90deg)]" aria-hidden="true" />
          <div className="absolute bottom-4 left-[-10px] top-4 w-5 bg-gradient-to-r from-[#c9c9c5] to-[#ecece9] [transform:rotateY(90deg)]" aria-hidden="true" />
          <div className="absolute bottom-4 right-[-10px] top-4 w-5 bg-gradient-to-r from-[#ecece9] to-[#c5c5c1] [transform:rotateY(90deg)]" aria-hidden="true" />
          <div className="absolute inset-0 overflow-hidden rounded-[1.75rem]" style={{ transform: "translateZ(10px)" }}>
            <FrontFace />
          </div>
        </div>
      </div>
      <span className="mt-6 font-serif text-sm italic text-[var(--foreground)]/60">Ejemplo de tarjeta de reseña con NFC</span>
    </div>
  );
}
