// src/components/ui/AvatarChip.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Enhanced AvatarChip
// • Active: full opacity, orange ring that pulses once on activation,
//   avatar scales up slightly, chip label becomes navy-filled.
// • Inactive: 50% opacity, greyscale filter, smooth hover lift.
// • The scale + ring appear with a spring-like CSS transition.
// ─────────────────────────────────────────────────────────────────────────────
"use client";
import Image from "next/image";

export interface AvatarChipProps {
  src: string;
  name: string;
  role: string;
  active?: boolean;
  onClick?: () => void;
}

export function AvatarChip({
  src,
  name,
  role,
  active = false,
  onClick,
}: AvatarChipProps) {
  return (
    <>
      <style>{`
        @keyframes ringPulse {
          0%   { box-shadow: 0 0 0 0   rgba(249,115,22,0.55); }
          60%  { box-shadow: 0 0 0 8px rgba(249,115,22,0.10); }
          100% { box-shadow: 0 0 0 10px rgba(249,115,22,0); }
        }
        .avatar-chip-img-active {
          animation: ringPulse 0.55s ease-out forwards;
        }
      `}</style>

      <button
        type="button"
        aria-label={`${name}, ${role}`}
        aria-pressed={active}
        onClick={onClick}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          outline: "none",
          /* Smooth the whole chip together */
          transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
          transform: active ? "translateY(-4px)" : "translateY(0)",
        }}
      >
        {/* Avatar ring wrapper */}
        <div
          className={active ? "avatar-chip-img-active" : ""}
          style={{
            position: "relative",
            width: "6rem",
            height: "6rem",
            borderRadius: "9999px",
            overflow: "hidden",
            /* Orange border when active, transparent when not */
            border: active
              ? "2.5px solid #f97316"
              : "2.5px solid transparent",
            /* Subtle lift shadow when active */
            boxShadow: active
              ? "0 6px 20px rgba(249,115,22,0.25)"
              : "0 2px 8px rgba(0,0,0,0.08)",
            /* Scale: slightly larger when active */
            transform: active ? "scale(1.13)" : "scale(1)",
            transition:
              "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), border-color 0.25s, box-shadow 0.3s",
            /* Greyscale + opacity for inactive */
            filter: active ? "none" : "grayscale(45%)",
            opacity: active ? 1 : 0.55,
          }}
          // Hover restore opacity/colour for inactive chips
          onMouseEnter={(e) => {
            if (!active) {
              (e.currentTarget as HTMLDivElement).style.opacity = "0.85";
              (e.currentTarget as HTMLDivElement).style.filter = "grayscale(15%)";
            }
          }}
          onMouseLeave={(e) => {
            if (!active) {
              (e.currentTarget as HTMLDivElement).style.opacity = "0.55";
              (e.currentTarget as HTMLDivElement).style.filter = "grayscale(45%)";
            }
          }}
        >
          <Image
            src={src}
            alt={name}
            fill
            sizes="96px"
            className="object-cover object-[center_15%]"
          />
          {/* Initials fallback shown behind image */}
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#e8edf5",
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "#0f2b5b",
              zIndex: -1,
            }}
          >
            {name.charAt(0)}
          </span>
        </div>

        {/* Role chip label */}
        <span
          style={{
            display: "inline-block",
            borderRadius: "9999px",
            padding: "0.15rem 0.65rem",
            fontSize: "0.6875rem",
            fontWeight: 600,
            letterSpacing: "0.01em",
            transition: "background-color 0.25s, color 0.25s, transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
            backgroundColor: active ? "#0f2b5b" : "#f1f5f9",
            color: active ? "#ffffff" : "#0f2b5b",
            transform: active ? "scale(1.05)" : "scale(1)",
            whiteSpace: "nowrap",
          }}
        >
          {role}
        </span>
      </button>
    </>
  );
}