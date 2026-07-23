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
import { AuthProvider } from './context/AuthContext'
import TempleDetails from './pages/TempleDetails'
import NotFound from './pages/NotFound'
import UserProfile from './pages/UserProfile'


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
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
        path: '/temples/:id',
        element: <TempleDetails />
      },
      {
        path: '/admin-dashboard',
        element: <AdminRoute><AdminDashboard /></AdminRoute>
      },
      {
        path: '/profile',
        element: <UserProfile />
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
  },
  {
    path: '*',
    element: <NotFound />
  }
])

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)