import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatUsers, fetchChats, sendMessage } from './../../redux/slices/academicSlice';
import { initializeSocket } from './../../apis/endpoints/academicEndpoint';  
import { FaSpinner, FaPaperPlane, FaExclamationCircle, FaSync } from 'react-icons/fa';

const AcademicChatInterface = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { chatUsers, chats, loading, error } = useSelector((state) => state.academic);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const chatRef = useRef(null);

  // Include current user in chatUsers
  const allChatUsers = user
    ? [
        ...chatUsers.filter((u) => u.id !== user.id),
        {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role || 'self',
        },
      ]
    : chatUsers;

  useEffect(() => {
    loadInitialData();
    if (user?.id) {
      initializeSocket(user.id, dispatch);
    }
  }, [dispatch, user]);

  const loadInitialData = () => {
    dispatch(fetchChatUsers());
    dispatch(fetchChats());
  };

  // Auto-scroll to the latest message
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chats, selectedUser]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && selectedUser) {
      dispatch(
        sendMessage({
          senderId: user.id,
          receiverId: selectedUser.id,
          message,
        })
      );
      setMessage('');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        dispatch(fetchChatUsers()),
        dispatch(fetchChats())
      ]);
    } catch (err) {
      console.error("Error refreshing chat:", err);
    } finally {
      setRefreshing(false);
    }
  };

  // Filter chats for the selected user
  const filteredChats = selectedUser
    ? chats.filter(
        (c) =>
          (c.senderId === selectedUser.id && c.receiverId === user.id) ||
          (c.receiverId === selectedUser.id && c.senderId === user.id) ||
          (c.senderId === user.id && c.receiverId === user.id) // Allow self-messaging
      )
    : [];

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-xl rounded-xl overflow-hidden flex flex-col md:flex-row h-[80vh]">
        {/* Sidebar: User List */}
        <div className="w-full md:w-1/3 border-b md:border-r md:border-b-0 border-gray-200 overflow-y-auto">
          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <h2 className="text-2xl font-bold">Chat Users</h2>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 rounded-full hover:bg-blue-600 transition-colors duration-200"
              title="Refresh chats"
            >
              <FaSync className={`text-white ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
          {loading && (
            <div className="flex justify-center py-4">
              <FaSpinner className="animate-spin text-3xl text-blue-500" />
            </div>
          )}
          {error && (
            <p className="text-red-500 p-4 bg-red-50 rounded-md m-2">{error}</p>
          )}
          {!loading && !error && allChatUsers.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              <FaExclamationCircle className="text-4xl mb-2 text-gray-400" />
              <p className="font-semibold">No users available for chat.</p>
            </div>
          )}
          <ul className="divide-y divide-gray-200">
            {allChatUsers.map((u) => (
              <li
                key={u.id}
                className={`p-4 cursor-pointer transition-all duration-200 hover:bg-indigo-50 ${
                  selectedUser?.id === u.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
                onClick={() => setSelectedUser(u)}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-600 font-bold">
                    {u.firstName[0]}
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-800">
                      {u.firstName} {u.lastName} {u.id === user.id ? '(You)' : ''}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">
                      {u.role.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Chat Window */}
        <div className="w-full md:w-2/3 flex flex-col">
          {selectedUser ? (
            <>
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-indigo-500 to-blue-600 text-white">
                <h3 className="font-semibold text-lg flex items-center">
                  Chat with {selectedUser.firstName} {selectedUser.lastName} {selectedUser.id === user.id ? '(You)' : ''}
                </h3>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="p-2 rounded-full hover:bg-blue-600 transition-colors duration-200"
                  title="Refresh messages"
                >
                  <FaSync className={`text-white ${refreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <div
                ref={chatRef}
                className="flex-grow p-4 overflow-y-auto bg-gray-50 space-y-4"
              >
                {filteredChats.length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    <p className="font-semibold">No messages yet.</p>
                    <p className="text-sm">Start the conversation!</p>
                  </div>
                )}
                {filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`flex ${
                      chat.senderId === user.id ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md p-3 rounded-lg shadow-md transition-all duration-200 ${
                        chat.senderId === user.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-800'
                      }`}
                    >
                      <p>{chat.message}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(chat.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <form
                onSubmit={handleSendMessage}
                className="p-2 border-t bg-white flex items-center"
              >
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-grow border border-gray-300 p-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-3 rounded-r-lg hover:bg-blue-600 transition duration-200 flex items-center"
                >
                  <FaPaperPlane className="mr-2" /> Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 bg-gray-50">
              <div className="text-center">
                <FaExclamationCircle className="text-5xl mb-4 text-blue-300" />
                <p className="text-lg font-semibold">Select a user to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcademicChatInterface;