import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeedbacks } from './../../redux/slices/alumniSlice';
import { 
  FaSpinner, 
  FaSmile, 
  FaFrown, 
  FaMeh, 
  FaStar,
  FaCommentDots,
  FaChartBar,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaThumbsUp,
  FaThumbsDown,
  FaRegClock
} from 'react-icons/fa';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AlumniFeedbackList = () => {
  const dispatch = useDispatch();
  const { feedbacks, loading, error } = useSelector((state) => state.alumni);

  useEffect(() => {
    dispatch(fetchFeedbacks());
  }, [dispatch]);

  // Calculate sentiment statistics
  const sentimentStats = useMemo(() => {
    const stats = {
      positive: 0,
      negative: 0,
      neutral: 0,
      total: feedbacks.length
    };

    feedbacks.forEach(feedback => {
      const sentiment = feedback.sentiment?.toLowerCase();
      if (sentiment === 'positive') stats.positive++;
      else if (sentiment === 'negative') stats.negative++;
      else stats.neutral++;
    });

    return stats;
  }, [feedbacks]);

  // Prepare data for charts
  const sentimentChartData = useMemo(() => [
    { name: 'Positive', value: sentimentStats.positive, color: '#10B981' },
    { name: 'Neutral', value: sentimentStats.neutral, color: '#6366F1' },
    { name: 'Negative', value: sentimentStats.negative, color: '#EF4444' }
  ], [sentimentStats]);

  const responseRateData = useMemo(() => {
    const responded = feedbacks.filter(f => f.FeedbackResponses?.length > 0).length;
    const notResponded = feedbacks.length - responded;
    return [
      { name: 'Responded', value: responded, color: '#10B981' },
      { name: 'Not Responded', value: notResponded, color: '#9CA3AF' }
    ];
  }, [feedbacks]);

  const sentimentDistributionData = useMemo(() => [
    { sentiment: 'Positive', count: sentimentStats.positive },
    { sentiment: 'Neutral', count: sentimentStats.neutral },
    { sentiment: 'Negative', count: sentimentStats.negative }
  ], [sentimentStats]);

  // Get sentiment icon
  const getSentimentIcon = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive': return <FaThumbsUp className="text-green-500 text-lg" />;
      case 'negative': return <FaThumbsDown className="text-red-500 text-lg" />;
      default: return <FaMeh className="text-blue-500 text-lg" />;
    }
  };

  // Get sentiment badge color
  const getSentimentColor = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3">
                <FaCommentDots className="text-blue-600" />
                Your Feedback History
              </h1>
              <p className="text-gray-600 mt-2">Track all your submitted feedback and responses</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FaCalendarAlt />
              <span>{new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Feedback</p>
                  <p className="text-3xl font-bold text-gray-800">{sentimentStats.total}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FaCommentDots className="text-blue-600 text-2xl" />
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-500">
                All time submissions
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Positive</p>
                  <p className="text-3xl font-bold text-green-600">{sentimentStats.positive}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <FaThumbsUp className="text-green-600 text-2xl" />
                </div>
              </div>
              <div className="mt-4">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${(sentimentStats.positive / sentimentStats.total) * 100 || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Neutral</p>
                  <p className="text-3xl font-bold text-blue-600">{sentimentStats.neutral}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FaMeh className="text-blue-600 text-2xl" />
                </div>
              </div>
              <div className="mt-4">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${(sentimentStats.neutral / sentimentStats.total) * 100 || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Negative</p>
                  <p className="text-3xl font-bold text-red-600">{sentimentStats.negative}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <FaThumbsDown className="text-red-600 text-2xl" />
                </div>
              </div>
              <div className="mt-4">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 rounded-full"
                    style={{ width: `${(sentimentStats.negative / sentimentStats.total) * 100 || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Sentiment Distribution Pie Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FaChartBar className="text-blue-600" />
                  Sentiment Distribution
                </h3>
                <span className="text-sm text-gray-500">Overall</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sentimentChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {sentimentChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value} feedbacks`, 'Count']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Response Rate & Bar Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FaStar className="text-yellow-600" />
                  Feedback Analytics
                </h3>
                <span className="text-sm text-gray-500">Detailed View</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sentimentDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="sentiment" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="count" 
                      name="Feedback Count" 
                      radius={[4, 4, 0, 0]}
                      fill="#8884d8"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {/* Response Rate Info */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-500" />
                    <span className="text-sm text-gray-700">
                      {responseRateData[0].value} feedbacks have responses
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaRegClock className="text-gray-400" />
                    <span className="text-sm text-gray-700">
                      {responseRateData[1].value} awaiting response
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Table */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Table Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">All Feedback Submissions</h2>
                  <p className="text-gray-600 text-sm mt-1">Your complete feedback history with responses</p>
                </div>
                {loading && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <FaSpinner className="animate-spin" />
                    <span>Loading feedback...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="m-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <FaExclamationTriangle className="text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium text-red-800">Error loading feedback</p>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Feedback List */}
            <div className="overflow-x-auto">
              {feedbacks.length === 0 ? (
                <div className="text-center py-12">
                  <FaCommentDots className="text-4xl text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700">No feedback submitted yet</h3>
                  <p className="text-gray-500 mt-1">Submit your first feedback to see it here</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-4 text-left text-sm font-semibold text-gray-700 border-b">Feedback Content</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700 border-b">Sentiment</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700 border-b">Responses</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700 border-b">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {feedbacks.map((feedback) => (
                      <tr 
                        key={feedback.id} 
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="p-4">
                          <div className="max-w-md">
                            <p className="text-gray-800 line-clamp-2">{feedback.content}</p>
                            {feedback.questionnaireTitle && (
                              <span className="text-xs text-gray-500 mt-1 inline-block">
                                Regarding: {feedback.questionnaireTitle}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {getSentimentIcon(feedback.sentiment)}
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSentimentColor(feedback.sentiment)}`}>
                              {feedback.sentiment || 'Neutral'}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-2 max-w-xs">
                            {feedback.FeedbackResponses?.length > 0 ? (
                              feedback.FeedbackResponses.map((response) => (
                                <div 
                                  key={response.id} 
                                  className="bg-blue-50 rounded-lg p-3 border border-blue-100"
                                >
                                  <div className="flex items-start gap-2">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                      <span className="text-xs font-bold text-blue-600">
                                        {response.responder?.firstName?.[0] || 'A'}
                                      </span>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-800">
                                        {response.responder?.firstName || 'Admin'} {response.responder?.lastName || ''}
                                      </p>
                                      <p className="text-sm text-gray-600 mt-1">{response.response}</p>
                                      <p className="text-xs text-gray-400 mt-1">
                                        {new Date(response.createdAt).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-3 text-gray-500">
                                <FaRegClock className="mx-auto mb-2 text-gray-400" />
                                <p className="text-sm">Awaiting response</p>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-800">
                              {new Date(feedback.createdAt).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(feedback.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer Stats */}
            {feedbacks.length > 0 && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm text-gray-600">
                  <div>
                    Showing <span className="font-semibold">{feedbacks.length}</span> feedback submissions
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>Positive: {sentimentStats.positive}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span>Neutral: {sentimentStats.neutral}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span>Negative: {sentimentStats.negative}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniFeedbackList;