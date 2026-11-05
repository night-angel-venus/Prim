import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import FedexPage from './pages/Fedex';
import TiktokPage from './pages/Tiktok';
import PhrasebankPage from './pages/Phrasebank';
import ContactsPage from './pages/Contacts';
import AccountsPage from './pages/Accounts';
import ReportsPage from './pages/Reports';
import DeadlinesPage from './pages/Deadlines';
import PurchasesPage from './pages/Purchases';
import Layout from './components/Layout';


function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to='/' replace />
  }

  return <>{children}</>
}

function App() {

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <Employees />
            </ProtectedRoute>
          }
        />

        <Route
          path="/fedex"
          element={
            <ProtectedRoute>
              <FedexPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tiktok"
          element={
            <ProtectedRoute>
              <TiktokPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/phrasebank"
          element={
            <ProtectedRoute>
              <PhrasebankPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/purchases"
          element={
            <ProtectedRoute>
              <PurchasesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/contacts"
          element={
            <ProtectedRoute>
              <ContactsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/accounts"
          element={
            <ProtectedRoute>
              <AccountsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <ReportsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/deadlines"
          element={
            <ProtectedRoute>
              <DeadlinesPage />
            </ProtectedRoute>
          }
        />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
