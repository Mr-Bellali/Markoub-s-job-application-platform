import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  FileText, 
  UserCog 
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/positions', label: 'Positions', icon: Briefcase },
    { path: '/candidats', label: 'Candidats', icon: Users },
    { path: '/applications', label: 'Applications', icon: FileText },
    { path: '/admins', label: 'Admins', icon: UserCog },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800">
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-2xl font-bold">Job Portal</h2>
      </div>
      
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3.5 text-white/70 transition-all border-l-4 ${
                  isActive 
                    ? 'bg-blue-500/10 text-blue-500 border-blue-500' 
                    : 'border-transparent hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
