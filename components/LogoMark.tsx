// Стилизованный значок «кегля + шар» — фирменный знак «Боулинг СПб».
export function LogoMark({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-end gap-1 ${className ?? ''}`} aria-hidden="true">
      <span className="relative block h-[26px] w-[14px]">
        <span className="absolute left-1 top-0 block h-2 w-1.5 rounded-full bg-ink" />
        <span
          className="absolute left-[3px] top-[5px] block h-2 w-2 bg-ink"
          style={{ clipPath: 'polygon(38% 0,62% 0,100% 100%,0 100%)' }}
        />
        <span className="absolute bottom-0 left-0 block h-[17px] w-[14px] bg-ink" style={{ borderRadius: '52% 52% 40% 40%' }} />
      </span>
      <span className="relative block h-[18px] w-[18px] rounded-full bg-accent">
        <span className="absolute left-1 top-1 block h-[3.5px] w-[3.5px] rounded-full bg-paper" />
        <span className="absolute left-[9.5px] top-[3.5px] block h-[3.5px] w-[3.5px] rounded-full bg-paper" />
        <span className="absolute left-[6.5px] top-[9px] block h-[3.5px] w-[3.5px] rounded-full bg-paper" />
      </span>
    </span>
  )
}
