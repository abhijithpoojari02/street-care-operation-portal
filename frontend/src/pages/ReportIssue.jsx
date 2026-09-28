import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createIssue } from '../services/api';

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

const ReportIssue = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Roads',
    latitude: '',
    longitude: '',
    address: ''
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);

  /* Search-related state */
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState(null);

  const categories = [
    'Roads',
    'Drainage',
    'Streetlight',
    'Waste Management',
    'Parks',
    'Other'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  /* Get current GPS location */
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
        alert('Unable to fetch location');
        setLocationLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  /* 🔍 SEARCH LOCATION (FIXED) */
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert('Please enter a place name');
      return;
    }

    try {
      const encodedQuery = encodeURIComponent(searchQuery);

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=in&q=${encodedQuery}`,
        {
          headers: {
            'User-Agent': 'StreetCareApp/1.0',
            'Accept-Language': 'en'
          }
        }
      );

      const data = await res.json();

      if (!data || data.length === 0) {
        alert('Location not found. Try a full place name.');
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
    } catch (err) {
      console.error(err);
      alert('Search failed. Please try again.');
    }
  };

  /* Submit issue */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    if (image) data.append('image', image);

    try {
      await createIssue(data);
      alert('Issue reported successfully!');
      navigate('/user/dashboard');
    } catch {
      alert('Failed to report issue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">

      {/* Header / Nav Placeholder (Visual consistency) */}
      <div className="bg-white/80 backdrop-blur-md border-b border-indigo-50 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/user/dashboard')}
            className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Report <span className="text-indigo-600">Issue</span>
            </h1>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Help us improve the city
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">

          <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] border border-indigo-50 overflow-hidden">

            {/* Progress / Decoration Line */}
            <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

            <div className="p-6 md:p-10 space-y-8">

              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Issue Details</h2>
                <p className="text-slate-500">Please provide detailed information about the issue so we can address it quickly.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">

                <div className="space-y-6">
                  <div className="group">
                    <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-indigo-600 transition-colors">
                      Issue Title
                    </label>
                    <input
                      name="title"
                      placeholder="e.g. Broken Streetlight on Main St"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-400 font-medium"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-indigo-600 transition-colors">
                        Category
                      </label>
                      <div className="relative">
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all appearance-none font-medium text-slate-700 cursor-pointer"
                        >
                          {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Upload Image
                      </label>
                      <label className="flex items-center justify-center w-full px-5 py-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 transition-all group">
                        <div className="flex items-center gap-3">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-slate-400 group-hover:text-indigo-600 transition-colors">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                          </svg>
                          <span className="font-medium truncate max-w-[150px]">
                            {image ? image.name : 'Choose file...'}
                          </span>
                        </div>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-indigo-600 transition-colors">
                      Description
                    </label>
                    <textarea
                      name="description"
                      placeholder="Describe the issue in detail..."
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows="4"
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-400 resize-none font-medium"
                    />
                  </div>
                </div>

                {/* Location Section */}
                <div className="space-y-6 pt-6 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-800">Location</h3>
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      disabled={locationLoading}
                      className="text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-4 py-2 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {locationLoading ? (
                        <>
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Locating...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                          </svg>
                          Find Me
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative group">
                      <label className="absolute -top-2.5 left-3 bg-white px-2 text-xs font-bold text-slate-400 group-focus-within:text-indigo-600 transition-colors">Latitude</label>
                      <input
                        value={formData.latitude}
                        readOnly
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-mono text-sm text-slate-600 focus:outline-none"
                      />
                    </div>
                    <div className="relative group">
                      <label className="absolute -top-2.5 left-3 bg-white px-2 text-xs font-bold text-slate-400 group-focus-within:text-indigo-600 transition-colors">Longitude</label>
                      <input
                        value={formData.longitude}
                        readOnly
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-mono text-sm text-slate-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-indigo-600 transition-colors">
                      Address
                    </label>
                    <input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="e.g. 123 Main St, Springfield"
                      required
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                    />
                  </div>

                  {/* 🗺️ MAP WITH SEARCH + DRAG */}
                  {showMap && mapCenter && (
                    <div className="space-y-4 pt-4 animate-fadeIn">
                      <div className="relative shadow-sm">
                        <input
                          type="text"
                          placeholder="Search map location..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-5 pr-28 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={handleSearch}
                          className="absolute right-2 top-2 bottom-2 bg-slate-900 text-white px-5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors"
                        >
                          Search
                        </button>
                      </div>

                      <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-lg ring-1 ring-slate-900/5">
                        <MapContainer
                          center={mapCenter}
                          zoom={18}
                          style={{ height: '350px', width: '100%' }}
                        >
                          <ChangeMapView center={mapCenter} />

                          <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          />

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

                                try {
                                  const res = await fetch(
                                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.lat}&lon=${pos.lng}`,
                                    { headers: { 'User-Agent': 'StreetCareApp/1.0', 'Accept-Language': 'en' } }
                                  );
                                  const data = await res.json();
                                  setFormData(prev => ({
                                    ...prev,
                                    address: data.display_name || prev.address
                                  }));
                                } catch { }
                              }
                            }}
                          />
                        </MapContainer>
                        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 shadow-sm z-[400]">
                          Drag marker to refine location
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-6 flex flex-col-reverse md:flex-row gap-4">
                  <button
                    type="button"
                    onClick={() => navigate('/user/dashboard')}
                    className="flex-1 py-4 text-slate-600 font-bold hover:bg-slate-50 rounded-2xl transition-all border-2 border-transparent hover:border-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-[2] bg-gradient-to-br from-indigo-600 to-violet-600 text-white py-4 rounded-2xl font-bold text-lg shadow-indigo-200 shadow-xl hover:shadow-2xl hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-70 disabled:pointer-events-none"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : 'Submit Report'}
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

export default ReportIssue;
