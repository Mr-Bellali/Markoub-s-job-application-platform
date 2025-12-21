import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  UserCog,
  LogOutIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LOGO from "../assets/logo.webp"

const Sidebar = () => {
  const { logout } = useAuth();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/positions', label: 'Positions', icon: Briefcase },
    { path: '/candidats', label: 'Candidats', icon: Users },
    { path: '/applications', label: 'Applications', icon: FileText },
    { path: '/admins', label: 'Admins', icon: UserCog },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className="w-72 bg-white flex flex-col border-r border-gray-200 shadow-sm">
      {/* Logo Section */}
      <div className="p-8 flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
          <img src={LOGO} alt="markoub-logo" className="w-full h-full object-cover" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">MARKOUB jobs</h2>
          <p className="text-xs text-gray-500">Admin panel</p>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all group ${
                  isActive
                    ? 'bg-[#ff6804] text-gray-800'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#ff6804]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-2 rounded-xl transition-all ${
                    isActive ? 'bg-white' : 'bg-transparent'
                  }`}>
                    <Icon size={22} className={isActive ? 'text-[#ff6804]' : 'text-gray-400 group-hover:text-[#ff6804]'} />
                  </div>
                  <span className="font-medium text-[15px]">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="border-t border-gray-200 mx-4"></div>

      {/* Logout Section */}
      <div className="p-4">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-5 py-3.5 text-gray-600 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all group"
        >
          <LogOutIcon size={22} className="text-gray-400 group-hover:text-red-500" />
          <span className="font-medium text-[15px]">Logout</span>
        </button>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 text-center border-t border-gray-200">
        <p className="text-xs text-gray-400">Markoub Jobs Admin Panel</p>
        <p className="text-xs text-gray-400 mt-1">© {new Date().getFullYear()} All Rights Reserved</p>
      </div>
    </aside>
  );
};

export default Sidebar;
