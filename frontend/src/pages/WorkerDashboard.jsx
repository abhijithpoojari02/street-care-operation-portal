import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getWorkerIssues, updateIssueStatus } from '../services/api';

const WorkerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const response = await getWorkerIssues();
      setIssues(response.data);
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (issueId, newStatus) => {
    try {
      await updateIssueStatus(issueId, newStatus);
      alert('Status updated successfully!');
      fetchIssues();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'In-Progress':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 font-bold';
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const filteredIssues = filter === 'all'
    ? issues
    : issues.filter(issue => issue.status === filter);

  const stats = {
    total: issues.length,
    pending: issues.filter(i => i.status === 'Pending').length,
    inProgress: issues.filter(i => i.status === 'In-Progress').length,
    resolved: issues.filter(i => i.status === 'Resolved').length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      {/* Header */}
      <div className="bg-white border-b border-indigo-100 shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 leading-none">WORKER<span className="text-indigo-600">PORTAL</span></h1>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">{user?.name} (ID: {user?.employeeId})</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="px-4 py-2 text-sm font-bold uppercase rounded-xl border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white p-6 rounded-2xl shadow-xl shadow-indigo-500/20 relative overflow-hidden">
            <h3 className="text-xs font-bold uppercase tracking-widest opacity-80 relative z-10">Total Assigned</h3>
            <p className="text-4xl font-black mt-2 relative z-10">{stats.total}</p>
            <div className="absolute top-0 right-0 -mt-2 -mr-2 w-20 h-20 bg-white opacity-10 rounded-full blur-xl"></div>
          </div>
          <div className="bg-white text-slate-800 p-6 rounded-2xl border border-indigo-50 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Pending</h3>
            <p className="text-4xl font-black mt-2 text-amber-500">{stats.pending}</p>
          </div>
          <div className="bg-white text-slate-800 p-6 rounded-2xl border border-indigo-50 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">In Progress</h3>
            <p className="text-4xl font-black mt-2 text-indigo-600">{stats.inProgress}</p>
          </div>
          <div className="bg-white text-slate-800 p-6 rounded-2xl border border-indigo-50 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Resolved</h3>
            <p className="text-4xl font-black mt-2 text-emerald-500">{stats.resolved}</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="bg-white rounded-2xl border border-indigo-50 shadow-sm overflow-hidden mb-8">
          <div className="flex overflow-x-auto p-1">
            {['all', 'Pending', 'In-Progress', 'Resolved'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 py-3 px-6 text-sm font-bold uppercase tracking-wider transition-all rounded-xl ${filter === f
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                  : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-50'
                  }`}
              >
                {f} <span className="text-xs opacity-70 ml-1">({f === 'all' ? stats.total : stats[f === 'In-Progress' ? 'inProgress' : f.toLowerCase()]})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Issues List */}
        <div className="space-y-6">
          {filteredIssues.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
              <p className="text-slate-400 font-bold uppercase tracking-wider">No issues found</p>
            </div>
          ) : (
            filteredIssues.map((issue) => (
              <div key={issue._id} className="bg-white border border-indigo-50 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/10 rounded-2xl p-6 transition-all duration-300">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-800">{issue.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(issue.status)}`}>
                        {issue.status}
                      </span>
                    </div>

                    <p className="text-slate-600 mb-4 leading-relaxed">{issue.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-500">
                        {issue.category}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 border-t border-slate-50 pt-4 mt-4">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs">👤</span>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Reported By</span>
                          <span className="font-bold text-slate-700">{issue.user.name}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs">📍</span>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Location</span>
                          <span className="font-bold text-slate-700">{issue.location.address}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs">📅</span>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Date</span>
                          <span className="font-bold text-slate-700">{new Date(issue.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${issue.location?.latitude || ''},${issue.location?.longitude || ''}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-indigo-100 hover:text-indigo-800 transition-all shadow-sm hover:shadow-indigo-100 border border-indigo-100"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-1.447-.894L15 7m0 13V7" /></svg>
                          Get Directions
                        </a>
                      </div>
                    </div>
                  </div>
                  {issue.image && (
                    <img
                      src={`http://localhost:5001${issue.image}`}
                      alt="Issue"
                      className="w-full md:w-48 h-48 object-cover rounded-2xl shadow-sm border border-slate-100"
                    />
                  )}
                </div>

                {issue.feedback && (
                  <div className="mx-6 mb-6 mt-2 bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                    <div className="bg-yellow-100 p-2 rounded-full text-yellow-600">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                    </div>
                    <div>
                      <h4 className="text-yellow-800 font-bold text-sm uppercase tracking-wide mb-1">User Feedback</h4>
                      <div className="flex items-center gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-4 h-4 ${i < issue.feedback.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-xs font-bold text-yellow-700 ml-2">({issue.feedback.rating}/5)</span>
                      </div>
                      <p className="text-yellow-900 text-sm font-medium italic">"{issue.feedback.comment}"</p>
                    </div>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-indigo-50 flex justify-between items-center bg-slate-50/50 -mx-6 -mb-6 px-6 py-4 rounded-b-2xl">
                  <div className="hidden md:block text-xs text-slate-400 font-bold uppercase tracking-wider">
                    Last Update: {new Date(issue.updatedAt).toLocaleDateString()}
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <label className="text-xs font-bold text-slate-500 uppercase whitespace-nowrap">Update Status:</label>
                    {issue.status === 'Resolved' ? (
                      <span className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-bold border border-emerald-100 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        RESOLVED
                      </span>
                    ) : (
                      <select
                        value={issue.status}
                        onChange={(e) => handleStatusUpdate(issue._id, e.target.value)}
                        className="flex-1 md:flex-none text-sm border border-slate-200 bg-white rounded-xl px-4 py-2 font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none uppercase text-slate-700 shadow-sm"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In-Progress">In-Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>

  );
};

export default WorkerDashboard;