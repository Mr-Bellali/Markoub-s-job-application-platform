const Dashboard = () => {
  const connectedAccount = JSON.parse(localStorage.getItem("auth_account") as string);

  return (
    <div className="w-full mx-auto px-12 py-10">
      {/* Admin Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#ff6804] to-[#ff8a3d] shadow-xl">

        {/* Decorative blur */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/20 rounded-full blur-3xl" />

        <div className="relative flex items-center gap-10 px-10 py-8">

          {/* Avatar */}
          <div className="relative">
            <div className="w-36 h-36 bg-white rounded-full flex items-center justify-center ring-8 ring-white/30 shadow-lg">
              <span className="text-6xl font-extrabold text-[#ff6804]">
                {connectedAccount.firstName.charAt(0)}
              </span>
            </div>
          </div>

          {/* User info */}
          <div className="flex-1 flex flex-col gap-4 text-white">
            <div>
              <h2 className="text-3xl font-bold leading-tight">
                {connectedAccount.firstName} {connectedAccount.lastName}
              </h2>
              <p className="text-white/80 text-sm">
                {connectedAccount.email}
              </p>
            </div>

            {/* Role badge */}
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/20 backdrop-blur text-sm font-semibold">
                {connectedAccount.role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
