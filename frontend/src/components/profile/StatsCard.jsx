const StatsCard = ({ stats }) => {
  return (
    <div className="p-4 bg-base-200">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary">Statistics Card</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
          {/* Total Solved */}
          <div className="stat bg-base-100 rounded-lg shadow">
            <div className="stat-title">Total Solved</div>
            <div className="stat-value text-primary">{stats.totalSolved}</div>
          </div>

          {/* Easy */}
          <div className="stat bg-base-100 rounded-lg shadow">
            <div className="stat-title">Easy</div>
            <div className="stat-value text-success">{stats.easy}</div>
          </div>

          {/* Medium */}
          <div className="stat bg-base-100 rounded-lg shadow">
            <div className="stat-title">Medium</div>
            <div className="stat-value text-warning">{stats.medium}</div>
          </div>

          {/* Hard */}
          <div className="stat bg-base-100 rounded-lg shadow">
            <div className="stat-title">Hard</div>
            <div className="stat-value text-error">{stats.hard}</div>
          </div>

          {/* Streak */}
          {/* <div className="stat bg-base-100 rounded-lg shadow">
        <div className="stat-title">Total Submited</div>
        <div className="stat-value">{stats.totalSubmited}</div>
      </div> */}

          {/* Highest Streak */}
          {/* <div className="stat bg-base-100 rounded-lg shadow">
        <div className="stat-title">Highest Streak</div>
        <div className="stat-value">{stats.highestStreak} days</div>
      </div> */}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
