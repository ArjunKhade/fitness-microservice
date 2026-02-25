import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { getRecomendationByActivity } from '../services/api';

const ActivityDetails = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchActivities = async (id) => {
        try {
            setLoading(true);
            const response = await getRecomendationByActivity(id);
            console.log(response);
            setActivity(response.data);
        } catch (error) {
            console.log(error);
            setError('Failed to load activity details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities(id);
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                    <p className="mt-4 text-gray-600 font-medium">Loading activity details...</p>
                </div>
            </div>
        );
    }

    if (error || !activity) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 font-semibold text-lg mb-4">{error || 'Activity not found'}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <button
                    onClick={() => navigate('/')}
                    className="mb-6 text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
                >
                    ← Back
                </button>

                {/* Activity Details Card */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6">
                        <div className="flex items-center gap-4">
                            <span className="text-5xl">{getActivityIcon(activity.type)}</span>
                            <div>
                                <h1 className="text-4xl font-bold text-white">{activity.type}</h1>
                                <p className="text-blue-100">{new Date(activity.createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {/* Duration */}
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                                <p className="text-gray-600 text-sm font-medium mb-2">Duration</p>
                                <p className="text-3xl font-bold text-blue-600">{activity.duration}</p>
                                <p className="text-gray-500 text-sm">minutes</p>
                            </div>

                            {/* Calories */}
                            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
                                <p className="text-gray-600 text-sm font-medium mb-2">Calories Burned</p>
                                <p className="text-3xl font-bold text-green-600">{activity.caloriesBurned}</p>
                                <p className="text-gray-500 text-sm">kcal</p>
                            </div>

                            {/* Avg Speed (if available) */}
                            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6">
                                <p className="text-gray-600 text-sm font-medium mb-2">Activity ID</p>
                                <p className="text-3xl font-bold text-orange-600">{activity.id}</p>
                                <p className="text-gray-500 text-sm">tracking</p>
                            </div>
                        </div>

                        {/* Full Details */}
                        <div className="border-t pt-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Activity Summary</h3>
                            <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Type</span>
                                    <span className="font-semibold text-gray-900">{activity.type}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Duration</span>
                                    <span className="font-semibold text-gray-900">{activity.duration} minutes</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Calories Burned</span>
                                    <span className="font-semibold text-gray-900">{activity.caloriesBurned} kcal</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Date</span>
                                    <span className="font-semibold text-gray-900">{new Date(activity.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Recommendations */}
                {activity.recommendations && (
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
                        <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-8 py-6">
                            <h2 className="text-2xl font-bold text-white">🤖 AI Recommendations</h2>
                        </div>

                        <div className="p-8 space-y-6">
                            {/* Analysis */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3">📊 Analysis</h3>
                                <p className="text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-lg">
                                    {activity.recommendations}
                                </p>
                            </div>

                            {/* Improvements */}
                            {activity.improvements && activity.improvements.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">⬆️ Areas for Improvement</h3>
                                    <ul className="space-y-2">
                                        {activity.improvements.map((improvement, index) => (
                                            <li key={index} className="flex items-start gap-3 text-gray-700 bg-yellow-50 p-3 rounded-lg">
                                                <span className="text-yellow-600 font-bold mt-1">•</span>
                                                <span>{improvement}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Suggestions */}
                            {activity.suggestions && activity.suggestions.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">💡 Suggestions</h3>
                                    <ul className="space-y-2">
                                        {activity.suggestions.map((suggestion, index) => (
                                            <li key={index} className="flex items-start gap-3 text-gray-700 bg-green-50 p-3 rounded-lg">
                                                <span className="text-green-600 font-bold mt-1">✓</span>
                                                <span>{suggestion}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Safety Guidelines */}
                            {activity.safety && activity.safety.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">🛡️ Safety Guidelines</h3>
                                    <ul className="space-y-2">
                                        {activity.safety.map((safety, index) => (
                                            <li key={index} className="flex items-start gap-3 text-gray-700 bg-red-50 p-3 rounded-lg">
                                                <span className="text-red-600 font-bold mt-1">!</span>
                                                <span>{safety}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ActivityDetails