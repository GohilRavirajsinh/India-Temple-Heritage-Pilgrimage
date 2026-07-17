import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

// Import pages
import App from './App'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import BrowseTemple from './pages/BrowseTemple'
import AdminDashboard from './pages/AdminDashboard'
import AdminRoute from './components/AdminRoute'


const router = createBrowserRouter ([
  {
    path: '/',
    element: <App/>,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/temples',
        element: <BrowseTemple />
      },
      {
        path: '/admin-dashboard',
        element: <AdminRoute><AdminDashboard /></AdminRoute> // for use as a children AdminDashboard
      },
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  }
])

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)