import React from 'react'
import { Navigate, replace } from 'react-router-dom'

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // Agar token nahi hai ya role admin nahi hai, toh seedha login page par bhej do
  if (!token || role !== 'admin') {
    return <Navigate to='/login' replace />
  }

  // Agar admin hai, toh chuchaap component load hone do
  return children
}

export default AdminRoute;