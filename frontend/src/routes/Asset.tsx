import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchAssetMeta } from '../lib/api'
import VerifiedBadge from '../components/VerifiedBadge'
import ProofPanel from '../components/ProofPanel'

export default function Asset(){
  const { id } = useParams()
  const [meta,setMeta]=useState<any>()
  const [open,setOpen]=useState(false)
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState<string>()
  
  useEffect(()=>{ 
    if(id) {
      setLoading(true)
      fetchAssetMeta(id)
        .then(data => {
          if (data.error) {
            setError(data.error)
            // Use fallback data if available
            if (data.fallback) {
              setMeta(data.fallback)
            }
          } else {
            setMeta(data)
          }
        })
        .catch(err => {
          setError('Asset not found')
          // Create minimal fallback
          setMeta({
            id,
            title: `Asset ${id}`,
            status: 'unknown',
            type: 'Unknown',
            issuedBy: 'Unknown',
            signedAt: new Date().toISOString()
          })
        })
        .finally(() => setLoading(false))
    }
  },[id])
  
  if(loading) return <div className="text-center py-8">Loading asset...</div>
  if(!meta) return <div className="text-center py-8 text-red-600">Asset not found</div>
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold">{meta.title}</h1>
          <div className="text-sm text-gray-600">{meta.issuedBy} · {meta.signedAt}</div>
        </div>
        <VerifiedBadge state={meta.status} onClick={()=>setOpen(true)} />
      </div>
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm text-yellow-800">
          ⚠️ {error}
        </div>
      )}
      
      {meta.file && (
        <div className="border rounded p-3 bg-white">
          <div className="text-sm text-gray-500 mb-2">Preview</div>
          <img src={meta.file} alt="preview" className="max-h-72 object-contain" onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}/>
          <div className="mt-3 flex gap-2">
            <a className="px-3 py-2 border rounded" href={meta.file} download>Download</a>
            <button className="px-3 py-2 border rounded" onClick={()=>setOpen(true)}>Open proof</button>
          </div>
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="border rounded p-3 bg-white">
          <div className="font-medium mb-2">Provenance</div>
          <dl className="text-sm">
            <dt className="text-gray-500">Issuer</dt><dd>{meta.issuedBy}</dd>
            <dt className="text-gray-500">Trust chain</dt><dd>{meta.status==='verified'?'Valid':'—'}</dd>
          </dl>
        </div>
        {meta.references && meta.references.length > 0 && (
          <div className="border rounded p-3 bg-white">
            <div className="font-medium mb-2">References</div>
            <ul className="list-disc list-inside text-sm">
              {meta.references.map((r:any)=> (
                <li key={r.url}>
                  <a className="text-blue-700 hover:text-blue-900" href={r.url} target="_blank" rel="noopener noreferrer">
                    {r.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <ProofPanel open={open} onClose={()=>setOpen(false)} data={{state:meta.status, issuer:meta.issuedBy, signedAt:meta.signedAt, raw:meta}}/>
    </div>
  )
}