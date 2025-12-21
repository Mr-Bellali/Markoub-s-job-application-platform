import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import Dashboard from '../pages/Dashboard';
import Positions from '../pages/Positions';
import Candidats from '../pages/Candidats';
import Applications from '../pages/Applications';
import Admins from '../pages/Admins';
import Login from '../pages/Login';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/positions" element={<Positions />} />
          <Route path="/candidats" element={<Candidats />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/admins" element={<Admins />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
