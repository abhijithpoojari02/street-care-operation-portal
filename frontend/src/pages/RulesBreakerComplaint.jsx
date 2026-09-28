import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createComplaint } from '../services/api';

/* ===== MAP IMPORTS (ADDED ONLY) ===== */
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';

/* Fix Leaflet marker icon */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

/* Helper to move map */
const ChangeMapView = ({ center }) => {
  const map = useMap();
  map.setView(center);
  return null;
};
/* ================================== */

const RulesBreakerComplaint = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    latitude: '',
    longitude: '',
    address: ''
  });

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);

  /* MAP STATE (ADDED ONLY) */
  const [showMap, setShowMap] = useState(false);
  const [mapCenter, setMapCenter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 50 * 1024 * 1024) {
      alert('Video file size must be less than 50MB');
      return;
    }
    setVideo(file);
  };

  /* GET CURRENT LOCATION */
  const getCurrentLocation = () => {
    setLocationLoading(true);

    if (!navigator.geolocation) {
      alert('Geolocation not supported');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setFormData(prev => ({
          ...prev,
          latitude: lat.toString(),
          longitude: lng.toString()
        }));

        setMapCenter([lat, lng]);
        setShowMap(true);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
            {
              headers: {
                'User-Agent': 'StreetCareApp/1.0',
                'Accept-Language': 'en'
              }
            }
          );
          const data = await res.json();

          setFormData(prev => ({
            ...prev,
            address: data.display_name || `${lat}, ${lng}`
          }));
        } catch {
          setFormData(prev => ({
            ...prev,
            address: `Lat: ${lat}, Lng: ${lng}`
          }));
        }

        setLocationLoading(false);
      },
      () => {
        alert('Unable to get location');
        setLocationLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  /* SEARCH LOCATION */
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=in&q=${encodeURIComponent(searchQuery)}`,
      {
        headers: {
          'User-Agent': 'StreetCareApp/1.0',
          'Accept-Language': 'en'
        }
      }
    );

    const data = await res.json();
    if (!data.length) {
      alert('Location not found');
      return;
    }

    const lat = parseFloat(data[0].lat);
    const lng = parseFloat(data[0].lon);

    setFormData(prev => ({
      ...prev,
      latitude: lat.toString(),
      longitude: lng.toString(),
      address: data[0].display_name
    }));

    setMapCenter([lat, lng]);
    setShowMap(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!video) {
      setError('Please upload a video');
      return;
    }

    setLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('latitude', formData.latitude);
    data.append('longitude', formData.longitude);
    data.append('address', formData.address);
    data.append('video', video);

    try {
      await createComplaint(data);
      alert('Complaint filed successfully!');
      navigate('/user/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to file complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff0f3] pb-12 font-sans text-slate-900 selection:bg-rose-100 selection:text-rose-700">

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-rose-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/user/dashboard')}
            className="w-10 h-10 rounded-full bg-rose-50 hover:bg-rose-100 flex items-center justify-center text-rose-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-slate-900 uppercase">
              File <span className="text-rose-600">Complaint</span>
            </h1>
            <p className="text-xs font-bold text-rose-400 uppercase tracking-widest">
              Report Rule Violations
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">

          <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(225,_29,_72,_0.09)] border border-rose-100 overflow-hidden">

            {/* Progress / Decoration Line - ROSE Theme */}
            <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400"></div>

            <div className="p-6 md:p-10 space-y-8">

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-xl flex items-center gap-3 animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="font-bold">{error}</span>
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className="bg-rose-100 p-3 rounded-2xl hidden sm:block">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-rose-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 mb-2">Details of Violation</h2>
                  <p className="text-slate-500 font-medium">Be precise. Your report helps keep our community safe and orderly.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">

                <div className="space-y-6">

                  <div className="group">
                    <label className="block text-xs font-black text-rose-500 uppercase tracking-wider mb-2 group-focus-within:text-rose-700 transition-colors">
                      Complaint Title
                    </label>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      placeholder="Briefly summarize the violation"
                      className="w-full px-5 py-4 bg-rose-50/50 border-2 border-rose-100 rounded-2xl focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all placeholder:text-rose-300 font-bold text-slate-800"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-xs font-black text-rose-500 uppercase tracking-wider mb-2 group-focus-within:text-rose-700 transition-colors">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows="4"
                      placeholder="Provide full details of the incident..."
                      className="w-full px-5 py-4 bg-rose-50/50 border-2 border-rose-100 rounded-2xl focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all placeholder:text-rose-300 font-medium text-slate-700 resize-none"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-xs font-black text-rose-500 uppercase tracking-wider mb-2">
                      Evidence (Video)
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        required
                        className="w-full px-5 py-4 bg-rose-50/50 border-2 border-dashed border-rose-200 rounded-2xl cursor-pointer hover:bg-rose-100 hover:border-rose-400 text-rose-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-rose-500 file:text-white hover:file:bg-rose-600 transition-all font-semibold"
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-2 font-medium">
                      * Upload a clear video as evidence (Max 50MB)
                    </p>
                  </div>

                </div>

                {/* Location Section */}
                <div className="space-y-6 pt-8 border-t border-dashed border-rose-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                      <span className="bg-rose-100 p-1.5 rounded-lg text-rose-600">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                          <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                      </span>
                      Incident Location
                    </h3>
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      disabled={locationLoading}
                      className="text-xs font-bold text-rose-600 border border-rose-200 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 uppercase tracking-wide"
                    >
                      {locationLoading ? 'Locating...' : 'Detect Location'}
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      readOnly
                      value={formData.latitude}
                      placeholder="Latitude"
                      className="px-4 py-3 bg-slate-100 rounded-xl font-mono text-xs text-slate-500 border-none"
                    />
                    <input
                      readOnly
                      value={formData.longitude}
                      placeholder="Longitude"
                      className="px-4 py-3 bg-slate-100 rounded-xl font-mono text-xs text-slate-500 border-none"
                    />
                  </div>

                  <div className="relative">
                    <input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder="Incident Address"
                      className="w-full pl-10 pr-4 py-4 bg-white border-2 border-rose-100 rounded-xl focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all font-medium"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-300">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>

                  {/* 🗺️ MAP */}
                  {showMap && mapCenter && (
                    <div className="space-y-4 pt-4 animate-fadeIn">
                      <div className="flex gap-2">
                        <input
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Enter area name to search..."
                          className="flex-1 px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-rose-500 outline-none text-sm"
                        />
                        <button
                          type="button"
                          onClick={handleSearch}
                          className="px-6 py-2 bg-slate-800 text-white font-bold rounded-xl text-sm hover:bg-slate-900"
                        >
                          Search
                        </button>
                      </div>

                      <div className="rounded-2xl overflow-hidden border-4 border-rose-50 shadow-inner">
                        <MapContainer center={mapCenter} zoom={18} style={{ height: '300px' }}>
                          <ChangeMapView center={mapCenter} />
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <Marker
                            position={mapCenter}
                            draggable
                            eventHandlers={{
                              dragend: async (e) => {
                                const pos = e.target.getLatLng();
                                setMapCenter([pos.lat, pos.lng]);
                                setFormData(prev => ({
                                  ...prev,
                                  latitude: pos.lat.toString(),
                                  longitude: pos.lng.toString()
                                }));

                                const res = await fetch(
                                  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.lat}&lon=${pos.lng}`
                                );
                                const data = await res.json();
                                setFormData(prev => ({
                                  ...prev,
                                  address: data.display_name || prev.address
                                }));
                              }
                            }}
                          />
                        </MapContainer>
                      </div>
                    </div>
                  )}
                </div>

                {/* ACTIONS */}
                <div className="flex gap-4 pt-6 border-t border-dashed border-slate-200">
                  <button
                    type="button"
                    onClick={() => navigate('/user/dashboard')}
                    className="flex-1 py-4 font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-2xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-[2] bg-gradient-to-r from-rose-600 to-red-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-rose-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:grayscale"
                  >
                    {loading ? 'Filing Complaint...' : 'File Complaint'}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RulesBreakerComplaint;
