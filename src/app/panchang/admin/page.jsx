"use client"

import { useEffect, useState } from "react"
import {
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaCalendarAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaCalendarCheck,
  FaCalendarWeek,
  FaCalendarDay
} from 'react-icons/fa';

export default function PanchangAdmin() {
  const [panchangams, setPanchangams] = useState([]);
  const [formData, setFormData] = useState({
    nameOfWork: '',
    date: '',
    month: '',
    year: '',
    time: '',
    paksha: '',
    tithi: '',
    description: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    fetchPanchangams();
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleResize = () => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
      setIsSidebarOpen(false);
    } else {
      setIsMobile(false);
      setIsSidebarOpen(true);
    }
  };

  const fetchPanchangams = async () => {
    try {
      const response = await fetch('/api/panchang/admin');
      const data = await response.json();
      if (data.success) {
        setPanchangams(data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const filteredEvents = panchangams.filter(event =>
    event.nameOfWork.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.month.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEvents = panchangams.length;
  const upcomingEvents = panchangams.filter(event => {
    const eventDate = new Date(`${event.month} ${event.date}, ${event.year}`);
    return eventDate > new Date();
  }).length;

  const recentEvents = panchangams.slice(0, 5);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const method = isEditing ? 'PUT' : 'POST';
      const body = isEditing ? { ...formData, _id: editId } : formData;

      const response = await fetch('/api/panchang/admin', {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (data.success) {
        setMessage(isEditing ? 'Updated successfully!' : 'Added successfully!');
        setFormData({
          nameOfWork: '',
          date: '',
          month: '',
          year: '',
          time: '',
          paksha: '',
          tithi: '',
          description: ''
        });
        setIsEditing(false);
        setEditId(null);
        fetchPanchangams();
        setTimeout(() => {
          setShowAddModal(false);
          setMessage('');
        }, 2000);
      } else {
        setMessage(data.error || 'Something went wrong');
      }
    } catch (error) {
      setMessage('Error submitting form');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      nameOfWork: item.nameOfWork,
      date: item.date,
      month: item.month,
      year: item.year,
      time: item.time,
      paksha: item.paksha || '',
      tithi: item.tithi || '',
      description: item.description
    });
    setIsEditing(true);
    setEditId(item._id);
    setShowAddModal(true);
  };

  const handleAddNew = () => {
    setFormData({
      nameOfWork: '',
      date: '',
      month: '',
      year: '',
      time: '',
      paksha: '',
      tithi: '',
      description: ''
    });
    setIsEditing(false);
    setEditId(null);
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setIsEditing(false);
    setEditId(null);
    setFormData({
      nameOfWork: '',
      date: '',
      month: '',
      year: '',
      time: '',
      paksha: '',
      tithi: '',
      description: ''
    });
    setMessage('');
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const response = await fetch(`/api/panchang/admin?id=${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        fetchPanchangams();
      } else {
        alert('Failed to delete');
      }
    } catch (error) {
      alert('Error deleting');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 transition-opacity backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-30 h-full w-64 bg-white shadow-xl transition-transform duration-300 ease-in-out transform 
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden'}
        `}
      >
        <div className="flex flex-col h-full border-r border-gray-100">
          <div className="flex items-center justify-center h-16 bg-linear-to-r from-purple-600 to-indigo-600 shadow-md">
            <h1 className={`text-xl font-bold text-white tracking-wide transition-opacity duration-200 ${!isSidebarOpen && 'md:opacity-0'}`}>
              Parashar Pro
            </h1>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <button
              onClick={() => { setActiveSection('dashboard'); if (isMobile) setIsSidebarOpen(false); }}
              className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 group ${activeSection === 'dashboard'
                ? 'bg-purple-50 text-purple-700 shadow-sm ring-1 ring-purple-100'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              <FaTachometerAlt className={`w-5 h-5 mr-3 transition-colors ${activeSection === 'dashboard' ? 'text-purple-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
              <span className="font-medium">Dashboard</span>
            </button>
            <button
              onClick={() => { setActiveSection('events'); if (isMobile) setIsSidebarOpen(false); }}
              className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 group ${activeSection === 'events'
                ? 'bg-purple-50 text-purple-700 shadow-sm ring-1 ring-purple-100'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              <FaCalendarAlt className={`w-5 h-5 mr-3 transition-colors ${activeSection === 'events' ? 'text-purple-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
              <span className="font-medium">Manage Events</span>
            </button>
          </nav>

          <div className="p-4 border-t border-gray-100">
            <div className="bg-linear-to-br from-purple-50 to-indigo-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-purple-800 uppercase tracking-wider mb-1">Admin Status</p>
              <p className="text-sm text-gray-600 flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                Active
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full w-full overflow-hidden relative">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-100 z-10">
          <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
              >
                {isSidebarOpen ? <FaBars className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
              </button>
              <h2 className="ml-4 text-xl font-bold text-gray-800 capitalize tracking-tight">
                {activeSection}
              </h2>
            </div>

            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center px-3 py-1 bg-gray-50 rounded-full border border-gray-200">
                <span className="text-xs font-medium text-gray-500">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </span>
              </div>
              <button
                onClick={handleAddNew}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 active:bg-purple-800 transition-colors flex items-center shadow-lg shadow-purple-200"
              >
                <FaPlus className="w-4 h-4 mr-2" />
                <span className="text-sm font-semibold">New Event</span>
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {activeSection === 'dashboard' && (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-transform hover:-translate-y-1 duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Events</p>
                        <h3 className="text-3xl font-bold text-gray-800">{totalEvents}</h3>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                        <FaCalendarCheck className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-transform hover:-translate-y-1 duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Upcoming</p>
                        <h3 className="text-3xl font-bold text-gray-800">{upcomingEvents}</h3>
                      </div>
                      <div className="p-3 bg-green-50 rounded-xl text-green-600">
                        <FaCalendarWeek className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-transform hover:-translate-y-1 duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">This Month</p>
                        <h3 className="text-3xl font-bold text-gray-800">
                          {panchangams.filter(event => event.month === new Date().toLocaleString('default', { month: 'long' })).length}
                        </h3>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
                        <FaCalendarDay className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Events List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
                    <button
                      onClick={() => setActiveSection('events')}
                      className="text-sm text-purple-600 hover:text-purple-700 font-medium hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {recentEvents.length > 0 ? (
                      recentEvents.map((event) => (
                        <div key={event._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">
                              {event.date}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 capitalize">{event.nameOfWork.replace('-', ' ')}</p>
                              <p className="text-xs text-gray-500">{event.month} {event.year} • {event.time || 'All Day'}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleEdit(event)}
                            className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="px-6 py-12 text-center text-gray-400">
                        No recent events found.
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {activeSection === 'events' && (
              <div className="space-y-6">
                {/* Search Bar */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" />
                    <input
                      type="text"
                      placeholder="Search by name, month, or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border text-black border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Events Table Container */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Event</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Schedule</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tithi</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">From</th>
                          <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {filteredEvents.length > 0 ? (
                          filteredEvents.map((event) => (
                            <tr key={event._id} className="hover:bg-gray-50/80 transition-colors group">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-semibold text-gray-900 capitalize">
                                  {event.nameOfWork.replace('-', ' ')}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 font-medium">{event.date} {event.month} {event.year}</div>
                                <div className="text-xs text-gray-500 mt-0.5">{event.time || 'All Day'}</div>
                              </td>
                              <td className="px-6 py-4">
                                <p className="text-sm text-gray-600 line-clamp-1">{event.paksha} {event.tithi}</p>
                              </td>
                              <td className="px-6 py-4">
                                <p className="text-sm text-gray-600 line-clamp-1">{event.description || '-'}</p>
                                
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center justify-end space-x-2 opacity-100 transition-opacity">
                                  <button
                                    onClick={() => handleEdit(event)}
                                    className="p-2 text-indigo-600 bg-indigo-50 rounded-lg transition-colors"
                                    title="Edit"
                                  >
                                    <FaEdit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(event._id)}
                                    className="p-2 text-red-600 bg-red-50 rounded-lg transition-colors"
                                    title="Delete"
                                  >
                                    <FaTrash className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="px-6 py-12 text-center">
                              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                <FaSearch className="w-5 h-5 text-gray-400" />
                              </div>
                              <p className="text-gray-500 font-medium">No events found</p>
                              <p className="text-gray-400 text-sm">Try adjusting your search filters</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="relative">
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity backdrop-blur-sm">

                <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="flex justify-between items-center mb-5">
                      <h3 className="text-xl font-bold text-gray-900">
                        {isEditing ? 'Edit Event' : 'New Event'}
                      </h3>
                      <button
                        onClick={closeModal}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <FaTimes className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>

                    {message && (
                      <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${message.includes('success')
                        ? 'bg-green-50 text-green-700 border border-green-100'
                        : 'bg-red-50 text-red-700 border border-red-100'
                        }`}>
                        {message}
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-black mb-1">Name of Work</label>
                        <select
                          name="nameOfWork"
                          value={formData.nameOfWork}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-shadow bg-white"
                        >
                          <option value="">Select Event Type</option>
                          <option value="moolShanti">Mool Shanti</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-1">
                          <label className="block text-sm font-semibold text-black mb-1">Date</label>
                          <input
                            type="text"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            placeholder="DD"
                            className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                          />
                        </div>
                        <div className="col-span-1">
                          <label className="block text-sm font-semibold text-black mb-1">Month</label>
                          <input
                            type="text"
                            name="month"
                            value={formData.month}
                            onChange={handleChange}
                            required
                            placeholder="MM/Name"
                            className="w-full px-3 py-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                          />
                        </div>
                        <div className="col-span-1">
                          <label className="block text-sm font-semibold text-black mb-1">Year</label>
                          <input
                            type="text"
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            required
                            placeholder="YYYY"
                            className="w-full px-3 py-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-black mb-1">Time</label>
                          <input
                            type="text"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            placeholder="e.g. 10:30 AM"
                            className="w-full px-3 py-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-black mb-1">Paksha (Optional)</label>
                          <input
                            type="text"
                            name="paksha"
                            value={formData.paksha}
                            onChange={handleChange}
                            placeholder="e.g. Shukla"
                            className="w-full px-3 py-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-black mb-1">Tithi (Optional)</label>
                        <input
                          type="text"
                          name="tithi"
                          value={formData.tithi}
                          onChange={handleChange}
                          placeholder="e.g. Purnima"
                          className="w-full px-3 py-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-black mb-1">Description</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows="3"
                          placeholder="Additional details..."
                          className="w-full px-3 py-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                        ></textarea>
                      </div>

                      <div className="pt-4 flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={closeModal}
                          className="px-5 py-2.5 border border-gray-200 rounded-lg text-black hover:bg-gray-50 font-medium transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors shadow-lg shadow-purple-200 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {loading ? 'Saving...' : (isEditing ? 'Update Event' : 'Create Event')}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

              </div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>


            </div>
          </div>
        </div>
      )}
    </div>
  );
}
