import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getAllIssues,
  getAllWorkers,
  getAllComplaints,
  assignWorker,
  markActionTaken,
  getAnalytics,
  approveWorker,
  updateIssueStatus,
} from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';
import Button from '../components/ui/Button';

// Vibrant Palette
const COLORS = ['#6366f1', '#a855f7', '#f43f5e', '#10b981', '#f59e0b', '#3b82f6'];

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [issues, setIssues] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assignModal, setAssignModal] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState('');
  const [complaintModal, setComplaintModal] = useState(null);
  const [actionNotes, setActionNotes] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [issuesRes, workersRes, complaintsRes, analyticsRes] = await Promise.all([
        getAllIssues(),
        getAllWorkers(),
        getAllComplaints(),
        getAnalytics(),
      ]);
      setIssues(issuesRes.data);
      setWorkers(workersRes.data);
      setComplaints(complaintsRes.data);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignWorker = async (issueId) => {
    try {
      await assignWorker(issueId, selectedWorker);
      alert('Worker assigned successfully!');
      setAssignModal(null);
      setSelectedWorker('');
      fetchData();
    } catch (error) {
      alert('Failed to assign worker');
    }
  };

  const handleMarkAction = async (complaintId) => {
    try {
      await markActionTaken(complaintId, actionNotes);
      alert('Action marked successfully!');
      setComplaintModal(null);
      setActionNotes('');
      fetchData();
    } catch (error) {
      alert('Failed to mark action');
    }
  };

  const handleApproveWorker = async (workerId) => {
    try {
      await approveWorker(workerId);
      alert('Worker approved successfully!');
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to approve worker');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'In-Progress':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold';
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-xl font-bold text-indigo-600 animate-pulse">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      {/* Header */}
      <div className="bg-white border-b border-indigo-100 shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 leading-none">ADMIN<span className="text-indigo-600">PANEL</span></h1>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Welcome, {user?.name}</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-2xl p-1.5 border border-indigo-50 shadow-sm mb-8 inline-flex flex-wrap gap-1">
          {['dashboard', 'issues', 'complaints', 'workers'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wide transition-all duration-300 ${activeTab === tab
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-600 ring-offset-2'
                : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div>
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && analytics && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Stats Cards */}
              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-6 rounded-3xl shadow-xl shadow-indigo-500/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform scale-150">
                    <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
                  </div>
                  <h3 className="text-indigo-100 font-bold text-sm uppercase tracking-wider mb-1">Total Issues</h3>
                  <p className="text-4xl font-black">{analytics.totals.issues}</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-indigo-50 shadow-xl shadow-indigo-100/50 group hover:border-indigo-100 transition-all">
                  <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  </div>
                  <h3 className="text-slate-400 font-bold text-sm uppercase tracking-wider mb-1">Active Users</h3>
                  <p className="text-3xl font-black text-slate-800">{analytics.totals.users}</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-indigo-50 shadow-xl shadow-indigo-100/50 group hover:border-indigo-100 transition-all">
                  <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  </div>
                  <h3 className="text-slate-400 font-bold text-sm uppercase tracking-wider mb-1">Workers</h3>
                  <p className="text-3xl font-black text-slate-800">{analytics.totals.workers}</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-indigo-50 shadow-xl shadow-indigo-100/50 group hover:border-indigo-100 transition-all">
                  <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3" /></svg>
                  </div>
                  <h3 className="text-slate-400 font-bold text-sm uppercase tracking-wider mb-1">Complaints</h3>
                  <p className="text-3xl font-black text-slate-800">{analytics.totals.complaints}</p>
                </div>
              </div>

              {/* Charts */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-indigo-50 shadow-xl shadow-indigo-100/50">
                  <h3 className="text-lg font-bold mb-6 text-slate-800">Status Overview</h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: 'Pending', value: analytics.issuesByStatus.pending },
                        { name: 'In Progress', value: analytics.issuesByStatus.inProgress },
                        { name: 'Resolved', value: analytics.issuesByStatus.resolved },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                        <Tooltip
                          cursor={{ fill: '#f1f5f9' }}
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                          {
                            [analytics.issuesByStatus.pending, analytics.issuesByStatus.inProgress, analytics.issuesByStatus.resolved].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))
                          }
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-indigo-50 shadow-xl shadow-indigo-100/50">
                  <h3 className="text-lg font-bold mb-6 text-slate-800">Issues by Category</h3>
                  <div className="h-[300px] w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analytics.issuesByCategory}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="count"
                        >
                          {analytics.issuesByCategory.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap gap-3 justify-center mt-4">
                    {analytics.issuesByCategory.map((entry, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        {entry.category}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Issues Tab */}
          {activeTab === 'issues' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Recent Issues</h2>
              {issues.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-indigo-50 shadow-sm">
                  <p className="text-slate-400 font-medium">No issues reported yet.</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {issues.map((issue) => (
                    <div key={issue._id} className="bg-white border border-indigo-50 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-bold text-xl text-slate-800">{issue.title}</h3>
                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(issue.status)}`}>
                              {issue.status}
                            </span>
                          </div>

                          <p className="text-slate-600 mb-4 leading-relaxed">{issue.description}</p>

                          <div className="flex flex-wrap gap-3 mb-6">
                            <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                              {issue.category}
                            </span>
                          </div>

                          <div className="bg-slate-50 rounded-xl p-4 flex flex-wrap gap-6 text-sm text-slate-500">
                            <div>
                              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Reported By</span>
                              <span className="font-semibold text-slate-700">{issue.user.name}</span>
                            </div>
                            <div>
                              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Date</span>
                              <span className="font-semibold text-slate-700">{new Date(issue.createdAt).toLocaleDateString()}</span>
                            </div>
                            {issue.assignedWorker && (
                              <div>
                                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Assigned Worker</span>
                                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{issue.assignedWorker.name}</span>
                              </div>
                            )}
                          </div>

                          <div className="mt-6 flex items-center gap-4">
                            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status:</label>
                              {issue.status === 'Resolved' ? (
                                <span className="px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-bold border border-emerald-100 flex items-center gap-2">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                  RESOLVED
                                </span>
                              ) : (
                                <select
                                  value={issue.status}
                                  onChange={async (e) => {
                                    try {
                                      await updateIssueStatus(issue._id, e.target.value);
                                      fetchData();
                                    } catch (error) {
                                      alert(error.response?.data?.message || 'Failed to update status');
                                    }
                                  }}
                                  className="text-sm font-bold text-slate-700 bg-transparent border-none focus:ring-0 cursor-pointer"
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="In-Progress">In-Progress</option>
                                </select>
                              )}
                            </div>

                            {!issue.assignedWorker && (
                              <Button
                                size="sm"
                                onClick={() => setAssignModal(issue._id)}
                                className="shadow-indigo-500/20"
                              >
                                Assign Worker
                              </Button>
                            )}
                          </div>
                        </div>

                        {issue.image && (
                          <div className="w-full md:w-64 h-48 flex-shrink-0">
                            <img
                              src={`http://localhost:5001${issue.image}`}
                              alt="Issue"
                              className="w-full h-full object-cover rounded-2xl shadow-md"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Complaints Tab */}
          {activeTab === 'complaints' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Community Complaints</h2>
              {complaints.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-indigo-50 shadow-sm">
                  <p className="text-slate-400 font-medium">No complaints found.</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {complaints.map((complaint) => (
                    <div key={complaint._id} className="bg-white border border-indigo-50 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:shadow-rose-500/5 transition-all duration-300 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-rose-400 to-rose-600"></div>
                      <h3 className="font-bold text-lg text-slate-800">{complaint.title}</h3>
                      <p className="text-slate-600 mt-2">{complaint.description}</p>

                      <div className="flex flex-wrap gap-4 mt-6 p-4 bg-slate-50 rounded-xl">
                        <div className="text-sm text-slate-500">
                          <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Reporter</span>
                          <span className="font-semibold text-slate-900">{complaint.user.name}</span>
                        </div>
                        <div className="text-sm text-slate-500">
                          <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Location</span>
                          <span className="font-semibold text-slate-900">📍 {complaint.location.address}</span>
                        </div>
                      </div>

                      <div className="mt-6">
                        <div className="aspect-video w-full max-w-md rounded-xl overflow-hidden shadow-lg bg-black">
                          <video
                            src={`http://localhost:5001${complaint.video}`}
                            controls
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {complaint.actionTaken ? (
                        <div className="mt-6 bg-emerald-50 border border-emerald-100 px-5 py-4 rounded-xl flex items-start gap-3">
                          <div className="bg-emerald-100 p-1 rounded-full text-emerald-600 mt-0.5">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          </div>
                          <div>
                            <p className="text-emerald-800 font-bold text-sm uppercase tracking-wide">Action Taken</p>
                            <p className="text-emerald-700 mt-1 text-sm">{complaint.actionNotes}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-6">
                          <Button
                            variant="secondary"
                            onClick={() => setComplaintModal(complaint._id)}
                            className="border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                          >
                            Mark Action Taken
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Workers Tab */}
          {activeTab === 'workers' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Street Care Team</h2>
              {workers.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-indigo-50 shadow-sm">
                  <p className="text-slate-400 font-medium">No workers registered.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {workers.map((worker) => (
                    <div key={worker._id} className="bg-white border border-indigo-50 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 group">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-3xl shadow-inner">
                          👷
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-800 group-hover:text-indigo-600 transition-colors">{worker.name}</h3>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{worker.specialization}</span>
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400 font-medium">ID</span>
                          <span className="font-mono text-slate-600 bg-slate-50 px-2 py-1 rounded">{worker.employeeId}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400 font-medium">Status</span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${worker.isActive
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-100 text-slate-500'
                              }`}
                          >
                            {worker.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400 font-medium">Account</span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${worker.isApproved
                              ? 'bg-indigo-100 text-indigo-700'
                              : 'bg-amber-100 text-amber-700'
                              }`}
                          >
                            {worker.isApproved ? 'Approved' : 'Pending'}
                          </span>
                        </div>
                      </div>

                      {!worker.isApproved && (
                        <Button
                          onClick={() => handleApproveWorker(worker._id)}
                          className="w-full rounded-xl shadow-lg shadow-indigo-500/20"
                        >
                          Approve Worker
                        </Button>
                      )}

                      {worker.isApproved && (
                        <div className="w-full py-2 text-center text-xs font-bold text-indigo-300 uppercase tracking-widest border-t border-slate-50 mt-4">
                          Verified Member
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Assign Worker Modal */}
      {assignModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-black text-slate-800 mb-6 tracking-tight">Assign Worker</h3>
            <div className="relative mb-6">
              <select
                value={selectedWorker}
                onChange={(e) => setSelectedWorker(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none appearance-none font-medium"
              >
                <option value="">Select a worker...</option>
                {workers
                  .filter((w) => w.isActive && w.isApproved)
                  .map((worker) => (
                    <option key={worker._id} value={worker._id}>
                      {worker.name} — {worker.specialization}
                    </option>
                  ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => handleAssignWorker(assignModal)}
                disabled={!selectedWorker}
                className="flex-1 rounded-xl"
              >
                Assign
              </Button>
              <Button
                variant="outline"
                onClick={() => setAssignModal(null)}
                className="flex-1 rounded-xl"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Complaint Action Modal */}
      {complaintModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-black text-slate-800 mb-2 tracking-tight">Mark Action Taken</h3>
            <p className="text-slate-500 text-sm mb-6">Describe the steps taken to resolve this complaint.</p>
            <textarea
              value={actionNotes}
              onChange={(e) => setActionNotes(e.target.value)}
              placeholder="e.g. Deployment team sent to fix the streetlight..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl mb-6 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none min-h-[120px]"
            />
            <div className="flex gap-3">
              <Button
                onClick={() => handleMarkAction(complaintModal)}
                className="flex-1 rounded-xl"
              >
                Submit
              </Button>
              <Button
                variant="outline"
                onClick={() => setComplaintModal(null)}
                className="flex-1 rounded-xl"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
