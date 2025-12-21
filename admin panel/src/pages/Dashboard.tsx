import { LayoutDashboard, Briefcase, Users, FileText } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { label: 'Total Positions', value: '24', icon: Briefcase, color: 'bg-blue-500' },
    { label: 'Candidats', value: '156', icon: Users, color: 'bg-green-500' },
    { label: 'Applications', value: '342', icon: FileText, color: 'bg-orange-500' },
    { label: 'Active Jobs', value: '18', icon: LayoutDashboard, color: 'bg-purple-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your job portal dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 flex items-center gap-4 hover:shadow-lg transition-shadow">
              <div className={`w-14 h-14 ${stat.color} bg-opacity-10 rounded-xl flex items-center justify-center`}>
                <Icon className={`${stat.color.replace('bg-', 'text-')}`} size={24} />
              </div>
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-2">Recent Activity</h2>
        <p className="text-gray-500">Latest updates will appear here</p>
      </div>
    </div>
  );
};

export default Dashboard;
