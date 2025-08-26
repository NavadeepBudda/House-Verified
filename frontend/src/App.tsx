import React from 'react'
import { Link, Outlet, NavLink } from 'react-router-dom'

export default function App(){
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="font-semibold text-blue-900">House Verified</Link>
          <nav className="flex gap-6 text-sm">
            <NavLink to="/" end className={({isActive})=>isActive? 'text-blue-700' : 'text-gray-700'}>Showcase</NavLink>
            <NavLink to="/verify" className={({isActive})=>isActive? 'text-blue-700' : 'text-gray-700'}>Verify</NavLink>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Outlet/>
        </div>
      </main>
      <footer className="border-t text-xs text-gray-500">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <span>© House Verified MVP</span>
          <span>Privacy · Accessibility · Open Source</span>
        </div>
      </footer>
    </div>
  )
}