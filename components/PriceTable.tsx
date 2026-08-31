import type { PriceRow } from '../lib/clubs'

export function PriceTable({ title, rows }: { title: string; rows: PriceRow[] }) {
  return (
    <div className="mb-5">
      <div className="eyebrow mb-2">{title}</div>
      <table className="w-full border-collapse text-[15px]">
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td className="border-b border-ink/20 py-2.5">{row.label}</td>
              <td className="whitespace-nowrap border-b border-ink/20 py-2.5 text-right font-extrabold">{row.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
