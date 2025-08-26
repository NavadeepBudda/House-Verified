const BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:4000'

export type VerificationResponse = {
  state: 'verified'|'failed'|'unknown'
  issuer?: string
  signedAt?: string
  chain?: 'valid'|'missing'|'revoked'
  assetHash?: string
  manifestUrl?: string
  certThumbprint?: string
  assetUrl?: string
  messages?: string[]
  raw?: any
}

export async function verifyFile(file: File): Promise<VerificationResponse> {
  const fd = new FormData()
  fd.append('file', file)
  const r = await fetch(`${BASE}/api/verify/file`, { method: 'POST', body: fd })
  return r.json()
}

export async function verifyUrl(url: string): Promise<VerificationResponse> {
  const r = await fetch(`${BASE}/api/verify/url`, { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ url }) })
  return r.json()
}

export async function fetchAssetMeta(id: string){
  const r = await fetch(`${BASE}/api/assets/${id}`)
  if(!r.ok) throw new Error('Not found')
  return r.json()
}