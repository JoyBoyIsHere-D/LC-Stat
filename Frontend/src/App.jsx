import React, { useEffect, useState } from "react";

// Stats Card Component
const StatsCard = ({ label, value, color = "blue" }) => {
  const colorClasses = {
    green: "bg-green-50 border-green-200 text-green-800",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-800",
    red: "bg-red-50 border-red-200 text-red-800",
    blue: "bg-blue-50 border-blue-200 text-blue-800"
  };

  return (
    <div className={`px-4 py-3 rounded-lg border ${colorClasses[color]}`}>
      <div className="text-sm font-medium opacity-75">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
};

// Submission Item Component
const SubmissionItem = ({ submission }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center space-x-3">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="font-medium text-gray-900">{submission.title}</span>
      </div>
      <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-md">
        {submission.time}
      </span>
    </div>
  );
};

// User Card Component
const UserCard = ({ user }) => {
  const totalSolved = user.totals ? user.totals.easy + user.totals.medium + user.totals.hard : 0;

  if (user.error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-600 font-semibold">❌</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">{user.username}</h2>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 font-medium">Error fetching data</p>
          <p className="text-red-600 text-sm mt-1">{user.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">👤</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{user.username}</h2>
              <p className="text-gray-500 text-sm">LeetCode Profile</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{totalSolved}</div>
            <div className="text-sm text-gray-500">Total Solved</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Problem Statistics</h3>
        <div className="grid grid-cols-3 gap-4">
          <StatsCard 
            label="Easy" 
            value={user.totals?.easy || 0} 
            color="green" 
          />
          <StatsCard 
            label="Medium" 
            value={user.totals?.medium || 0} 
            color="yellow" 
          />
          <StatsCard 
            label="Hard" 
            value={user.totals?.hard || 0} 
            color="red" 
          />
        </div>
      </div>

      {/* Today's Submissions */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Today's Activity</h3>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {user.todaySubs?.length || 0} submissions
          </span>
        </div>
        
        {!user.todaySubs || user.todaySubs.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-gray-400 text-2xl">📝</span>
            </div>
            <p className="text-gray-500 font-medium">No submissions today</p>
            <p className="text-gray-400 text-sm">Keep up the practice!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {user.todaySubs.map((sub, i) => (
              <SubmissionItem key={i} submission={sub} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Loading Component
const Loading = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-3 text-gray-600">Loading report...</span>
    </div>
  );
};

// Main App Component
function App() {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://lc-stat-backend.onrender.com/api/report")
      .then(res => res.json())
      .then(data => {
        setReport(data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🚀 LeetCode Daily Report
          </h1>
          <p className="text-gray-600 text-lg">
            Track your coding progress and daily submissions
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mt-4"></div>
        </div>

        {/* Content */}
        {loading ? (
          <Loading />
        ) : report.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-3xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Data Available</h3>
            <p className="text-gray-500">Unable to fetch report data. Please try again later.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {report.map(user => (
              <UserCard key={user.username} user={user} />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;