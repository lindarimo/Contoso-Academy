import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { lazy, Suspense } from 'react';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ProfiloUtente = lazy(() => import('./pages/ProfiloUtente'));
const GestioneUtenti = lazy(() => import('./pages/GestioneUtenti'));
const CorsoDettaglio = lazy(() => import('./pages/CorsoDettaglio'));
const StatisticheDashboard = lazy(() => import('./pages/StatisticheDashboard'));
const ProtectedRoute = lazy(() => import('./routes/ProtectedRoute'));
const AppLayout = lazy(() => import('./layout/AppLayout'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<div>Caricamento...</div>}>
        <Routes>
          {/* Login */}
          <Route path="/" element={<LoginPage />} />

          {/* Area protetta con layout */}
          <Route element={<AppLayout />}>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/utenti"
              element={
                <ProtectedRoute requiredRole="admin">
                  <GestioneUtenti />
                </ProtectedRoute>
              }
            />
            <Route
              path="/utenti/:id"
              element={
                <ProtectedRoute requiredRole="admin">
                  <GestioneUtenti />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profilo"
              element={
                <ProtectedRoute requiredRole={["admin", "studente"]}>
                  <ProfiloUtente />
                </ProtectedRoute>
              }
            />
            <Route
              path="/corsi/:id"
              element={
                <ProtectedRoute requiredRole={["admin", "studente"]}>
                  <CorsoDettaglio />
                </ProtectedRoute>
              }
            />
            <Route
              path="/statistiche"
              element={
                <ProtectedRoute requiredRole="admin">
                  <StatisticheDashboard />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Redirect fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
