import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeedbacks } from './../../redux/slices/nonacademicSlice';
import { 
  FaSpinner, 
  FaUserGraduate, 
  FaComments, 
  FaCalendarAlt, 
  FaSmile, 
  FaFrown, 
  FaMeh,
  FaExclamationTriangle,
  FaBuilding,
  FaStar,
  FaBug
} from 'react-icons/fa';

const NonAcademicFeedbackList = () => {
  const dispatch = useDispatch();
  
  // Get the ENTIRE nonacademic slice to see its structure
  const nonacademicSlice = useSelector((state) => state.nonAcademic);
  
  // Try different possible structures
  const feedbacks = nonacademicSlice?.feedbacks || nonacademicSlice?.data || [];
  const loading = nonacademicSlice?.loading || nonacademicSlice?.isLoading || false;
  const error = nonacademicSlice?.error || null;

  useEffect(() => {
    dispatch(fetchFeedbacks());
  }, [dispatch]);

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
    
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg mb-4">
            <FaBuilding className="text-3xl text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Administrative Services Feedback
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-2">
            Student feedback about administrative services, facilities, and support systems
          </p>
        </div>

        {/* Stats Summary */}
        {!loading && !error && feedbacks?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg mr-4">
                  <FaComments className="text-2xl text-purple-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{feedbacks.length}</h3>
                  <p className="text-sm text-gray-600">Total Feedback</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center">
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
            </div>
            
            <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center">
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
            
            <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg mr-4">
                  <FaMeh className="text-2xl text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {feedbacks.filter(f => f.sentiment === 'neutral' || !f.sentiment).length}
                  </h3>
                  <p className="text-sm text-gray-600">Neutral</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-lg border border-purple-100">
            <div className="relative">
              <FaSpinner className="animate-spin text-5xl text-purple-600 mb-4" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-pink-200 blur-xl opacity-30"></div>
            </div>
            <p className="text-lg font-medium text-gray-700">Loading Administrative Feedback...</p>
            <p className="text-sm text-gray-500 mt-1">Gathering feedback about facilities and services</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto border border-red-100">
            <div className="flex flex-col items-center mb-6">
              <div className="p-4 bg-red-100 rounded-full mb-4">
                <FaExclamationTriangle className="text-3xl text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-800 mb-2">Unable to Load Feedback</h3>
              <p className="text-gray-600 text-center mb-4">{error}</p>
              <button
                onClick={() => dispatch(fetchFeedbacks())}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center gap-2"
              >
                <FaSpinner className={loading ? 'animate-spin' : 'hidden'} />
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* No Feedback Available */}
        {!loading && !error && (!feedbacks || feedbacks.length === 0) && (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-6">
              <FaComments className="text-5xl text-purple-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Feedback Available</h3>
            <p className="text-gray-600 text-center max-w-md mb-6">
              There are currently no feedback submissions about administrative services.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              API returned data but state structure might be different than expected.
            </p>
            <div className="text-xs text-gray-400 bg-gray-50 p-3 rounded-lg">
              <p>Check browser console for debug information</p>
            </div>
          </div>
        )}

        {/* Feedback List */}
        {!loading && !error && feedbacks?.length > 0 && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                Recent Feedback <span className="text-purple-600">({feedbacks.length})</span>
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaComments className="text-purple-500" />
                <span>Sorted by most recent</span>
              </div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {feedbacks.map((feedback, index) => {
                const sentimentInfo = getSentimentIcon(feedback.sentiment);
                return (
                  <div
                    key={feedback.id || `feedback-${index}`}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group"
                  >
                    {/* Feedback Header */}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                          <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg mr-3">
                            <FaUserGraduate className="text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">
                              {feedback.User?.firstName || 'Student'} {feedback.User?.lastName || ''}
                            </h3>
                            <p className="text-xs text-gray-500">About Administrative Services</p>
                          </div>
                        </div>
                        <div className={`flex items-center px-3 py-1.5 rounded-full ${sentimentInfo.bg} border ${sentimentInfo.color.replace('text-', 'border-')}`}>
                          <span className={sentimentInfo.color}>{sentimentInfo.icon}</span>
                          <span className="ml-2 text-sm font-medium capitalize">
                            {feedback.sentiment || 'neutral'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-500 mb-4 bg-gray-50 p-2 rounded-lg">
                        <FaCalendarAlt className="mr-2 text-gray-400" />
                        {new Date(feedback.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>

                      {/* Feedback Content */}
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl mb-4 border border-gray-200">
                        <p className="text-gray-700 leading-relaxed">{feedback.content || 'No content provided'}</p>
                        {feedback.questionnaireTitle && (
                          <p className="text-xs text-purple-600 mt-2 font-medium">
                            Regarding: {feedback.questionnaireTitle}
                          </p>
                        )}
                      </div>

                      {/* Responses Section */}
                      <div className="border-t border-gray-100 pt-4">
                        <h4 className="font-semibold text-gray-700 flex items-center mb-3">
                          <FaComments className="mr-2 text-purple-500" />
                          Administrative Responses
                          {feedback.FeedbackResponses?.length > 0 && (
                            <span className="ml-2 bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                              {feedback.FeedbackResponses.length}
                            </span>
                          )}
                        </h4>

                        {feedback.FeedbackResponses?.length > 0 ? (
                          <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                            {feedback.FeedbackResponses.map((res) => (
                              <div key={res.id} className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-100">
                                <div className="flex justify-between items-start mb-1">
                                  <span className="font-medium text-sm text-gray-800 flex items-center">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                                    {res.responder?.firstName || 'Staff'} {res.responder?.lastName || ''}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(res.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 pl-4 mt-1">{res.response}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500 italic">Awaiting administrative response</p>
                            <p className="text-xs text-gray-400 mt-1">Respond to provide support</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NonAcademicFeedbackList;