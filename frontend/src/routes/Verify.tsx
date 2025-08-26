import React, { useState } from 'react'
import FileDrop from '../components/FileDrop'
import { verifyFile, verifyUrl, type VerificationResponse } from '../lib/api'
import ProofPanel from '../components/ProofPanel'
import StatusPill from '../components/StatusPill'

export default function Verify(){
  const [loading,setLoading]=useState(false)
  const [data,setData]=useState<VerificationResponse|undefined>()
  const [url,setUrl]=useState('')
  const [open,setOpen]=useState(false)

  async function doFile(f:File){
    setLoading(true); setData(undefined)
    const r = await verifyFile(f)
    setData(r); setLoading(false)
  }
  async function doUrl(){
    if(!url) return
    setLoading(true); setData(undefined)
    const r = await verifyUrl(url)
    setData(r); setLoading(false)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Verify a House file</h1>
      <FileDrop onFile={doFile}/>
      <div className="flex items-center gap-2">
        <div className="text-gray-400">— or —</div>
      </div>
      <div className="flex gap-2">
        <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://example.com/file.pdf" className="flex-1 px-3 py-2 border rounded"/>
        <button onClick={doUrl} className="px-3 py-2 border rounded">Check</button>
      </div>

      {loading && <div className="h-0.5 bg-blue-100"><div className="h-0.5 bg-blue-700 animate-pulse"/></div>}

      {data && (
        <div className="border rounded-lg bg-white p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="font-medium text-lg">Verification Summary</div>
            <StatusPill state={data.state}/>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {data.issuer && <Field label="Issuer" value={data.issuer}/>}
            {data.signedAt && <Field label="Signed at" value={data.signedAt}/>}
            {data.chain && <Field label="Trust chain" value={data.chain}/>}
            {data.assetHash && <Field label="Asset hash" value={data.assetHash} copy/>}
          </div>
          <div className="flex gap-2">
            <button onClick={()=>setOpen(true)} className="px-3 py-2 border rounded">View proof</button>
            {data.assetUrl && <a href={data.assetUrl} className="px-3 py-2 border rounded">Open asset</a>}
            <button onClick={()=>navigator.clipboard.writeText(JSON.stringify(data,null,2))} className="px-3 py-2 border rounded">Copy JSON</button>
          </div>
          <ProofPanel open={open} onClose={()=>setOpen(false)} data={data}/>
        </div>
      )}
    </div>
  )
}

function Field({label,value,copy}:{label:string; value:string; copy?:boolean}){
  return <div>
    <div className="text-gray-500">{label}</div>
    <div className="break-all">{value}{copy && <button className="ml-2 text-xs text-blue-700 hover:text-blue-900" onClick={()=>navigator.clipboard.writeText(value)}>Copy</button>}</div>
  </div>
}