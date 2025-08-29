import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeedbacks } from './../../redux/slices/studentSlice';
import { FaSpinner, FaComments, FaUserTie, FaCalendarAlt, FaSmile, FaFrown, FaMeh, FaChartBar, FaList } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const FeedbackList = () => {
  const dispatch = useDispatch();
  const { feedbacks, loading, error } = useSelector((state) => state.student);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedSentiment, setSelectedSentiment] = useState('all'); // 'all', 'positive', 'negative', 'neutral'

  useEffect(() => {
    dispatch(fetchFeedbacks());
  }, [dispatch]);

  // Filter feedbacks based on selected sentiment
  const filteredFeedbacks = selectedSentiment === 'all' 
    ? feedbacks 
    : feedbacks.filter(f => f.sentiment === selectedSentiment);

  // Sentiment data for charts
  const sentimentData = [
    { name: 'Positive', value: feedbacks.filter(f => f.sentiment === 'positive').length, color: '#10B981' },
    { name: 'Negative', value: feedbacks.filter(f => f.sentiment === 'negative').length, color: '#EF4444' },
    { name: 'Neutral', value: feedbacks.filter(f => f.sentiment === 'neutral').length, color: '#F59E0B' }
  ];

  // Get sentiment icon and color
  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return { icon: <FaSmile className="text-xl" />, color: 'text-green-500', bg: 'bg-green-100' };
      case 'negative':
        return { icon: <FaFrown className="text-xl" />, color: 'text-red-500', bg: 'bg-red-100' };
      default:
        return { icon: <FaMeh className="text-xl" />, color: 'text-yellow-500', bg: 'bg-yellow-100' };
    }
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200">
          <p className="font-semibold text-gray-800">{label}</p>
          <p className="text-sm">{`Count: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-white rounded-full shadow-lg mb-4">
            <FaComments className="text-3xl text-indigo-600 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Your Feedback</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Track all your submitted feedback and responses from staff
          </p>
        </div>

        {/* Stats Summary */}
        {!loading && !error && feedbacks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-md flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <FaComments className="text-2xl text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{feedbacks.length}</h3>
                <p className="text-sm text-gray-600">Total Feedback</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-md flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <FaSmile className="text-2xl text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {feedbacks.filter(f => f.sentiment === 'positive').length}
                </h3>
                <p className="text-sm text-gray-600">Positive</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-md flex items-center">
              <div className="p-3 bg-red-100 rounded-lg mr-4">
                <FaFrown className="text-2xl text-red-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {feedbacks.filter(f => f.sentiment === 'negative').length}
                </h3>
                <p className="text-sm text-gray-600">Negative</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-md flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg mr-4">
                <FaMeh className="text-2xl text-yellow-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {feedbacks.filter(f => f.sentiment === 'neutral').length}
                </h3>
                <p className="text-sm text-gray-600">Neutral</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-lg">
            <FaSpinner className="animate-spin text-5xl text-indigo-600 mb-4" />
            <p className="text-lg font-medium text-gray-700">Loading your feedback...</p>
            <p className="text-sm text-gray-500 mt-1">Please wait while we fetch your feedback history</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-white rounded-2xl p-6 shadow-lg max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <FaComments className="text-3xl text-red-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center text-gray-800 mb-2">Something went wrong</h3>
            <p className="text-gray-600 text-center">{error}</p>
            <button
              onClick={() => dispatch(fetchFeedbacks())}
              className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Feedback Available */}
        {!loading && !error && feedbacks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="p-4 bg-blue-100 rounded-full mb-5">
              <FaComments className="text-4xl text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Feedback Submitted</h3>
            <p className="text-gray-600 text-center max-w-md">
              You haven't submitted any feedback yet. Your feedback helps improve our services.
            </p>
          </div>
        )}

        {/* Content when feedback exists */}
        {!loading && !error && feedbacks.length > 0 && (
          <>
            {/* Charts Section */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <FaChartBar className="mr-2 text-indigo-600" />
                Sentiment Analysis
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bar Chart */}
                <div className="h-80">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Feedback by Sentiment</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sentimentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {sentimentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Pie Chart */}
                <div className="h-80">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Sentiment Distribution</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sentimentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {sentimentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedSentiment('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${selectedSentiment === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  All Feedback
                </button>
                <button
                  onClick={() => setSelectedSentiment('positive')}
                  className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${selectedSentiment === 'positive' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  <FaSmile className="mr-1" /> Positive
                </button>
                <button
                  onClick={() => setSelectedSentiment('negative')}
                  className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${selectedSentiment === 'negative' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  <FaFrown className="mr-1" /> Negative
                </button>
                <button
                  onClick={() => setSelectedSentiment('neutral')}
                  className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${selectedSentiment === 'neutral' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  <FaMeh className="mr-1" /> Neutral
                </button>
              </div>

              <div className="flex bg-gray-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md flex items-center ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span className="ml-1 text-sm">Grid</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md flex items-center ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <FaList className="w-4 h-4" />
                  <span className="ml-1 text-sm">List</span>
                </button>
              </div>
            </div>

            {/* Feedback List/Grid */}
            {viewMode === 'grid' ? (
              <div className="grid gap-6 md:grid-cols-2">
                {filteredFeedbacks.map((feedback) => {
                  const sentimentInfo = getSentimentIcon(feedback.sentiment);
                  return (
                    <div
                      key={feedback.id}
                      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                    >
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <div className={`flex items-center px-3 py-1 rounded-full ${sentimentInfo.bg}`}>
                            <span className={sentimentInfo.color}>{sentimentInfo.icon}</span>
                            <span className="ml-2 text-sm font-medium capitalize">{feedback.sentiment || 'neutral'}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <FaCalendarAlt className="mr-1 text-gray-400" />
                            {new Date(feedback.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                          <p className="text-gray-700">{feedback.content || 'No content provided'}</p>
                        </div>

                        {/* Responses Section */}
                        <div className="border-t border-gray-100 pt-4">
                          <h4 className="font-semibold text-gray-700 flex items-center mb-3">
                            <FaUserTie className="mr-2 text-indigo-500" />
                            Staff Responses
                            {feedback.FeedbackResponses?.length > 0 && (
                              <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {feedback.FeedbackResponses.length}
                              </span>
                            )}
                          </h4>

                          {feedback.FeedbackResponses?.length > 0 ? (
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                              {feedback.FeedbackResponses.map((res) => (
                                <div key={res.id} className="bg-indigo-50 p-3 rounded-lg">
                                  <div className="flex justify-between items-start mb-1">
                                    <span className="font-medium text-sm text-gray-800">
                                      {res.responder?.firstName || 'Staff'} {res.responder?.lastName || ''}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {new Date(res.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600">{res.response}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 italic py-2 text-center bg-gray-50 rounded-lg">
                              No responses yet
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback</th>
                        <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sentiment</th>
                        <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responses</th>
                        <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredFeedbacks.map((feedback) => {
                        const sentimentInfo = getSentimentIcon(feedback.sentiment);
                        return (
                          <tr key={feedback.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-6 text-sm text-gray-700 max-w-xs">{feedback.content}</td>
                            <td className="py-4 px-6">
                              <div className={`inline-flex items-center px-3 py-1 rounded-full ${sentimentInfo.bg}`}>
                                <span className={sentimentInfo.color}>{sentimentInfo.icon}</span>
                                <span className="ml-2 text-sm font-medium capitalize">{feedback.sentiment || 'neutral'}</span>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-700">
                              {feedback.FeedbackResponses?.length > 0 ? (
                                <div className="space-y-2">
                                  {feedback.FeedbackResponses.map((res) => (
                                    <div key={res.id} className="bg-gray-100 p-2 rounded">
                                      <p className="font-medium text-xs">{res.responder?.firstName}:</p>
                                      <p className="text-xs">{res.response}</p>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-gray-400 italic">No responses</span>
                              )}
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-500">
                              {new Date(feedback.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FeedbackList;