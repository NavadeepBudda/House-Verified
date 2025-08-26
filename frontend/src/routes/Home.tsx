import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import VerifiedBadge from '../components/VerifiedBadge'
import ProofPanel from '../components/ProofPanel'

export default function Home(){
  const [open,setOpen]=useState(false)
  const sample = { state:'verified' } as any
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold">Trust what you read from the House.</h1>
        <p className="text-gray-600 max-w-2xl">A small badge + cryptographic proof that a file really came from a House office.</p>
        <div className="flex gap-3">
          <Link to="/verify" className="px-4 py-2 rounded bg-blue-700 text-white">Verify a file</Link>
          <Link to="/asset/flyer" className="px-4 py-2 rounded border">See a verified asset</Link>
        </div>
      </section>

      <section>
        <div className="border rounded-lg bg-white">
          <div className="p-3 border-b font-medium">Samples</div>
          <div className="divide-y">
            <Row title="Press Release — Broadband Grant" type="PDF" office="Committee on Energy & Commerce" date="2025-08-10" state="verified" id="press-unknown"/>
            <Row title="District Town Hall Flyer" type="Image" office="Office of Rep. Smith" date="2025-08-09" state="failed" id="flyer-tampered"/>
            <Row title="Floor Clip — H.R. 1234" type="Video" office="House Recording Studio" date="2025-08-08" state="unknown" id="press-unknown"/>
          </div>
        </div>
      </section>

      <VerifiedBadge state="verified" onClick={()=>setOpen(true)} />
      <ProofPanel open={open} onClose={()=>setOpen(false)} data={sample} />
    </div>
  )
}

function Row({title,type,office,date,state,id}:{title:string;type:string;office:string;date:string;state:'verified'|'failed'|'unknown';id:string}){
  return (
    <Link to={`/asset/${id}`} className="flex items-center justify-between p-3 hover:bg-gray-50">
      <div className="min-w-0">
        <div className="font-medium truncate">{title}</div>
        <div className="text-xs text-gray-500">{type} · {office}</div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-xs text-gray-500">{date}</div>
        <span className="text-xs capitalize">{state}</span>
      </div>
    </Link>
  )
}