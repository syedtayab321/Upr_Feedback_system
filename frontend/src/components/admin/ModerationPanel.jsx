import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChats, moderateChat } from './../../redux/slices/adminSlice';
import { FaSpinner, FaBan } from 'react-icons/fa';

const ModerationPanel = () => {
  const dispatch = useDispatch();
  const { chats, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);

  const handleModerate = (id) => {
    dispatch(moderateChat(id));
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-scroll">
      <h2 className="text-xl font-semibold bg-indigo-50 p-4 border-b border-indigo-100">Chat Moderation</h2>
      {loading && (
        <div className="flex justify-center items-center h-32">
          <FaSpinner className="animate-spin text-4xl text-indigo-500" />
        </div>
      )}
      {error && <p className="bg-red-50 text-red-700 p-4">{error}</p>}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-indigo-100 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
              <th className="px-6 py-3">Sender</th>
              <th className="px-6 py-3">Receiver</th>
              <th className="px-6 py-3">Message</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-50">
            {chats.map((chat) => (
              <tr key={chat.id} className="hover:bg-indigo-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {chat.sender ? `${chat.sender.firstName} ${chat.sender.lastName}` : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {chat.receiver ? `${chat.receiver.firstName} ${chat.receiver.lastName}` : 'N/A'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{chat.message}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    chat.isModerated ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {chat.isModerated ? 'Moderated' : 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {!chat.isModerated && (
                    <button
                      onClick={() => handleModerate(chat.id)}
                      className="flex items-center px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-xs font-medium"
                    >
                      <FaBan className="mr-1 h-4 w-4" /> Moderate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {chats.length === 0 && <p className="p-4 text-center text-gray-500">No chats available</p>}
    </div>
  );
};

export default ModerationPanel;