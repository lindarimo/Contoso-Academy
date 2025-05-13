import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ProfiloUtente from "./pages/ProfiloUtente";
import GestioneUtenti from "./pages/GestioneUtenti";
import CorsoDettaglio from "./pages/CorsoDettaglio";
import StatisticheDashboard from "./pages/StatisticheDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import AppLayout from "./layout/AppLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          element={
            <AppLayout>
              <Routes>
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
                    <ProtectedRoute requiredRole={["admin", "user"]}>
                      <ProfiloUtente />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/corsi/:id"
                  element={
                    <ProtectedRoute requiredRole={["admin", "user"]}>
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
              </Routes>
            </AppLayout>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
