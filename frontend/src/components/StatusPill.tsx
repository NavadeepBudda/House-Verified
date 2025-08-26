import React from 'react'
export default function StatusPill({state}:{state:'verified'|'failed'|'unknown'}){
  const map = {
    verified: 'border-green-200 bg-green-50 text-green-800',
    failed: 'border-red-200 bg-red-50 text-red-800',
    unknown: 'border-amber-200 bg-amber-50 text-amber-800'
  } as const
  const label = {verified:'Verified', failed:'Failed (tampered)', unknown:'Unknown signer'}[state]
  return <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs border ${map[state]}`}>
    <span className="h-2 w-2 rounded-full bg-current/70"></span>{label}
  </span>
}