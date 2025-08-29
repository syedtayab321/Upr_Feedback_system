import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeedbacks } from './../../redux/slices/alumniSlice';
import { FaSpinner } from 'react-icons/fa';

const AlumniFeedbackList = () => {
  const dispatch = useDispatch();
  const { feedbacks, loading, error } = useSelector((state) => state.alumni);

  useEffect(() => {
    dispatch(fetchFeedbacks());
  }, [dispatch]);

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Your Feedback</h2>
      {loading && <FaSpinner className="animate-spin text-2xl text-blue-500" />}
      {error && <p className="text-red-500">{error}</p>}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Feedback</th>
              <th className="border p-2">Sentiment</th>
              <th className="border p-2">Responses</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((feedback) => (
              <tr key={feedback.id}>
                <td className="border p-2">{feedback.content}</td>
                <td className="border p-2 capitalize">{feedback.sentiment || 'N/A'}</td>
                <td className="border p-2">
                  {feedback.FeedbackResponses?.map((res) => (
                    <div key={res.id} className="mb-2">
                      <p><strong>{res.responder?.firstName}:</strong> {res.response}</p>
                    </div>
                  )) || 'No responses'}
                </td>
                <td className="border p-2">{new Date(feedback.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AlumniFeedbackList;