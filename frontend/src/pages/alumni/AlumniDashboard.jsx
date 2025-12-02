import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProtectedRoute from "./../../routes/ProtectedRoutes.jsx";
import Sidebar from "./../../components/common/Sidebar.jsx";
import LogoutModal from "./../../components/common/LogoutModal.jsx";
import AlumniFeedbackForm from "./../../components/alumni/AlumniFeedbackForm.jsx";
import AlumniFeedbackList from "./../../components/alumni/AlumniFeedbackList.jsx";
import AlumniChatInterface from "./../../components/alumni/AlumniChatInterface.jsx";
import { FaPaperPlane, FaList, FaBars, FaSignOutAlt, FaComment } from "react-icons/fa";
import { logout } from "./../../redux/slices/authSlice";

const AlumniDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("feedback");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const tabs = [
    { id: "feedback", label: "Share Feedback", icon: FaPaperPlane, path: "/alumni/feedback" },
    { id: "feedbacks", label: "View Feedback", icon: FaList, path: "/alumni/feedbacks" },
    { id: "chat", label: "Chat", icon: FaComment, path: "/alumni/chat" },
  ];

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/login");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "feedback":
        return <AlumniFeedbackForm />;
      case "feedbacks":
        return <AlumniFeedbackList />;
      case "chat":
        return <AlumniChatInterface />;
      default:
        return <AlumniFeedbackForm />;
    }
  };

  return (
    <ProtectedRoute allowedRoles={["alumni"]}>
      <div className="min-h-screen bg-gray-100 flex flex-col overflow-hidden scrollbar-transparent">
        <header className="bg-gradient-to-r from-navy-800 to-navy-600 text-white bg-blue-950 shadow-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center">
              <button
                className="md:hidden text-white hover:text-navy-200 mr-4"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <FaBars className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">Alumni Dashboard</h1>
                <p className="text-sm opacity-80">
                  Welcome, {user?.firstName || "Alumni"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="flex items-center px-3 py-2 sm:px-4 sm:py-2 text-sm font-medium text-navy-600 bg-white text-black cursor-pointer rounded-md hover:bg-navy-200 hover:text-navy-800 transition-colors"
            >
              <FaSignOutAlt className="mr-2 h-4 w-4" />
              Logout
            </button>
          </div>
        </header>

        <div className="flex h-[90vh] overflow-hidden scrollbar-transparent">
          <Sidebar
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            setIsLogoutModalOpen={setIsLogoutModalOpen}
          />

          <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-scroll">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </main>
        </div>

        <LogoutModal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          onConfirm={handleLogout}
        />
      </div>
    </ProtectedRoute>
  );
};

export default AlumniDashboard;