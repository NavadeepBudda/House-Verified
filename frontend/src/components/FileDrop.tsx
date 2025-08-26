import React, { useRef } from 'react'
export default function FileDrop({onFile}:{onFile:(f:File)=>void}){
  const ref = useRef<HTMLInputElement>(null)
  return (
    <div className="border-2 border-dashed rounded-lg p-8 text-center bg-white">
      <p className="mb-4">Drag & drop a file or click to upload</p>
      <button className="px-3 py-2 border rounded" onClick={()=>ref.current?.click()}>Choose file</button>
      <input ref={ref} type="file" className="hidden" onChange={e=>{
        const f = e.target.files?.[0]; if (f) onFile(f)
      }}/>
    </div>
  )
}