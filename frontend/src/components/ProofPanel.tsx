import React from 'react'
import type { VerificationResponse } from '../lib/api'

export default function ProofPanel({open,onClose,data}:{open:boolean; onClose:()=>void; data?:VerificationResponse}){
  if(!open) return null
  const d = data
  return (
    <div role="dialog" aria-modal className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}/>
      <div className="absolute right-0 top-0 h-full w-full sm:w-[480px] bg-white shadow-xl p-4 overflow-y-auto">
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="text-lg font-semibold">Proof of Origin</h2>
          <button onClick={onClose} aria-label="Close" className="text-gray-500">✕</button>
        </div>
        {!d ? <p className="py-6">No data</p> : (
          <div className="space-y-4 py-4">
            <div className="space-y-1">
              <div className="text-sm text-gray-500">State</div>
              <div className="font-medium capitalize">{d.state}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {d.issuer && <Field label="Issuer" value={d.issuer}/>}
              {d.signedAt && <Field label="Signed at" value={d.signedAt}/>}
              {d.chain && <Field label="Trust chain" value={d.chain}/>}
              {d.certThumbprint && <Field label="Cert thumbprint" value={d.certThumbprint} copy/>}
              {d.assetHash && <Field label="Asset hash" value={d.assetHash} copy/>}
              {d.manifestUrl && <Field label="Manifest URL" value={d.manifestUrl}/>}
            </div>
            <details className="border rounded">
              <summary className="cursor-pointer px-3 py-2 text-sm">View raw JSON</summary>
              <pre className="p-3 text-xs overflow-x-auto">{JSON.stringify(d.raw ?? d, null, 2)}</pre>
            </details>
            <div className="flex gap-2">
              <button onClick={()=>navigator.clipboard.writeText(JSON.stringify(d,null,2))} className="px-3 py-2 border rounded">Copy JSON</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({label,value,copy}:{label:string; value:string; copy?:boolean}){
  return (
    <div className="space-y-1">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-sm break-all">
        {value}
        {copy && <button onClick={()=>navigator.clipboard.writeText(value)} className="ml-2 text-xs text-blue-700 hover:text-blue-900">Copy</button>}
      </div>
    </div>
  )
}