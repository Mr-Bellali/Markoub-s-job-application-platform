import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import Dashboard from '../pages/Dashboard';
import Positions from '../pages/Positions';
import CreatePosition from '../pages/CreatePosition';
import Candidats from '../pages/Candidates';
import Applications from '../pages/Applications';
import Admins from '../pages/Admins';
import Login from '../pages/Login';
import ApplicationDetail from '../pages/ApplicationDetail';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/positions" element={<Positions />} />
          <Route path="/positions/create" element={<CreatePosition />} />
          <Route path="/candidats" element={<Candidats />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/admins" element={<Admins />} />
          <Route path="/applications/:id" element={<ApplicationDetail />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
