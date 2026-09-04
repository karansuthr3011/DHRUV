'use client'

import { useState } from 'react'
import { Check, Download, FileText, Loader2 } from 'lucide-react'
import { Card, cx } from '../shared'

type ReportKind = 'voyage-summary' | 'risk-briefing' | 'model-performance' | 'audit-export'

const REPORT_DEFS: { id: ReportKind; label: string; description: string }[] = [
  { id: 'voyage-summary', label: 'Voyage Summary', description: 'Route, timeline, and hazard log for the active voyage plan.' },
  { id: 'risk-briefing', label: 'Risk Briefing', description: 'Current hazards, stress-test outcomes, and resilience scores.' },
  { id: 'model-performance', label: 'Model Performance', description: 'Skill metrics and validation history for all active models.' },
  { id: 'audit-export', label: 'Audit Export', description: 'Full activity log for the current voyage and data sources.' },
]

type GeneratedReport = { id: string; kind: ReportKind; createdAt: string }

export function ReportsWorkspace() {
  const [pending, setPending] = useState<ReportKind | null>(null)
  const [generated, setGenerated] = useState<GeneratedReport[]>([
    { id: 'r0', kind: 'voyage-summary', createdAt: '11 Aug 2026, 09:12 UTC' },
  ])

  const generate = (kind: ReportKind) => {
    setPending(kind)
    setTimeout(() => {
      setGenerated((prev) => [
        { id: `r${prev.length}-${Date.now()}`, kind, createdAt: new Date().toUTCString().slice(5, 22) + ' UTC' },
        ...prev,
      ])
      setPending(null)
    }, 900)
  }

  return (
    <div className="grid gap-3 xl:grid-cols-[.9fr_1.1fr]">
      <Card title="Generate a Report">
        <div className="flex flex-col gap-2 p-3">
          {REPORT_DEFS.map((def) => (
            <div key={def.id} className="flex items-center justify-between gap-3 rounded border border-border p-3 text-[10px]">
              <div>
                <div className="font-semibold">{def.label}</div>
                <p className="mt-0.5 text-muted-foreground">{def.description}</p>
              </div>
              <button
                onClick={() => generate(def.id)}
                disabled={pending === def.id}
                className={cx(
                  'flex shrink-0 items-center gap-1.5 rounded border px-3 py-1.5',
                  pending === def.id ? 'border-border text-muted-foreground' : 'border-primary bg-primary/10 text-primary hover:bg-primary/20',
                )}
              >
                {pending === def.id ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" /> Generating
                  </>
                ) : (
                  'Generate'
                )}
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Generated Reports">
        <div className="flex flex-col p-3 text-[10px]">
          {generated.length === 0 && <p className="text-muted-foreground">No reports generated yet.</p>}
          {generated.map((report) => {
            const def = REPORT_DEFS.find((d) => d.id === report.kind)!
            return (
              <div key={report.id} className="flex items-center justify-between border-b border-border py-2.5 last:border-0">
                <div className="flex items-center gap-2">
                  <FileText className="size-3.5 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">{def.label}</div>
                    <div className="text-[9px] text-muted-foreground">{report.createdAt}</div>
                  </div>
                </div>
                <a
                  href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                    `D.H.R.U.V. ${def.label}\nGenerated: ${report.createdAt}\n\n${def.description}`,
                  )}`}
                  download={`${def.id}-${report.id}.txt`}
                  className="flex items-center gap-1.5 rounded border border-border px-2.5 py-1.5 text-[10px] hover:bg-elevated"
                >
                  <Download className="size-3.5" /> Download
                </a>
              </div>
            )
          })}
        </div>
        {generated.length > 0 && (
          <div className="flex items-center gap-1.5 border-t border-border px-3 py-2 text-[9px] text-risk-low">
            <Check className="size-3" /> {generated.length} report{generated.length === 1 ? '' : 's'} ready
          </div>
        )}
      </Card>
    </div>
  )
}
