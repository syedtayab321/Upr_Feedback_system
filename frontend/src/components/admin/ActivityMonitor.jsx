import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActivities, fetchFeedbacks, fetchChats } from './../../redux/slices/adminSlice';
import { FaSpinner } from 'react-icons/fa';

const ActivityMonitor = () => {
  const dispatch = useDispatch();
  const { activities, feedbacks, chats, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchActivities());
    dispatch(fetchFeedbacks());
    dispatch(fetchChats());
  }, [dispatch]);

  const Table = ({ title, data, columns }) => (
    <div className="mb-8 bg-white rounded-lg shadow-md overflow-scroll">
      <h3 className="text-xl font-semibold bg-indigo-50 p-4 border-b border-indigo-100">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-indigo-100 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
              {columns.map((col) => (
                <th key={col} className="px-6 py-3">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-50">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-indigo-50 transition-colors">
                {Object.values(item).map((value, i) => (
                  <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length === 0 && <p className="p-4 text-center text-gray-500">No data available</p>}
    </div>
  );

  const activityData = activities.map((activity) => ({
    User: activity.User ? `${activity.User.firstName} ${activity.User.lastName}` : 'N/A',
    Action: activity.action,
    Details: JSON.stringify(activity.details) || 'N/A',
    Date: new Date(activity.createdAt).toLocaleString(),
  }));

  const feedbackData = feedbacks.map((feedback) => ({
    User: feedback.User ? `${feedback.User.firstName} ${feedback.User.lastName}` : 'N/A',
    Content: feedback.content,
    Sentiment: feedback.sentiment || 'N/A',
    Portal: feedback.portal,
    Date: new Date(feedback.createdAt).toLocaleString(),
  }));

  const chatData = chats.map((chat) => ({
    Sender: chat.sender ? `${chat.sender.firstName} ${chat.sender.lastName}` : 'N/A',
    Receiver: chat.receiver ? `${chat.receiver.firstName} ${chat.receiver.lastName}` : 'N/A',
    Message: chat.message,
    Sentiment: chat.sentiment || 'N/A',
    Date: new Date(chat.createdAt).toLocaleString(),
  }));

  return (
    <div>
      {loading && (
        <div className="flex justify-center items-center h-32">
          <FaSpinner className="animate-spin text-4xl text-indigo-500" />
        </div>
      )}
      {error && <p className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">{error}</p>}

      <Table 
        title="User Activities" 
        data={activityData} 
        columns={['User', 'Action', 'Details', 'Date']} 
      />
      <Table 
        title="Feedbacks" 
        data={feedbackData} 
        columns={['User', 'Content', 'Sentiment', 'Portal', 'Date']} 
      />
      <Table 
        title="Chats" 
        data={chatData} 
        columns={['Sender', 'Receiver', 'Message', 'Sentiment', 'Date']} 
      />
    </div>
  );
};

export default ActivityMonitor;