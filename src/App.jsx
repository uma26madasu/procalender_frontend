import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/loginpPage' // Your existing login page
import Dashboard from './pages/Dashboard' // New component to create
import ProtectedRoute from './components/ProtectedRoute' // For auth protection

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LoginPage />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Add more protected routes here */}
      </Route>

      {/* Fallback 404 */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  )
}