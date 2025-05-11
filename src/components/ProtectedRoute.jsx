import { Navigate, Outlet } from 'react-router-dom'
import { auth } from '../firebase' // Reuse your Firebase auth

export default function ProtectedRoute() {
  const user = auth.currentUser // Check Firebase auth state

  return user ? <Outlet /> : <Navigate to="/" replace />
}