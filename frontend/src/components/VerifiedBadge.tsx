import React from 'react'
export default function VerifiedBadge({state,onClick}:{state:'verified'|'failed'|'unknown', onClick:()=>void}){
  const styles = state==='verified' ? 'bg-blue-50 text-blue-900 border-blue-200' : state==='unknown' ? 'bg-gray-50 text-gray-700 border-gray-200' : 'bg-red-50 text-red-900 border-red-200'
  const text = state==='verified' ? 'Verified by the House' : state==='unknown' ? 'Signature present' : 'Verification failed'
  return (
    <button onClick={onClick} className={`inline-flex items-center gap-2 rounded-md px-2.5 py-1 border ${styles}`}>
      <span aria-hidden className="i">🛡️</span>
      <span className="text-sm">{text}</span>
    </button>
  )
}