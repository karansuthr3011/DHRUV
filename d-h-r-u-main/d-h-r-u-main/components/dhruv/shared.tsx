import type { ReactNode } from 'react'
import { CircleHelp } from 'lucide-react'

export const cx = (...values: (string | false | undefined | null)[]) => values.filter(Boolean).join(' ')

export const RISK_CLASS: Record<string, string> = {
  low: 'text-risk-low border-risk-low/50 bg-risk-low/10',
  moderate: 'text-risk-moderate border-risk-moderate/50 bg-risk-moderate/10',
  high: 'text-risk-high border-risk-high/50 bg-risk-high/10',
  critical: 'text-risk-critical border-risk-critical/50 bg-risk-critical/10',
}

export function riskTone(tier: string | undefined) {
  return RISK_CLASS[tier ?? 'moderate'] ?? RISK_CLASS.moderate
}

export function riskDot(tier: string | undefined) {
  return riskTone(tier).split(' ')[0]
}

export function Card({
  title,
  children,
  className,
  action,
}: {
  title: string
  children: ReactNode
  className?: string
  action?: ReactNode
}) {
  return (
    <section className={cx('rounded border border-border bg-panel/80', className)}>
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <h2 className="text-xs font-semibold">{title}</h2>
        {action ?? <CircleHelp className="size-3.5 text-muted-foreground" />}
      </div>
      {children}
    </section>
  )
}

export function TablePanel({
  title,
  columns,
  rows,
  onRowClick,
  activeId,
  action,
}: {
  title: string
  columns: string[]
  rows: { id: string; cells: string[]; tone?: string }[]
  onRowClick?: (id: string) => void
  activeId?: string
  action?: ReactNode
}) {
  return (
    <Card title={title} action={action}>
      <div className="max-h-[420px] overflow-auto p-3">
        <table className="w-full text-left text-[10px]">
          <thead>
            <tr className="text-muted-foreground">
              {columns.map((c) => (
                <th key={c} className="pb-2 pr-4 font-normal">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row.id)}
                className={cx(
                  'border-t border-border',
                  onRowClick && 'cursor-pointer hover:bg-elevated/60',
                  activeId === row.id && 'bg-primary/10',
                )}
              >
                {row.cells.map((cell, j) => (
                  <td key={j} className="py-2 pr-4">
                    {j === row.cells.length - 1 && row.tone ? (
                      <span className={cx('rounded border px-1.5 py-0.5', row.tone)}>{cell}</span>
                    ) : (
                      cell
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="py-6 text-center text-[10px] text-muted-foreground">No matching results.</p>
        )}
      </div>
    </Card>
  )
}

export function EmptyNote({ children }: { children: ReactNode }) {
  return <p className="p-3 text-[10px] leading-relaxed text-muted-foreground">{children}</p>
}
