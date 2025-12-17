import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActivities, fetchFeedbacks, fetchChats } from './../../redux/slices/adminSlice';
import { 
  FaSpinner, 
  FaUser, 
  FaComment, 
  FaComments, 
  FaChartLine, 
  FaSearch, 
  FaFilter, 
  FaCalendarAlt,
  FaEye,
  FaArrowUp,
  FaArrowDown,
  FaSync
} from 'react-icons/fa';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const ActivityMonitor = () => {
  const dispatch = useDispatch();
  const { activities, feedbacks, chats, loading, error } = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [timeFilter, setTimeFilter] = useState('all');
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);

  useEffect(() => {
    dispatch(fetchActivities());
    dispatch(fetchFeedbacks());
    dispatch(fetchChats());
  }, [dispatch]);

  useEffect(() => {
    // Filter data based on search and time filter
    const filterData = (data) => {
      let filtered = data;
      
      // Apply time filter
      if (timeFilter !== 'all') {
        const now = new Date();
        const filterDate = new Date();
        
        switch (timeFilter) {
          case 'today':
            filterDate.setHours(0, 0, 0, 0);
            break;
          case 'week':
            filterDate.setDate(filterDate.getDate() - 7);
            break;
          case 'month':
            filterDate.setMonth(filterDate.getMonth() - 1);
            break;
        }
        
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.createdAt);
          return itemDate >= filterDate;
        });
      }
      
      // Apply search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(item => 
          JSON.stringify(item).toLowerCase().includes(term)
        );
      }
      
      return filtered;
    };

    setFilteredActivities(filterData(activities));
    setFilteredFeedbacks(filterData(feedbacks));
    setFilteredChats(filterData(chats));
  }, [activities, feedbacks, chats, searchTerm, timeFilter]);

  const refreshData = () => {
    dispatch(fetchActivities());
    dispatch(fetchFeedbacks());
    dispatch(fetchChats());
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      case 'neutral': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (action) => {
    switch (action?.toLowerCase()) {
      case 'login': return '🔐';
      case 'logout': return '🚪';
      case 'create': return '➕';
      case 'update': return '✏️';
      case 'delete': return '🗑️';
      default: return '📝';
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className={`bg-gradient-to-br from-white to-${color}-50 rounded-xl p-6 border border-${color}-100 shadow-sm`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`bg-${color}-100 p-3 rounded-lg`}>
          <Icon className={`text-${color}-600 text-xl`} />
        </div>
        {trend && (
          <div className={`flex items-center ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
            <span className="text-sm font-semibold">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-1">{value}</h3>
      <p className="text-gray-600 text-sm">{title}</p>
    </div>
  );

  const DataTable = ({ 
    title, 
    data, 
    columns, 
    renderRow,
    emptyMessage = "No data available",
    icon: Icon
  }) => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-indigo-100 p-3 rounded-lg mr-4">
              <Icon className="text-indigo-600 text-lg" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">{title}</h3>
              <p className="text-gray-500 text-sm">{data.length} records found</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              {columns.map((col, index) => (
                <th 
                  key={col.key || col} 
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  {col.label || col}
                </th>
              ))}
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.length > 0 ? data.map((item, index) => renderRow(item, index)) : (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Icon className="text-gray-400 text-xl" />
                    </div>
                    <p className="text-gray-500 font-medium">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {data.length > 0 && (
        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {Math.min(data.length, 10)} of {data.length} entries
          </p>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Previous
            </button>
            <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Activity Dashboard</h1>
          <p className="text-gray-600">Monitor user activities, feedback, and chat interactions in real-time</p>
        </div>
        <button
          onClick={refreshData}
          className="mt-4 md:mt-0 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
        >
          <FaSync className="mr-2" />
          Refresh Data
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title="Total Activities" 
          value={activities.length} 
          icon={FaChartLine} 
          color="indigo"
          trend={5.2}
        />
        <StatCard 
          title="Feedbacks" 
          value={feedbacks.length} 
          icon={FaComment} 
          color="green"
          trend={12.5}
        />
        <StatCard 
          title="Chat Messages" 
          value={chats.length} 
          icon={FaComments} 
          color="blue"
          trend={8.3}
        />
        <StatCard 
          title="Active Users" 
          value={new Set(activities.map(a => a.userId)).size} 
          icon={FaUser} 
          color="purple"
          trend={-2.1}
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search across all activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <FaFilter className="text-gray-400 mr-2" />
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow-inner">
          <FaSpinner className="animate-spin text-4xl text-indigo-500 mb-4" />
          <p className="text-gray-600">Loading activity data...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-full mr-4">
              <FaArrowDown className="text-red-500 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error Loading Data</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <Tabs selectedIndex={selectedTab} onSelect={setSelectedTab}>
        <TabList className="flex border-b border-gray-200">
          <Tab className="px-6 py-3 font-medium text-gray-600 hover:text-indigo-600 cursor-pointer border-b-2 border-transparent data-[selected]:border-indigo-600 data-[selected]:text-indigo-600">
            <div className="flex items-center">
              <FaChartLine className="mr-2" />
              Activities
            </div>
          </Tab>
          <Tab className="px-6 py-3 font-medium text-gray-600 hover:text-indigo-600 cursor-pointer border-b-2 border-transparent data-[selected]:border-indigo-600 data-[selected]:text-indigo-600">
            <div className="flex items-center">
              <FaComment className="mr-2" />
              Feedbacks
            </div>
          </Tab>
          <Tab className="px-6 py-3 font-medium text-gray-600 hover:text-indigo-600 cursor-pointer border-b-2 border-transparent data-[selected]:border-indigo-600 data-[selected]:text-indigo-600">
            <div className="flex items-center">
              <FaComments className="mr-2" />
              Chats
            </div>
          </Tab>
        </TabList>

        <TabPanel>
          <DataTable
            title="User Activities"
            data={filteredActivities}
            icon={FaChartLine}
            columns={[
              { key: 'user', label: 'User' },
              { key: 'action', label: 'Action' },
              { key: 'details', label: 'Details' },
              { key: 'date', label: 'Timestamp' },
            ]}
            renderRow={(activity, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                      <FaUser className="text-indigo-600 text-sm" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {activity.User ? `${activity.User.firstName} ${activity.User.lastName}` : 'N/A'}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {activity.User?.role || 'Unknown role'}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <span className="mr-2">{getActionIcon(activity.action)}</span>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
                      {activity.action}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-xs truncate">
                    {activity.details ? JSON.stringify(activity.details) : 'No details'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {new Date(activity.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(activity.createdAt).toLocaleTimeString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center">
                    <FaEye className="mr-1" />
                    View Details
                  </button>
                </td>
              </tr>
            )}
          />
        </TabPanel>

        <TabPanel>
          <DataTable
            title="User Feedbacks"
            data={filteredFeedbacks}
            icon={FaComment}
            columns={[
              { key: 'user', label: 'User' },
              { key: 'content', label: 'Feedback' },
              { key: 'sentiment', label: 'Sentiment' },
              { key: 'portal', label: 'Portal' },
              { key: 'date', label: 'Submitted' },
            ]}
            renderRow={(feedback, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <FaUser className="text-green-600 text-sm" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {feedback.User ? `${feedback.User.firstName} ${feedback.User.lastName}` : 'Anonymous'}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-md">
                    <p className="text-gray-800 line-clamp-2">{feedback.content}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getSentimentColor(feedback.sentiment)}`}>
                    {feedback.sentiment || 'Unknown'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {feedback.portal}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center">
                    <FaEye className="mr-1" />
                    View Details
                  </button>
                </td>
              </tr>
            )}
          />
        </TabPanel>

        <TabPanel>
          <DataTable
            title="Chat Conversations"
            data={filteredChats}
            icon={FaComments}
            columns={[
              { key: 'sender', label: 'Sender' },
              { key: 'receiver', label: 'Receiver' },
              { key: 'message', label: 'Message' },
              { key: 'sentiment', label: 'Sentiment' },
              { key: 'date', label: 'Time' },
            ]}
            renderRow={(chat, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <FaUser className="text-purple-600 text-sm" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {chat.sender ? `${chat.sender.firstName} ${chat.sender.lastName}` : 'Unknown'}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <FaUser className="text-blue-600 text-sm" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {chat.receiver ? `${chat.receiver.firstName} ${chat.receiver.lastName}` : 'Unknown'}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-xs">
                    <p className="text-gray-800 line-clamp-2">{chat.message}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getSentimentColor(chat.sentiment)}`}>
                    {chat.sentiment || 'Unknown'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {new Date(chat.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(chat.createdAt).toLocaleTimeString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center">
                    <FaEye className="mr-1" />
                    View Conversation
                  </button>
                </td>
              </tr>
            )}
          />
        </TabPanel>
      </Tabs>

      {/* Summary */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Activity Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-gray-800 mb-2">Most Active User</h4>
            <p className="text-gray-600 text-sm">
              {activities.length > 0 ? 
                activities.reduce((acc, activity) => {
                  const userId = activity.userId;
                  acc[userId] = (acc[userId] || 0) + 1;
                  return acc;
                }, {}) : 'No data'}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-gray-800 mb-2">Peak Activity Time</h4>
            <p className="text-gray-600 text-sm">
              {activities.length > 0 ? '9:00 AM - 11:00 AM' : 'No data available'}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-gray-800 mb-2">Overall Sentiment</h4>
            <p className="text-gray-600 text-sm">
              {feedbacks.length > 0 ? 
                'Mostly positive feedback received' : 
                'No feedback available'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityMonitor;