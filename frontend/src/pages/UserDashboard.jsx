import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserIssues, getUserComplaints, submitFeedback } from '../services/api';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('issues');
  const [feedbackModal, setFeedbackModal] = useState(null);
  const [feedback, setFeedback] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [issuesRes, complaintsRes] = await Promise.all([
        getUserIssues(),
        getUserComplaints()
      ]);
      setIssues(issuesRes.data);
      setComplaints(complaintsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSubmitFeedback = async (issueId) => {
    try {
      await submitFeedback(issueId, feedback);
      setFeedbackModal(null);
      setFeedback({ rating: 5, comment: '' });
      fetchData();
    } catch (error) {
      alert('Error submitting feedback');
    }
  };

  const getLocationString = (item) => {
    if (!item) return 'Location not available';
    if (item.address) return item.address;
    if (typeof item.location === 'string') return item.location;
    if (item.location?.address) return item.location.address;
    return 'Location not available';
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-[#FEF3C7] text-[#92400E]';
      case 'in-progress':
        return 'bg-[#DBEAFE] text-[#1E40AF]';
      case 'resolved':
        return 'bg-[#D1FAE5] text-[#065F46]';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <div className="text-xl font-bold text-slate-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans flex text-slate-900">

      {/* SIDEBAR - Width matched to design */}
      <aside className="w-[280px] bg-white border-r border-slate-100 fixed inset-y-0 left-0 z-30 flex flex-col hidden md:flex">
        <div className="p-8">
          <h1 className="text-2xl font-black text-[#5B5FC7]">UserPanel</h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <button
            onClick={() => setActiveTab('issues')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'issues'
              ? 'bg-[#EEF2FF] text-[#4F46E5]'
              : 'text-slate-500 hover:bg-slate-50'
              }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            My Issues
          </button>

          <button
            onClick={() => setActiveTab('complaints')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'complaints'
              ? 'bg-[#EEF2FF] text-[#4F46E5]'
              : 'text-slate-500 hover:bg-slate-50'
              }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            My Complaints
          </button>
        </nav>

        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-[#FEF2F2] text-[#EF4444] py-3 rounded-lg font-bold text-sm hover:bg-red-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-[280px] p-8 bg-[#FAFAFA] min-h-screen">

        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-slate-800">
            {activeTab === 'issues' ? 'My Reported Issues' : 'My Complaints'}
          </h2>

          <div className="flex items-center gap-3">
            <Link
              to="/user/report-issue"
              className="flex items-center gap-2 bg-[#3B82F6] hover:bg-blue-600 text-white px-5 py-2 rounded-lg font-bold text-sm transition-colors"
            >
              + Report Issue
            </Link>

            <Link
              to="/user/file-complaint"
              className="flex items-center gap-2 bg-[#DC2626] hover:bg-red-700 text-white px-5 py-2 rounded-lg font-bold text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              Report Violation
            </Link>

            <div className="w-9 h-9 rounded-full bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center font-bold text-sm ml-2">
              {user?.name?.charAt(0) || 'U'}
            </div>
          </div>
        </header>

        {/* Cards Grid - Adjusted for larger/wider cards */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

          {activeTab === 'issues' && (
            <>
              {issues.length === 0 ? (
                <div className="col-span-full py-20 text-center">
                  <p className="text-slate-400 font-bold">No reported issues found</p>
                </div>
              ) : (
                issues.map((issue) => (
                  /* Card Container - Fixed height 240px, increased padding */
                  <div key={issue._id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-row gap-6 h-[280px]">

                    {/* Left: Content - Takes up remaining space */}
                    <div className="flex-1 flex flex-col min-w-0 h-full relative">
                      {/* Top Row: Status Tag & Date */}
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider ${getStatusStyle(issue.status)}`}>
                          {issue.status}
                        </span>
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {new Date(issue.createdAt).toLocaleDateString('en-GB')}
                        </span>
                      </div>

                      {/* Middle: Title & Description */}
                      <div className="flex-1 mt-1 overflow-hidden">
                        <h3 className="text-xl font-black text-slate-900 mb-1 truncate">{issue.title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                          {issue.description}
                        </p>
                      </div>

                      {/* Rating / Action Area */}
                      {issue.status === 'Resolved' && (
                        <div className="mb-3">
                          {issue.feedback ? (
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-100">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <svg key={i} className={`w-4 h-4 ${i < issue.feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="text-xs font-bold uppercase tracking-wide">Rated</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => setFeedbackModal(issue._id)}
                              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]"
                            >
                              <span>⭐</span> Rate Service & Close
                            </button>
                          )}
                        </div>
                      )}

                      {/* Bottom: Location Box (Pinned to bottom) */}
                      <div className="bg-[#F8F9FA] rounded-xl p-3.5 flex items-center gap-3 mt-auto w-full">
                        <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm text-slate-500 font-bold truncate">
                          {getLocationString(issue)}
                        </span>
                      </div>
                    </div>

                    {/* Right: Image - Fixed Width Square/Rect */}
                    <div className="w-[220px] h-full flex-shrink-0">
                      {issue.image ? (
                        <img
                          src={`http://localhost:5001${issue.image}`}
                          alt="Issue"
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-50 rounded-xl flex items-center justify-center">
                          <span className="text-slate-300 font-bold text-xs uppercase">No Image</span>
                        </div>
                      )}

                      {/* Rate Resolution Button for Resolved Issues */}
                      {issue.status === 'Resolved' && !issue.feedback && (
                        <button
                          onClick={() => setFeedbackModal(issue._id)}
                          className="absolute bottom-2 right-2 bg-yellow-400 hover:bg-yellow-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md transition-all flex items-center gap-1 z-10"
                        >
                          <span>⭐</span> Rate Work
                        </button>
                      )}
                    </div>

                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'complaints' && (
            <>
              {complaints.length === 0 ? (
                <div className="col-span-full py-20 text-center">
                  <p className="text-slate-400 font-bold">No complaints found</p>
                </div>
              ) : (
                complaints.map((complaint) => (
                  <div key={complaint._id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-row gap-6 h-[280px]">
                    <div className="flex-1 flex flex-col min-w-0 h-full relative">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider ${complaint.actionTaken ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-[#FEF3C7] text-[#92400E]'
                          }`}>
                          {complaint.actionTaken ? 'Resolved' : 'Pending'}
                        </span>
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {new Date(complaint.createdAt).toLocaleDateString('en-GB')}
                        </span>
                      </div>

                      <div className="flex-1 mt-1 overflow-hidden">
                        <h3 className="text-xl font-black text-slate-900 mb-1 truncate">{complaint.title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                          {complaint.description}
                        </p>
                      </div>

                      <div className="bg-[#F8F9FA] rounded-xl p-3.5 flex items-center gap-3 mt-auto w-full">
                        <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm text-slate-500 font-bold truncate">
                          {getLocationString(complaint)}
                        </span>
                      </div>
                    </div>

                    <div className="w-[220px] h-full flex-shrink-0 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                      {complaint.video ? (
                        <video
                          src={`http://localhost:5001${complaint.video}`}
                          controls
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-xs font-bold text-slate-300 uppercase">No Media</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </>
          )}

        </div>
      </main>

      {/* Feedback Modal */}
      {feedbackModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-black text-slate-800 mb-6 text-center tracking-tight">Rate Resolution</h3>

            <div className="space-y-6">
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFeedback({ ...feedback, rating: star })}
                    className={`text-4xl transition-transform hover:scale-110 ${star <= feedback.rating ? 'grayscale-0' : 'grayscale opacity-20'}`}
                  >
                    ⭐
                  </button>
                ))}
              </div>

              <textarea
                value={feedback.comment}
                onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[120px] text-sm font-medium resize-none"
                placeholder="How was the service?"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setFeedbackModal(null)}
                  className="flex-1 bg-white text-slate-700 border border-slate-200 py-3 rounded-xl font-bold text-sm hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSubmitFeedback(feedbackModal)}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-500/30"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
