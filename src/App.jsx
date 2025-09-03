import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { CreateMemePage } from './pages/CreateMemePage';
import { DashboardPage } from './pages/DashboardPage';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreateMemePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/edit/:memeId" element={<CreateMemePage />} />
          <Route path="/meme/:memeId" element={<CreateMemePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
