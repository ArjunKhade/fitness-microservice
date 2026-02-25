import React, { useState } from 'react'
import { addActivities } from '../services/api'

const ActivityForm = ({ onActivityAdded }) => {

  const [activity, setActivity] = useState({
    type: "RUNNING", duration: '', caloriesBurned: '',
    additionalMetrics: {}
  })

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!activity.duration || !activity.caloriesBurned) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await addActivities(activity);
      setSuccess('Activity added successfully!');
      onActivityAdded();
      setTimeout(() => setSuccess(''), 3000);
      setActivity({
        type: "RUNNING", duration: '', caloriesBurned: '',
        additionalMetrics: {}
      })
    } catch (error) {
      console.log(error);
      setError('Failed to add activity. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Add New Activity</h2>

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Activity Type */}
          <div>
            <label htmlFor="ActivityType" className="block text-sm font-medium text-gray-700 mb-2">
              Activity Type
            </label>
            <select
              id="ActivityType"
              value={activity.type}
              onChange={(e) => { setActivity({ ...activity, type: e.target.value }) }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            >
              <option value="RUNNING">Running</option>
              <option value="WALKING">Walking</option>
              <option value="CYCLING">Cycling</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label htmlFor="Duration" className="block text-sm font-medium text-gray-700 mb-2">
              Duration (minutes)
            </label>
            <input
              id="Duration"
              type="number"
              placeholder="30"
              value={activity.duration}
              onChange={(e) => { setActivity({ ...activity, duration: e.target.value }) }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* Calories Burned */}
          <div>
            <label htmlFor="CaloriesBurned" className="block text-sm font-medium text-gray-700 mb-2">
              Calories Burned
            </label>
            <input
              id="CaloriesBurned"
              type="number"
              placeholder="250"
              value={activity.caloriesBurned}
              onChange={(e) => { setActivity({ ...activity, caloriesBurned: e.target.value }) }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding Activity...' : 'Add Activity'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ActivityForm