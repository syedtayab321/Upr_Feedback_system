import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeedbacks } from './../../redux/slices/academicSlice';
import FeedbackResponseForm from './FeedbackResponseForm';
import { FaSpinner, FaExclamationCircle, FaComments, FaUserGraduate, FaCalendarAlt, FaSmile, FaFrown, FaMeh } from 'react-icons/fa';

const AcademicFeedbackList = () => {
  const dispatch = useDispatch();
  const { feedbacks, loading, error } = useSelector((state) => state.academic);
  const [expandedFeedback, setExpandedFeedback] = useState(null);

  useEffect(() => {
    dispatch(fetchFeedbacks());
  }, [dispatch]);

  // Function to toggle feedback expansion
  const toggleExpand = (id) => {
    if (expandedFeedback === id) {
      setExpandedFeedback(null);
    } else {
      setExpandedFeedback(id);
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-white rounded-full shadow-lg mb-4">
            <FaComments className="text-3xl text-indigo-600 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Student Feedback</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Valuable insights from students to help improve academic experience
          </p>
        </div>

        {/* Stats Summary */}
        {!loading && !error && feedbacks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-lg">
            <FaSpinner className="animate-spin text-5xl text-indigo-600 mb-4" />
            <p className="text-lg font-medium text-gray-700">Loading feedback...</p>
            <p className="text-sm text-gray-500 mt-1">Please wait while we fetch the latest feedback</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-white rounded-2xl p-6 shadow-lg max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <FaExclamationCircle className="text-3xl text-red-600" />
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
              <FaExclamationCircle className="text-4xl text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Feedback Available</h3>
            <p className="text-gray-600 text-center max-w-md">
              It looks like there are no feedback submissions yet. Check back later or encourage students to share their thoughts.
            </p>
          </div>
        )}

        {/* Feedback List */}
        {!loading && !error && feedbacks.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {feedbacks.map((feedback) => {
              const sentimentInfo = getSentimentIcon(feedback.sentiment);
              return (
                <div
                  key={feedback.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  {/* Feedback Header */}
                  <div 
                    className="p-5 cursor-pointer"
                    onClick={() => toggleExpand(feedback.id)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                          <FaUserGraduate className="text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {feedback.User?.firstName || 'N/A'} {feedback.User?.lastName || ''}
                          </h3>
                          <p className="text-xs text-gray-500">Student</p>
                        </div>
                      </div>
                      <div className={`flex items-center px-3 py-1 rounded-full ${sentimentInfo.bg}`}>
                        <span className={sentimentInfo.color}>{sentimentInfo.icon}</span>
                        <span className="ml-2 text-sm font-medium capitalize">{feedback.sentiment || 'neutral'}</span>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <FaCalendarAlt className="mr-2 text-gray-400" />
                      {new Date(feedback.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>

                    {/* Feedback Content (Truncated if not expanded) */}
                    <div className="text-gray-700">
                      {expandedFeedback === feedback.id ? (
                        <p>{feedback.content || 'No content provided'}</p>
                      ) : (
                        <p className="line-clamp-3">{feedback.content || 'No content provided'}</p>
                      )}
                    </div>

                    {feedback.content && feedback.content.length > 150 && (
                      <button 
                        onClick={() => toggleExpand(feedback.id)}
                        className="text-indigo-600 text-sm font-medium mt-2 hover:underline"
                      >
                        {expandedFeedback === feedback.id ? 'Show less' : 'Read more'}
                      </button>
                    )}
                  </div>

                  {/* Responses Section */}
                  <div className="border-t border-gray-100 p-5 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-700 flex items-center">
                        <FaComments className="mr-2 text-indigo-500" />
                        Responses
                        {feedback.FeedbackResponses?.length > 0 && (
                          <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {feedback.FeedbackResponses.length}
                          </span>
                        )}
                      </h4>
                    </div>

                    {feedback.FeedbackResponses?.length > 0 ? (
                      <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {feedback.FeedbackResponses.map((res) => (
                          <div key={res.id} className="bg-white p-3 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-medium text-sm text-gray-800">
                                {res.responder?.firstName || 'Unknown'} {res.responder?.lastName || ''}
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
                      <p className="text-sm text-gray-500 italic py-2 text-center bg-white rounded-lg border border-gray-200">
                        No responses yet
                      </p>
                    )}

                    {/* Feedback Response Form */}
                    <div className="mt-4">
                      <FeedbackResponseForm feedbackId={feedback.id} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AcademicFeedbackList;