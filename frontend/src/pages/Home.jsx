import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

const Home = () => {
  return (
    <div className="min-h-screen font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <header className="fixed w-full top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">
              SC
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900">
              Street<span className="text-indigo-600">Care.</span>
            </span>
          </div>

          <nav className="flex items-center gap-6">
            <Link to="/admin/login" className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
              Admin Access
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-5xl mx-auto mb-24">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold text-sm tracking-wide shadow-sm">
            ✨ Making our cities cleaner, together
          </div>
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight mb-8 leading-[0.9] text-slate-900">
            REPORT<br />
            STREET<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-500 animate-gradient-x">
              ISSUES.
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-slate-600 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
            The simplest way to keep our city clean. Snap a photo, report the location, and track the fix in real-time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link to="/user/login" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-16 px-10 text-xl rounded-2xl shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all duration-300">
                Report an Issue
              </Button>
            </Link>
            <Link to="/worker/login" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-16 px-10 text-xl rounded-2xl border-2 hover:bg-indigo-50/50 backdrop-blur-sm">
                Worker Portal
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div className="group p-8 bg-white border border-indigo-50 rounded-[2rem] hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-0 group-hover:opacity-100"></div>
            <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 text-2xl shadow-inner text-indigo-600 group-hover:scale-110 transition-transform duration-300">
              📸
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-900">Snap & Share</h3>
            <p className="text-slate-500 leading-relaxed font-medium">
              Take a photo of the pothole, trash, or broken light. We automatically capture the precise location data.
            </p>
          </div>

          <div className="group p-8 bg-white border border-indigo-50 rounded-[2rem] hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-0 group-hover:opacity-100"></div>
            <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 text-2xl shadow-inner text-purple-600 group-hover:scale-110 transition-transform duration-300">
              📍
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-900">Pinpoint</h3>
            <p className="text-slate-500 leading-relaxed font-medium">
              Our advanced geolocation system ensures workers find exactly where the problem is, accurately.
            </p>
          </div>

          <div className="group p-8 bg-white border border-indigo-50 rounded-[2rem] hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-0 group-hover:opacity-100"></div>
            <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center mb-6 text-2xl shadow-inner text-rose-600 group-hover:scale-110 transition-transform duration-300">
              ✅
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-900">Track Fixes</h3>
            <p className="text-slate-500 leading-relaxed font-medium">
              Get real-time updates via SMS or App when your report status changes from pending to resolved.
            </p>
          </div>
        </div>

        {/* Stats / Trust */}
        <div className="border-t border-indigo-50 pt-16 text-center">
          <p className="text-sm font-bold text-indigo-300 uppercase tracking-widest mb-10">
            Trusted by the community
          </p>
          <div className="flex flex-wrap justify-center gap-16 md:gap-24 opacity-80 hover:opacity-100 transition-opacity">
            <div className="text-center group">
              <div className="text-4xl sm:text-5xl font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">10k+</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Issues Fixed</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl sm:text-5xl font-black text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">24h</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Response</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl sm:text-5xl font-black text-slate-900 mb-2 group-hover:text-rose-500 transition-colors">500+</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Workers</div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-10 text-center text-sm font-medium text-slate-400 bg-white border-t border-indigo-50">
        <p>© 2025 Street Care Management.</p>
      </footer>
    </div>
  );
};

export default Home;
