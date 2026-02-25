import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { getActivities } from '../services/api';

const ActivityList = () => {

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await getActivities();
      console.log(response)
      setActivities(response.data);
    } catch (error) {
      console.log(error);
      setError('Failed to load activities');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchActivities();
  }, [])

  const getActivityIcon = (type) => {
    switch (type) {
      case 'RUNNING':
        return '🏃';
      case 'WALKING':
        return '🚶';
      case 'CYCLING':
        return '🚴';
      default:
        return '💪';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'RUNNING':
        return 'from-red-500 to-red-600';
      case 'WALKING':
        return 'from-blue-500 to-blue-600';
      case 'CYCLING':
        return 'from-green-500 to-green-600';
      default:
        return 'from-purple-500 to-purple-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading your activities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Activities</h1>
          <p className="text-gray-600">Track and manage your fitness activities</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Activities Grid */}
        {activities.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-4xl mb-4">📭</p>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Activities Yet</h3>
            <p className="text-gray-600 mb-6">Start by adding your first activity!</p>
            <button
              onClick={() => navigate('/add-activity')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Add Activity
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity) => (
              <div
                key={activity.id}
                onClick={() => navigate(`/activities/${activity.id}`)}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-105 transition duration-300 cursor-pointer group"
              >
                {/* Card Header with Gradient */}
                <div className={`bg-gradient-to-r ${getActivityColor(activity.type)} p-6 text-white`}>
                  <div className="flex items-center gap-4">
                    <span className="text-5xl">{getActivityIcon(activity.type)}</span>
                    <div>
                      <h3 className="text-xl font-bold">{activity.type}</h3>
                      <p className="text-white text-opacity-80 text-sm">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <div className="space-y-4">
                    {/* Duration */}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium">Duration</span>
                      <span className="text-2xl font-bold text-blue-600">{activity.duration}</span>
                      <span className="text-gray-500 text-sm">min</span>
                    </div>

                    {/* Calories */}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium">Calories</span>
                      <span className="text-2xl font-bold text-green-600">{activity.caloriesBurned}</span>
                      <span className="text-gray-500 text-sm">kcal</span>
                    </div>

                    {/* Divider */}
                    <div className="border-t pt-4"></div>

                    {/* View Details Button */}
                    <button className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition group-hover:shadow-lg">
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Activity Button (Floating Action) */}
        {activities.length > 0 && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => navigate('/add-activity')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition duration-300"
            >
              + Add New Activity
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ActivityList