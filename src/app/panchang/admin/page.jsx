"use client"

import { useEffect, useState } from "react"

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

  useEffect(() => {
    fetchPanchangams();
  }, []);

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
    window.scrollTo(0, 0);
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
    <div className="p-6 max-w-6xl mx-auto bg-white min-h-screen text-black">
      <h1 className="text-3xl font-bold mb-6 text-center text-purple-700">Panchang Admin Panel</h1>

      <div className="bg-gray-50 p-6 rounded-xl shadow-lg mb-8 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">{isEditing ? 'Edit Event' : 'Add New Event'}</h2>
        {message && <p className={`mb-4 p-2 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</p>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name of Work (Karya)</label>
            <select
              name="nameOfWork"
              value={formData.nameOfWork}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Select Karya</option>
              <option value="lagan">Lagan</option>
              <option value="grih-parvesh">Grih Parvesh</option>
              <option value="mundan">Mundan</option>
              <option value="namkaran">Namkaran</option>
              <option value="vivah">Vivah</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date (DD-MM-YYYY)</label>
            <input
              type="text"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              placeholder="e.g. 15-08-2024"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
            <input
              type="text"
              name="month"
              value={formData.month}
              onChange={handleChange}
              required
              placeholder="e.g. August"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <input
              type="text"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              placeholder="e.g. 2024"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <input
              type="text"
              name="time"
              value={formData.time}
              onChange={handleChange}
              placeholder="e.g. 10:30 AM"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Paksha</label>
            <input
              type="text"
              name="paksha"
              value={formData.paksha}
              onChange={handleChange}
              placeholder="e.g. Shukla"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tithi</label>
            <input
              type="text"
              name="tithi"
              value={formData.tithi}
              onChange={handleChange}
              placeholder="e.g. Purnima"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Enter details..."
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            ></textarea>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 font-semibold shadow-sm"
            >
              {loading ? 'Processing...' : (isEditing ? 'Update Event' : 'Add Event')}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
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
                }}
                className="w-full mt-2 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors font-semibold"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <h2 className="text-xl font-semibold p-4 bg-gray-50 border-b border-gray-200 text-gray-800">Existing Events</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="px-6 py-3">Work</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Time</th>
                <th className="px-6 py-3">Details</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {panchangams.length > 0 ? (
                panchangams.map((item) => (
                  <tr key={item._id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{item.nameOfWork}</td>
                    <td className="px-6 py-4">{item.date} {item.month} {item.year}</td>
                    <td className="px-6 py-4">{item.time}</td>
                    <td className="px-6 py-4 max-w-xs truncate">{item.description}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="font-medium text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No events found. Add one above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

