import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatUsers, fetchChats, sendMessage } from './../../redux/slices/academicSlice';
import { initializeSocket } from './../../apis/endpoints/academicEndpoint';  
import { FaSpinner, FaPaperPlane, FaExclamationCircle, FaSync, FaUser, FaArrowLeft } from 'react-icons/fa';

const AcademicChatInterface = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { chatUsers = [], chats = [], loading, error } = useSelector((state) => state.academic);
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

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatRef.current) {
      setTimeout(() => {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }, 100);
    }
  }, [chats, selectedUser]);

  const allChatParticipants = useMemo(() => {
  if (!chats || !Array.isArray(chats)) return [];
  
  const participants = new Map();
  const currentUserId = user?.id;
  
  // Add ALL users from chatUsers first
  chatUsers.forEach(u => {
    participants.set(u.id, u);
  });
  
  // Add users from chat history
  chats.forEach(chat => {
    if (chat.sender && chat.sender.id) {
      participants.set(chat.sender.id, chat.sender);
    } else if (chat.senderId) {
      if (!participants.has(chat.senderId)) {
        participants.set(chat.senderId, {
          id: chat.senderId,
          firstName: 'Unknown',
          lastName: 'User',
          role: 'user'
        });
      }
    }
    
    if (chat.receiver && chat.receiver.id) {
      participants.set(chat.receiver.id, chat.receiver);
    } else if (chat.receiverId) {
      if (!participants.has(chat.receiverId)) {
        participants.set(chat.receiverId, {
          id: chat.receiverId,
          firstName: 'Unknown',
          lastName: 'User',
          role: 'user'
        });
      }
    }
  });
  
  // Filter out current user
  return Array.from(participants.values()).filter(u => u.id !== currentUserId);
}, [chats, chatUsers, user]);

  useEffect(() => {
    if (!selectedUser && allChatParticipants.length > 0) {
      setSelectedUser(allChatParticipants[0]);
    }
  }, [allChatParticipants, selectedUser]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && selectedUser && user?.id !== selectedUser.id) {
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

  const filteredChats = useMemo(() => {
    if (!selectedUser || !user || !chats || !Array.isArray(chats)) {
      return [];
    }

    return chats.filter(chat => {
      if (!chat) return false;
      
      const senderId = chat.senderId || chat.sender?.id || chat.sender;
      const receiverId = chat.receiverId || chat.receiver?.id || chat.receiver;
    
      
      return (
        (senderId === user.id && receiverId === selectedUser.id) ||
        (senderId === selectedUser.id && receiverId === user.id)
      );
    });
  }, [chats, selectedUser, user]);

  const sortedChats = [...filteredChats].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.timestamp || Date.now());
    const dateB = new Date(b.createdAt || b.timestamp || Date.now());
    return dateA - dateB;
  });

  const getUserDisplayInfo = (userObj) => {
    if (!userObj) return { name: 'Unknown User', initial: '?', role: 'user' };
    
    const firstName = userObj.firstName || userObj.name || '';
    const lastName = userObj.lastName || '';
    const name = `${firstName} ${lastName}`.trim() || 'Unknown User';
    
    return {
      name,
      initial: (firstName[0] || name[0] || '?').toUpperCase(),
      role: userObj.role || userObj.type || 'user',
      id: userObj.id || userObj._id
    };
  };

  const getLastMessage = (userId) => {
    if (!chats || !Array.isArray(chats)) return null;
    
    const userChats = chats.filter(chat => {
      const senderId = chat.senderId || chat.sender?.id || chat.sender;
      const receiverId = chat.receiverId || chat.receiver?.id || chat.receiver;
      return senderId === userId || receiverId === userId;
    });
    
    if (userChats.length === 0) return null;
    
    return [...userChats].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.timestamp || 0);
      const dateB = new Date(b.createdAt || b.timestamp || 0);
      return dateB - dateA;
    })[0];
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row h-[85vh] border border-gray-200">
        {/* Left Panel - User List */}
        <div className="w-full md:w-1/3 border-b md:border-r border-gray-200 flex flex-col">
          <div className="flex justify-between items-center p-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FaUser className="text-white" />
              Academic Chat
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
            ) : allChatParticipants.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-gray-500">
                <FaExclamationCircle className="text-5xl mb-4 text-gray-400" />
                <p className="font-semibold text-lg">No conversations yet</p>
                <p className="text-sm mt-1">Start chatting with someone!</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {allChatParticipants.map((u) => {
                  const userInfo = getUserDisplayInfo(u);
                  const lastMessage = getLastMessage(userInfo.id);
                  
                  return (
                    <li
                      key={userInfo.id}
                      className={`p-4 cursor-pointer transition-all duration-200 hover:bg-blue-50 ${
                        selectedUser?.id === userInfo.id 
                          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600' 
                          : ''
                      }`}
                      onClick={() => setSelectedUser(u)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                              {userInfo.initial}
                            </div>
                          </div>
                          <div className="ml-4">
                            <p className="font-semibold text-gray-800">
                              {userInfo.name}
                            </p>
                            <p className="text-sm text-gray-500 truncate max-w-[150px]">
                              {lastMessage 
                                ? (lastMessage.senderId === user.id ? "You: " : "") + 
                                  (lastMessage.message?.length > 30 
                                    ? lastMessage.message.substring(0, 30) + "..." 
                                    : lastMessage.message)
                                : "No messages yet"
                              }
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              ID: {userInfo.id.substring(0, 8)}...
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {lastMessage && (
                            <p className="text-xs text-gray-400">
                              {new Date(lastMessage.createdAt || lastMessage.timestamp).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          )}
                          <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-600 capitalize mt-1 inline-block">
                            {userInfo.role.replace('_', ' ')}
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
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-100 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="md:hidden p-2 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <FaArrowLeft className="text-gray-600" />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                    {getUserDisplayInfo(selectedUser).initial}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {getUserDisplayInfo(selectedUser).name}
                    </h3>
                    <p className="text-sm text-gray-500 capitalize">
                      {getUserDisplayInfo(selectedUser).role.replace('_', ' ')}
                    </p>
                    <p className="text-xs text-gray-400">
                      ID: {selectedUser.id}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {filteredChats.length} messages
                  </span>
                  <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
                    title="Refresh messages"
                  >
                    <FaSync className={`text-blue-600 ${refreshing ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div
                ref={chatRef}
                className="flex-grow p-4 overflow-y-auto bg-gradient-to-b from-white to-blue-50 space-y-3"
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
                  sortedChats.map((chat, index) => {
                    const senderId = chat.senderId || chat.sender?.id || chat.sender;
                    const isCurrentUser = senderId === user.id;
                    const chatDate = new Date(chat.createdAt || chat.timestamp || Date.now());
                    const today = new Date();
                    const isToday = chatDate.toDateString() === today.toDateString();
                    
                    return (
                      <div
                        key={chat.id || chat._id || `chat-${index}`}
                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className="max-w-[70%]">
                          <div
                            className={`p-4 rounded-2xl shadow-sm ${
                              isCurrentUser
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-br-none'
                                : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                            }`}
                          >
                            <p className="break-words">{chat.message || chat.content}</p>
                            <div className="flex justify-between items-center mt-2">
                              <p className={`text-xs ${
                                isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                                {isToday 
                                  ? chatDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                  : chatDate.toLocaleDateString() + ' ' + 
                                    chatDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                }
                              </p>
                              <p className={`text-xs ${
                                isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                                {isCurrentUser ? 'Sent' : 'Received'}
                              </p>
                            </div>
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
                    placeholder={`Message ${getUserDisplayInfo(selectedUser).name}...`}
                    className="flex-grow border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    disabled={selectedUser.id === user?.id}
                  />
                  <button
                    type="submit"
                    disabled={!message.trim() || selectedUser.id === user?.id || loading}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaPaperPlane /> 
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </div>
                {selectedUser.id === user?.id && (
                  <p className="text-sm text-red-500 mt-2 text-center">
                    You cannot send messages to yourself
                  </p>
                )}
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="text-center p-8">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center mb-6">
                  <FaExclamationCircle className="text-4xl text-blue-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">Academic Chat</h3>
                <p className="text-gray-600 mb-4">Select a user to start chatting</p>
                <div className="text-sm text-gray-500">
                  <p className="mb-1">• Total conversations: {allChatParticipants.length}</p>
                  <p className="mb-1">• Total messages: {chats.length}</p>
                  <p>• Users with message history will appear here</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcademicChatInterface;