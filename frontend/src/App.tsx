import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';



function ProtectedRoute({children}:{children: React.ReactNode}) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to='/' replace/>
  }

  return <>{children}</>
}

function App() {

  return (
   <BrowserRouter>
    <Routes>
      
      <Route path="/" element={<Login/>}/>

      <Route
        path="/dashboard"
        element = {
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path = "/employees"
        element = {
          <ProtectedRoute>
            <Employees/>
          </ProtectedRoute>
        }
      />
    </Routes>
   </BrowserRouter>
  )
}

export default App
