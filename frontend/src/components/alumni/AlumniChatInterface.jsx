import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatUsers, fetchChats, sendMessage } from '../../redux/slices/alumniSlice';
import { initializeSocket } from '../../apis/endpoints/alumniEndpoint';
import { FaSpinner, FaPaperPlane, FaExclamationCircle, FaSync, FaUser, FaArrowLeft } from 'react-icons/fa';

const AlumniChatInterface = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { chatUsers, chats, loading, error } = useSelector((state) => state.alumni);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const chatRef = useRef(null);

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

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chats, selectedUser]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && selectedUser && selectedUser.id !== user.id) {
      dispatch(
        sendMessage({
          senderId: user.id,
          receiverId: selectedUser.id,
          message: message.trim(),
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

  // Filter chats for selected user (excluding self-chat messages)
  const filteredChats = selectedUser
    ? chats.filter(
        (chat) =>
          // Messages between current user and selected user
          (chat.senderId === user.id && chat.receiverId === selectedUser.id) ||
          (chat.senderId === selectedUser.id && chat.receiverId === user.id)
      )
    : [];

  // Sort filtered chats by timestamp
  const sortedChats = [...filteredChats].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  // Filter chat users to exclude current user from the list
  const otherChatUsers = chatUsers.filter(u => u.id !== user.id);

  // Find user's last message timestamp for sorting
  const getUserLastMessageTime = (userId) => {
    const userChats = chats.filter(
      chat => 
        (chat.senderId === userId && chat.receiverId === user.id) ||
        (chat.receiverId === userId && chat.senderId === user.id)
    );
    
    if (userChats.length === 0) return 0;
    
    const lastMessage = userChats.reduce((latest, chat) => {
      const chatTime = new Date(chat.createdAt).getTime();
      return chatTime > latest ? chatTime : latest;
    }, 0);
    
    return lastMessage;
  };

  // Sort users by last message time (most recent first)
  const sortedUsers = [...otherChatUsers].sort((a, b) => {
    const timeA = getUserLastMessageTime(a.id);
    const timeB = getUserLastMessageTime(b.id);
    return timeB - timeA;
  });

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row h-[85vh] border border-gray-200">
        {/* Left Panel - User List */}
        <div className="w-full md:w-1/3 border-b md:border-r border-gray-200 flex flex-col">
          <div className="flex justify-between items-center p-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FaUser className="text-white" />
              Messages
            </h2>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 rounded-full hover:bg-blue-800 transition-colors duration-200"
              title="Refresh chats"
            >
              <FaSync className={`text-white ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          {/* User List */}
          <div className="flex-grow overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <FaSpinner className="animate-spin text-3xl text-blue-600" />
              </div>
            ) : error ? (
              <div className="p-4 m-2 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            ) : sortedUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-gray-500">
                <FaExclamationCircle className="text-5xl mb-4 text-gray-400" />
                <p className="font-semibold text-lg">No users available</p>
                <p className="text-sm mt-1">Start connecting with other alumni!</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {sortedUsers.map((u) => {
                  const userChats = chats.filter(
                    chat => 
                      (chat.senderId === u.id && chat.receiverId === user.id) ||
                      (chat.receiverId === u.id && chat.senderId === user.id)
                  );
                  const lastMessage = userChats[userChats.length - 1];
                  const unreadCount = userChats.filter(chat => 
                    chat.receiverId === user.id && !chat.read
                  ).length;

                  return (
                    <li
                      key={u.id}
                      className={`p-4 cursor-pointer transition-all duration-200 hover:bg-blue-50 ${
                        selectedUser?.id === u.id 
                          ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-600' 
                          : ''
                      }`}
                      onClick={() => setSelectedUser(u)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg">
                              {u.firstName[0]}
                            </div>
                            {unreadCount > 0 && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="text-xs text-white font-bold">{unreadCount}</span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <p className="font-semibold text-gray-800">
                              {u.firstName} {u.lastName}
                            </p>
                            <p className="text-sm text-gray-500 truncate max-w-[150px]">
                              {lastMessage 
                                ? (lastMessage.senderId === user.id ? "You: " : "") + lastMessage.message
                                : "No messages yet"
                              }
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">
                            {lastMessage 
                              ? new Date(lastMessage.createdAt).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })
                              : ''
                            }
                          </p>
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600 capitalize">
                            {u.role.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Right Panel - Chat Window */}
        <div className="w-full md:w-2/3 flex flex-col">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="md:hidden p-2 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <FaArrowLeft className="text-gray-600" />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold">
                    {selectedUser.firstName[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </h3>
                    <p className="text-sm text-gray-500 capitalize">
                      {selectedUser.role.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
                  title="Refresh messages"
                >
                  <FaSync className={`text-blue-600 ${refreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* Messages Area */}
              <div
                ref={chatRef}
                className="flex-grow p-4 overflow-y-auto bg-gradient-to-b from-white to-gray-50 space-y-3"
              >
                {sortedChats.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                      <FaExclamationCircle className="text-3xl text-blue-400" />
                    </div>
                    <p className="text-lg font-semibold">No messages yet</p>
                    <p className="text-sm mt-1">Start the conversation!</p>
                  </div>
                ) : (
                  sortedChats.map((chat) => {
                    const isCurrentUser = chat.senderId === user.id;
                    const chatDate = new Date(chat.createdAt);
                    const today = new Date();
                    const isToday = chatDate.toDateString() === today.toDateString();
                    
                    return (
                      <div
                        key={chat.id}
                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className="max-w-[70%]">
                          <div
                            className={`p-4 rounded-2xl shadow-sm ${
                              isCurrentUser
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none'
                                : 'bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200'
                            }`}
                          >
                            <p className="break-words">{chat.message}</p>
                            <p className={`text-xs mt-2 ${
                              isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {isToday 
                                ? chatDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : chatDate.toLocaleDateString() + ' ' + 
                                  chatDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Message Input */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t bg-white"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Message ${selectedUser.firstName}...`}
                    className="flex-grow border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    disabled={selectedUser.id === user.id}
                  />
                  <button
                    type="submit"
                    disabled={!message.trim() || selectedUser.id === user.id || loading}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaPaperPlane /> 
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </div>
                {selectedUser.id === user.id && (
                  <p className="text-sm text-red-500 mt-2 text-center">
                    You cannot send messages to yourself
                  </p>
                )}
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 bg-gradient-to-br from-gray-50 to-blue-50">
              <div className="text-center p-8">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-6">
                  <FaExclamationCircle className="text-4xl text-blue-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">Welcome to Alumni Chat</h3>
                <p className="text-gray-600 mb-4">Select a user from the list to start chatting</p>
                <div className="text-sm text-gray-500">
                  <p className="mb-1">• Connect with fellow alumni</p>
                  <p className="mb-1">• Share experiences and opportunities</p>
                  <p>• Build your professional network</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlumniChatInterface;