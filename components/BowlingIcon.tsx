// Simple bowling pin + ball glyph built from SVG primitives (lucide-react has no
// dedicated bowling icon), used as a stylised placeholder visual on club cards.
export function BowlingIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <ellipse cx="16" cy="38" rx="6" ry="3" fill="currentColor" opacity="0.25" />
      <path
        d="M16 6c-1.8 0-3 1.6-2.6 3.3l.6 2.6c-2.4 1.7-4 4.6-4 7.9 0 5.6 3.4 10.4 6 15.4.6 1.1 1.7 1.8 3 1.8s2.4-.7 3-1.8c2.6-5 6-9.8 6-15.4 0-3.3-1.6-6.2-4-7.9l.6-2.6C25 7.6 23.8 6 22 6h-6z"
        fill="currentColor"
      />
      <circle cx="14.5" cy="15" r="1" fill="currentColor" className="text-brand-800" opacity="0.6" />
      <circle cx="18" cy="15" r="1" fill="currentColor" opacity="0.6" />
      <circle cx="16.2" cy="18" r="1" fill="currentColor" opacity="0.6" />
      <circle cx="35" cy="30" r="9" fill="currentColor" opacity="0.9" />
      <circle cx="32" cy="25" r="1.2" fill="currentColor" className="text-brand-900" opacity="0.4" />
      <circle cx="36" cy="24" r="1.2" fill="currentColor" opacity="0.4" />
      <circle cx="34" cy="28" r="1.2" fill="currentColor" opacity="0.4" />
    </svg>
  )
}
