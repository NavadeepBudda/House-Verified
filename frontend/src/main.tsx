import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App'
import Home from './routes/Home'
import Verify from './routes/Verify'
import Asset from './routes/Asset'

const router = createBrowserRouter([
  { path: '/', element: <App/>, children: [
    { index: true, element: <Home/> },
    { path: 'verify', element: <Verify/> },
    { path: 'asset/:id', element: <Asset/> }
  ]}
])

createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />)